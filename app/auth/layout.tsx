'use client';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full relative overflow-hidden" data-testid="auth-layout">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
      <div
        className="absolute right-0 bottom-0 w-[70%] h-[70%] opacity-[0.07]"
        style={{
          backgroundImage: 'url(/opus-logo-icon.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right bottom',
          backgroundSize: 'contain',
        }}
      />
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <img src="/opus-logo-icon.svg" alt="Opus Virtual Offices" className="h-16 w-auto" data-testid="auth-logo" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
