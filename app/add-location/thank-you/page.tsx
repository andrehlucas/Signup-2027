'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useOrder } from '../context';
import Image from 'next/image';

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
    const rockets: Rocket[] = [];
    const colors = ['#ff2d2d', '#ffdd00', '#00e676', '#2979ff', '#ff4081', '#36bff9', '#ff9100', '#d500f9', '#ffea00', '#00e5ff'];

    function createRocket() {
      const x = Math.random() * w * 0.8 + w * 0.1;
      rockets.push({
        x,
        y: h,
        vy: -(Math.random() * 6 + 10),
        targetY: Math.random() * h * 0.4 + h * 0.05,
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: [],
      });
    }

    function explode(x: number, y: number, color: string) {
      const count = 100 + Math.floor(Math.random() * 60);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 8 + 3;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: Math.random() > 0.25 ? color : colors[Math.floor(Math.random() * colors.length)],
          decay: Math.random() * 0.012 + 0.006,
          size: Math.random() * 4 + 1.5,
        });
      }
    }

    let animId: number;
    const startTime = Date.now();

    const burstTimes = [0, 1200, 2400];
    const burstRockets = 8;
    const burstsLaunched = [false, false, false];

    function launchBurst() {
      for (let i = 0; i < burstRockets; i++) {
        createRocket();
      }
    }

    function loop() {
      const elapsed = Date.now() - startTime;

      for (let b = 0; b < burstTimes.length; b++) {
        if (!burstsLaunched[b] && elapsed >= burstTimes[b]) {
          burstsLaunched[b] = true;
          launchBurst();
        }
      }

      const allBurstsDone = burstsLaunched.every(Boolean);
      if (allBurstsDone && rockets.length === 0 && particles.length === 0) {
        ctx!.clearRect(0, 0, w, h);
        window.removeEventListener('resize', handleResize);
        return;
      }

      animId = requestAnimationFrame(loop);
      ctx!.globalCompositeOperation = 'destination-out';
      ctx!.fillStyle = 'rgba(0,0,0,0.12)';
      ctx!.fillRect(0, 0, w, h);
      ctx!.globalCompositeOperation = 'lighter';

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y, alpha: 1 });
        r.y += r.vy;
        r.vy *= 0.97;

        for (let t = r.trail.length - 1; t >= 0; t--) {
          r.trail[t].alpha -= 0.04;
          if (r.trail[t].alpha <= 0) r.trail.splice(t, 1);
          else {
            ctx!.beginPath();
            ctx!.arc(r.trail[t].x, r.trail[t].y, 2, 0, Math.PI * 2);
            ctx!.fillStyle = `rgba(255,255,255,${r.trail[t].alpha})`;
            ctx!.fill();
          }
        }

        if (r.y <= r.targetY) {
          explode(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.vx *= 0.99;
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
    <div className="min-h-[calc(100vh-73px)] bg-white" data-testid="thank-you-page">
      <Fireworks />

      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12 mb-10">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight" data-testid="heading-thank-you">
              Congratulations on your new office!
            </h1>

            <p className="text-sm sm:text-base font-semibold text-gray-800 mb-6 leading-relaxed">
              You&apos;re Only a Few Steps Away From Setting Everything Up! Don&apos;t Worry, We&apos;ve Simplified The Process and Most Customers Complete All 3 Steps in Only a Few Minutes.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-800">
                  <strong>Confirmation:</strong> Confirm your address and business type.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-800">
                  <strong>Document Upload:</strong> Provide us with 2 required documents.*
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-800">
                  <strong>Review and Sign:</strong> Review your details and sign.
                </p>
              </div>
            </div>

            <p className="font-semibold text-gray-900 mb-4">
              What are you waiting for? It&apos;s as easy as 1, 2, 3...
            </p>

            <Button
              onClick={handleStartOver}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-base rounded-md"
              data-testid="button-begin-process"
            >
              Click Here To Begin The Process Now
            </Button>
          </div>

          <div className="mt-8 lg:mt-0 lg:w-[400px] flex-shrink-0">
            <div className="rounded-xl overflow-hidden">
              <Image
                src="/images/celebration.jpg"
                alt="Team celebrating new office"
                width={400}
                height={500}
                className="w-full h-auto object-cover rounded-xl"
                data-testid="img-celebration"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl p-6 sm:p-8 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6" data-testid="fileforms-banner">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Click here</p>
            <p className="text-lg sm:text-xl text-gray-700">
              for the simplest way to<br />
              incorporate or form an LLC through our partner
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="flex-shrink-0">
              <rect width="36" height="36" rx="4" fill="#2D7D6F" />
              <path d="M8 10h6v2H8v-2zm0 4h10v2H8v-2zm0 4h8v2H8v-2zm0 4h12v2H8v-2zm14-10h6v12h-6V12z" fill="white" />
            </svg>
            <span className="text-2xl sm:text-3xl font-bold text-[#2D7D6F]">FileForms</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 space-y-4 text-xs text-gray-500 leading-relaxed" data-testid="disclaimers">
          <p>
            *Examples of acceptable documents include driver&apos;s license, passport, auto registration, or auto insurance policy (see a complete list of accepted documents as you complete the setup process).
          </p>
          <p>
            **As part of our commitment to providing you with top-notch virtual office services, we are required to submit USPS Form 1583 to the post office. This form includes your home address, which is necessary for compliance with postal regulations. Please be assured that your privacy is of utmost importance to us. The information provided on USPS Form 1583 will be used solely by the post office for verification purposes and will not be shared with any other parties. Thank you for your understanding and cooperation.
          </p>
        </div>
      </div>
    </div>
  );
}
