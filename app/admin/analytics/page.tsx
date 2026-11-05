'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Users, TrendingDown, Clock, CheckCircle2, AlertTriangle, BarChart3, RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from '@/app/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer, Cell } from 'recharts';
import Link from 'next/link';

interface StepStat {
  step: string;
  label: string;
  entered: number;
  completed: number;
  avgDuration: number;
}

interface FunnelSummary {
  enabled: boolean;
  steps: StepStat[];
  sessions: { total: number; completed: number };
  trends: Array<Record<string, number | string>>;
  recentEvents: Array<{
    id: string;
    sessionId: string;
    step: string;
    eventType: string;
    timestamp: string;
    duration: number | null;
  }>;
}

const stepColors = ['#36bff9', '#2aa8e0', '#1e90d0', '#1678b8'];

const funnelChartConfig: ChartConfig = {
  entered: { label: 'Entered', color: '#36bff9' },
  completed: { label: 'Completed', color: '#2aa8e0' },
};

const trendChartConfig: ChartConfig = {
  your_info: { label: 'Your Info', color: '#36bff9' },
  pick_plan: { label: 'Pick Your Plan', color: '#2aa8e0' },
  customize: { label: 'Customize', color: '#1e90d0' },
  checkout: { label: 'Checkout', color: '#1678b8' },
};

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function getStepLabel(step: string): string {
  const labels: Record<string, string> = {
    your_info: 'Your Info',
    pick_plan: 'Pick Your Plan',
    customize: 'Customize',
    checkout: 'Checkout',
  };
  return labels[step] || step;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<FunnelSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/funnel/summary');
      if (!res.ok) throw new Error('Failed to load analytics');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError('Could not load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8" data-testid="analytics-loading">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl" />
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8 flex items-center justify-center" data-testid="analytics-error">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchData} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data || !data.enabled) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8 flex items-center justify-center" data-testid="analytics-disabled">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Funnel Tracking Disabled</h2>
            <p className="text-gray-600">
              Enable tracking by setting the <code className="bg-gray-100 px-2 py-1 rounded text-sm">NEXT_PUBLIC_ENABLE_FUNNEL_TRACKING</code> environment variable to <code className="bg-gray-100 px-2 py-1 rounded text-sm">true</code>.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const conversionRate = data.sessions.total > 0
    ? ((data.sessions.completed / data.sessions.total) * 100).toFixed(1)
    : '0.0';

  const biggestDropoff = data.steps.reduce<{ step: string; drop: number } | null>((worst, stat, idx) => {
    if (idx === 0) return null;
    const prevEntered = data.steps[idx - 1].entered;
    const drop = prevEntered > 0 ? prevEntered - stat.entered : 0;
    const dropRate = prevEntered > 0 ? (drop / prevEntered) * 100 : 0;
    if (!worst || dropRate > worst.drop) {
      return { step: stat.label, drop: dropRate };
    }
    return worst;
  }, null);

  const avgTimeTotal = data.steps.reduce((sum, s) => sum + s.avgDuration, 0);

  return (
    <div className="signup-shell p-3 sm:p-4 lg:p-8" data-testid="analytics-dashboard">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 sm:mb-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <Link href="/" className="shrink-0">
              <Button variant="ghost" size="icon" className="h-10 w-10" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight" data-testid="heading-analytics">
                Sign-Up Funnel Analytics
              </h1>
              <p className="text-sm text-gray-500">Track where users drop off in the sign-up flow</p>
            </div>
          </div>
          <Button onClick={fetchData} variant="outline" size="sm" className="shrink-0" data-testid="button-refresh">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <Card data-testid="card-total-sessions">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:flex w-10 h-10 rounded-lg bg-gray-100 items-center justify-center">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Sessions</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 tabular-nums" data-testid="text-total-sessions">{data.sessions.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-completed">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:flex w-10 h-10 rounded-lg bg-gray-100 items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 tabular-nums" data-testid="text-completed">{data.sessions.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-conversion">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:flex w-10 h-10 rounded-lg bg-gray-100 items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Conversion Rate</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 tabular-nums" data-testid="text-conversion">{conversionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-avg-time">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:flex w-10 h-10 rounded-lg bg-gray-100 items-center justify-center">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Total Time</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 tabular-nums" data-testid="text-avg-time">{formatDuration(avgTimeTotal)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card data-testid="card-funnel-chart">
            <CardHeader>
              <CardTitle className="text-lg">Funnel Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {data.steps.some(s => s.entered > 0) ? (
                <ChartContainer config={funnelChartConfig} className="h-[300px] w-full">
                  <BarChart data={data.steps} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="label" width={80} tick={{ fontSize: 13 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="entered" name="Entered" radius={[0, 4, 4, 0]}>
                      {data.steps.map((_, idx) => (
                        <Cell key={idx} fill={stepColors[idx % stepColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>No data yet. Users need to visit the sign-up flow first.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card data-testid="card-dropoff">
            <CardHeader>
              <CardTitle className="text-lg">Step-by-Step Drop-off</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.steps.map((stat, idx) => {
                  const prevEntered = idx > 0 ? data.steps[idx - 1].entered : stat.entered;
                  const dropRate = prevEntered > 0 && idx > 0
                    ? (((prevEntered - stat.entered) / prevEntered) * 100).toFixed(1)
                    : '0.0';
                  const fillPercent = data.steps[0].entered > 0
                    ? (stat.entered / data.steps[0].entered) * 100
                    : 0;

                  return (
                    <div key={stat.step} data-testid={`dropoff-step-${stat.step}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">{stat.entered} users</span>
                          {idx > 0 && parseFloat(dropRate) > 0 && (
                            <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                              -{dropRate}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${fillPercent}%`,
                            backgroundColor: stepColors[idx % stepColors.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
                {biggestDropoff && biggestDropoff.drop > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200" data-testid="text-biggest-dropoff">
                    <p className="text-sm text-amber-800">
                      <AlertTriangle className="h-4 w-4 inline mr-1" />
                      Biggest drop-off: <strong>{biggestDropoff.step}</strong> ({biggestDropoff.drop.toFixed(1)}% of users leave here)
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card data-testid="card-time-per-step">
            <CardHeader>
              <CardTitle className="text-lg">Average Time per Step</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.steps.map((stat, idx) => (
                  <div key={stat.step} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-testid={`time-step-${stat.step}`}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stepColors[idx % stepColors.length] }}
                      />
                      <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {stat.avgDuration > 0 ? formatDuration(stat.avgDuration) : 'No data'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-trends">
            <CardHeader>
              <CardTitle className="text-lg">Daily Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {data.trends.length > 0 ? (
                <ChartContainer config={trendChartConfig} className="h-[250px] w-full">
                  <LineChart data={data.trends} margin={{ left: 0, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="your_info" name="Your Info" stroke="#36bff9" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="pick_plan" name="Pick Your Plan" stroke="#2aa8e0" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="customize" name="Customize" stroke="#1e90d0" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="checkout" name="Checkout" stroke="#1678b8" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ChartContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Trend data will appear after multiple sessions.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card data-testid="card-recent-events">
          <CardHeader>
            <CardTitle className="text-lg">Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentEvents && data.recentEvents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Session</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Step</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Event</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Time</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentEvents.map((event) => (
                      <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50" data-testid={`event-row-${event.id}`}>
                        <td className="py-3 px-4 font-mono text-xs text-gray-500">
                          {event.sessionId.slice(0, 12)}...
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: stepColors[
                                  ['your_info', 'pick_plan', 'customize', 'checkout'].indexOf(event.step) % stepColors.length
                                ],
                              }}
                            />
                            {getStepLabel(event.step)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            event.eventType === 'enter'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-green-50 text-green-700'
                          }`}>
                            {event.eventType === 'enter' ? 'Entered' : 'Completed'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {event.duration !== null ? formatDuration(event.duration) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No events recorded yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
