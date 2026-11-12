'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Divider } from '@astryxdesign/core/Divider';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { StackItem } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import { useOrder } from '../context';
import Image from 'next/image';

function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Decorative celebration: skip it entirely for people who reduce motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const ctx = context!;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#ff2d2d', '#ffdd00', '#00e676', '#2979ff', '#ff4081', '#36bff9', '#ff9100', '#d500f9', '#ffea00', '#00e5ff'];

    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
      size: number;
    }

    interface Shell {
      x: number;
      y: number;
      vx: number;
      vy: number;
      targetY: number;
      color: string;
      exploded: boolean;
    }

    const sparks: Spark[] = [];
    const shells: Shell[] = [];
    let cancelled = false;

    function launchShell() {
      const x = w * 0.15 + Math.random() * w * 0.7;
      const targetY = h * 0.08 + Math.random() * h * 0.35;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const vy = -(Math.sqrt(2 * 0.06 * (h - targetY)) + Math.random() * 2);
      shells.push({
        x,
        y: h + 10,
        vx: (Math.random() - 0.5) * 1.5,
        vy,
        targetY,
        color,
        exploded: false,
      });
    }

    function burst(x: number, y: number, color: string) {
      const numSparks = 80 + Math.floor(Math.random() * 50);
      for (let i = 0; i < numSparks; i++) {
        const angle = (Math.PI * 2 * i) / numSparks + (Math.random() - 0.5) * 0.3;
        const speed = 2 + Math.random() * 6;
        const life = 60 + Math.floor(Math.random() * 40);
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life,
          maxLife: life,
          color: Math.random() > 0.3 ? color : colors[Math.floor(Math.random() * colors.length)],
          size: 1.5 + Math.random() * 3,
        });
      }
    }

    const schedule = [
      { time: 1000, count: 3 },
      { time: 1400, count: 2 },
      { time: 2000, count: 3 },
      { time: 2600, count: 2 },
      { time: 3200, count: 4 },
    ];
    const launched = new Array(schedule.length).fill(false);
    const pageLoadTime = performance.now();
    let animId = 0;

    function tick() {
      if (cancelled) return;

      const now = performance.now();
      const elapsed = now - pageLoadTime;

      for (let s = 0; s < schedule.length; s++) {
        if (!launched[s] && elapsed >= schedule[s].time) {
          launched[s] = true;
          for (let i = 0; i < schedule[s].count; i++) {
            setTimeout(() => { if (!cancelled) launchShell(); }, i * 120);
          }
        }
      }

      ctx.clearRect(0, 0, w, h);

      for (let i = shells.length - 1; i >= 0; i--) {
        const s = shells[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.06;

        ctx.beginPath();
        ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;

        if (s.y <= s.targetY || s.vy >= 0) {
          burst(s.x, s.y, s.color);
          shells.splice(i, 1);
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.vy += 0.025;
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        if (p.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        const alpha = p.life / p.maxLife;
        const radius = p.size * (0.3 + 0.7 * alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      const allLaunched = launched.every(Boolean);
      if (allLaunched && shells.length === 0 && sparks.length === 0) {
        ctx.clearRect(0, 0, w, h);
        return;
      }

      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
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

  const steps = [
    { title: 'Confirmation', text: 'Confirm your address and business type.' },
    { title: 'Document Upload', text: 'Provide us with 2 required documents.*' },
    { title: 'Review and Sign', text: 'Review your details and sign.' },
  ];

  return (
    <VStack className="signup-shell px-4 py-8 lg:py-12" hAlign="center" data-testid="thank-you-page">
      <Fireworks />

      <VStack gap={10} width="100%" maxWidth={1152}>
        {/* Message first; the photo sits beside it on large screens, below on phones. */}
        <VStack gap={8} className="lg:flex-row lg:items-start lg:gap-12">
          <StackItem size="fill">
            <VStack gap={6}>
              <Heading level={1} data-testid="heading-thank-you">Congratulations on your new office!</Heading>

              <Text weight="semibold">
                You&apos;re Only a Few Steps Away From Setting Everything Up! Don&apos;t Worry, We&apos;ve Simplified The Process and Most Customers Complete All 3 Steps in Only a Few Minutes.
              </Text>

              <VStack as="ol" gap={4}>
                {steps.map(step => (
                  <HStack as="li" key={step.title} gap={3} vAlign="start">
                    <Icon icon={CheckCircle2} size="lg" className="shrink-0 text-[var(--color-text-success)]" />
                    <Text>
                      <Text weight="semibold">{step.title}:</Text> {step.text}
                    </Text>
                  </HStack>
                ))}
              </VStack>

              <VStack gap={4} hAlign="start">
                <Text weight="semibold">What are you waiting for? It&apos;s as easy as 1, 2, 3...</Text>
                <Button
                  type="button"
                  variant="primary"
                  label="Click Here To Begin The Process Now"
                  onClick={handleStartOver}
                  className="w-full sm:w-auto"
                  data-testid="button-begin-process"
                />
              </VStack>
            </VStack>
          </StackItem>

          <VStack className="shrink-0 lg:w-[25rem]">
            <Image
              src="/images/celebration.webp"
              alt="Team celebrating new office"
              width={400}
              height={500}
              className="h-auto w-full rounded-[var(--radius-container)] object-cover"
              data-testid="img-celebration"
            />
          </VStack>
        </VStack>

        <Card variant="muted" padding={6} className="sm:p-8" data-testid="fileforms-banner">
          <HStack gap={6} hAlign="between" vAlign="center" wrap="wrap">
            <VStack gap={1}>
              <Text size="2xl" weight="bold">Click here</Text>
              <Text size="lg" color="secondary">
                for the simplest way to<br />
                incorporate or form an LLC through our partner
              </Text>
            </VStack>
            {/* Partner wordmark, unchanged. */}
            <HStack gap={2} vAlign="center">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true" className="shrink-0">
                <rect width="36" height="36" rx="4" fill="#2D7D6F" />
                <path d="M8 10h6v2H8v-2zm0 4h10v2H8v-2zm0 4h8v2H8v-2zm0 4h12v2H8v-2zm14-10h6v12h-6V12z" fill="white" />
              </svg>
              <Text size="3xl" weight="bold" className="text-[#2D7D6F]">FileForms</Text>
            </HStack>
          </HStack>
        </Card>

        <VStack gap={4} data-testid="disclaimers">
          <Divider />
          <Text type="supporting" color="secondary">
            *Examples of acceptable documents include driver&apos;s license, passport, auto registration, or auto insurance policy (see a complete list of accepted documents as you complete the setup process).
          </Text>
          <Text type="supporting" color="secondary">
            **As part of our commitment to providing you with top-notch virtual office services, we are required to submit USPS Form 1583 to the post office. This form includes your home address, which is necessary for compliance with postal regulations. Please be assured that your privacy is of utmost importance to us. The information provided on USPS Form 1583 will be used solely by the post office for verification purposes and will not be shared with any other parties. Thank you for your understanding and cooperation.
          </Text>
        </VStack>
      </VStack>
    </VStack>
  );
}
