'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, MapPin, Package, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useOrder } from '../context';

function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      decay: number;
      size: number;
    }

    interface Rocket {
      x: number;
      y: number;
      vy: number;
      targetY: number;
      color: string;
      trail: { x: number; y: number; alpha: number }[];
    }

    const particles: Particle[] = [];
    const colors = ['#ff2d2d', '#ffdd00', '#00e676', '#2979ff', '#ff4081', '#36bff9', '#ff9100', '#d500f9', '#ffea00', '#00e5ff'];

    function explodeBurst(centerX: number, centerY: number) {
      const burstColors = [
        colors[Math.floor(Math.random() * colors.length)],
        colors[Math.floor(Math.random() * colors.length)],
        colors[Math.floor(Math.random() * colors.length)],
      ];
      const positions = [
        { x: centerX - w * 0.15, y: centerY - h * 0.05 },
        { x: centerX, y: centerY + h * 0.08 },
        { x: centerX + w * 0.15, y: centerY - h * 0.03 },
        { x: centerX - w * 0.08, y: centerY + h * 0.02 },
        { x: centerX + w * 0.08, y: centerY - h * 0.06 },
      ];
      for (const pos of positions) {
        const mainColor = burstColors[Math.floor(Math.random() * burstColors.length)];
        const count = 120 + Math.floor(Math.random() * 40);
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
          const speed = Math.random() * 9 + 3;
          particles.push({
            x: pos.x + (Math.random() - 0.5) * 10,
            y: pos.y + (Math.random() - 0.5) * 10,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color: Math.random() > 0.2 ? mainColor : colors[Math.floor(Math.random() * colors.length)],
            decay: Math.random() * 0.01 + 0.008,
            size: Math.random() * 4 + 1.5,
          });
        }
      }
    }

    let animId: number;
    const startTime = Date.now();

    const burstTimes = [100, 1300, 2500];
    const burstsLaunched = [false, false, false];
    const burstCenters = [
      { x: w * 0.3, y: h * 0.3 },
      { x: w * 0.6, y: h * 0.25 },
      { x: w * 0.45, y: h * 0.35 },
    ];

    function loop() {
      const elapsed = Date.now() - startTime;

      for (let b = 0; b < burstTimes.length; b++) {
        if (!burstsLaunched[b] && elapsed >= burstTimes[b]) {
          burstsLaunched[b] = true;
          explodeBurst(burstCenters[b].x, burstCenters[b].y);
        }
      }

      const allBurstsDone = burstsLaunched.every(Boolean);
      if (allBurstsDone && particles.length === 0) {
        ctx!.clearRect(0, 0, w, h);
        window.removeEventListener('resize', handleResize);
        return;
      }

      animId = requestAnimationFrame(loop);
      ctx!.globalCompositeOperation = 'destination-out';
      ctx!.fillStyle = 'rgba(0,0,0,0.1)';
      ctx!.fillRect(0, 0, w, h);
      ctx!.globalCompositeOperation = 'lighter';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.vx *= 0.985;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx!.fillStyle = p.color;
          ctx!.globalAlpha = p.alpha;
          ctx!.fill();
          ctx!.globalAlpha = 1;
        }
      }

    }

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    />
  );
}

export default function ThankYouPage() {
  const router = useRouter();
  const { order, clearOrder } = useOrder();

  useEffect(() => {
    if (!order.location || !order.bundle) {
      router.push('/');
    }
  }, [order, router]);

  const handleStartOver = () => {
    clearOrder();
    router.push('/');
  };

  if (!order.location || !order.bundle) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 lg:p-8" data-testid="thank-you-page">
      <Fireworks />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="heading-thank-you">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Your new virtual office is being set up. You'll receive a confirmation email shortly.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6" data-testid="order-confirmation">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-[#36bff9]" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{order.location.name}</p>
                <p className="text-sm text-gray-600">{order.location.address}</p>
                <p className="text-sm text-gray-600">{order.location.addressLine2}</p>
                <p className="text-sm text-gray-600">{order.location.city}, {order.location.stateCode} {order.location.zipCode}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Package className="h-5 w-5 text-[#36bff9]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.bundle.name} {order.bundle.tier !== 'The Essentials' ? order.bundle.tier : ''}
                    </p>
                    <p className="text-sm text-gray-600">Monthly subscription</p>
                  </div>
                  <p className="font-semibold text-gray-900">${order.bundle.price}/mo</p>
                </div>
              </div>
            </div>

            {order.phoneNumber && (
              <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-[#36bff9]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{order.phoneNumber.number}</p>
                  <p className="text-sm text-gray-600">Your new business phone number</p>
                </div>
              </div>
            )}

            {(order.addons.length > 0 || order.extensionCount > 0) && (
              <div className="pt-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Add-ons included:</p>
                <div className="flex flex-wrap gap-2">
                  {order.addons.map((addon) => (
                    <span
                      key={addon.id}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700"
                    >
                      {addon.name}
                    </span>
                  ))}
                  {order.extensionCount > 0 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
                      Additional Extensions ({order.extensionCount})
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6" data-testid="onboarding-info">
          <h3 className="font-semibold text-gray-900 mb-2">What Happens Next?</h3>
          <p className="text-gray-600">
            Our team will reach out within 24 hours to help you get started with your new virtual office. A confirmation email with your order details has been sent to <strong>{order.userInfo.email}</strong>.
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleStartOver}
            className="bg-[#36bff9] hover:bg-[#2aa8e0] text-white px-8"
            data-testid="button-start-over"
          >
            Sign Up Another Location
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
