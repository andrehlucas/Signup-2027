export function SplitPanel() {
  return (
    <div className="min-h-screen font-sans" style={{ fontFamily: 'Inter, system-ui, sans-serif', position: 'relative' }}>
      {/* Two-tone background: solid blue-gray top half, white bottom */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '42%', background: '#eef3f9' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '58%', background: '#f9fafb' }} />
      </div>

      {/* Header */}
      <header style={{ position: 'relative', zIndex: 1, background: 'white', borderBottom: '1px solid #e8edf3', padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div className="max-w-4xl mx-auto flex justify-center">
          <div className="flex items-center gap-2">
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0086C9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: 14 }}>O</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, color: '#0086C9', letterSpacing: '-0.5px' }}>opus</span>
          </div>
        </div>
      </header>

      {/* Page */}
      <div className="px-4 py-10" style={{ minHeight: 'calc(100vh - 81px)', position: 'relative', zIndex: 1 }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#0f2044', lineHeight: 1.25 }}>
              You're Only 4 Steps Away From<br />
              <span style={{ color: '#0086C9' }}>Securing Your Virtual Office</span>
            </h1>
          </div>
          <ProgressBar current={1} />
          <FormCard />
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ current }: { current: number }) {
  const steps = ['Your Info', 'Pick Location', 'Customize', 'Checkout'];
  return (
    <div className="max-w-lg mx-auto mb-10">
      <div className="flex items-center">
        {steps.map((name, i) => (
          <div key={name} className="flex items-center" style={{ flex: i < steps.length - 1 ? 1 : 'unset' }}>
            <div className="flex items-center gap-2">
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: i + 1 === current ? '#0086C9' : i + 1 < current ? '#0086C9' : 'white',
                border: i + 1 >= current ? '2px solid ' + (i + 1 === current ? '#0086C9' : '#d1d5db') : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: i + 1 === current ? '0 0 0 4px rgba(0,134,201,0.15)' : 'none',
                flexShrink: 0,
              }}>
                <span style={{ color: i + 1 <= current ? 'white' : '#9ca3af', fontSize: 13, fontWeight: 700 }}>{i + 1}</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: i + 1 === current ? 700 : 500, color: i + 1 === current ? '#0086C9' : i + 1 < current ? '#374151' : '#9ca3af', whiteSpace: 'nowrap' }} className="hidden sm:block">{name}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i + 1 < current ? '#0086C9' : '#e5e7eb', margin: '0 10px', borderRadius: 2 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FormCard() {
  return (
    <div className="max-w-lg mx-auto">
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 8px 40px rgba(0,86,140,0.10)', border: '1px solid #e8edf3', padding: '32px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <input placeholder="First Name" style={fieldStyle} />
          <input placeholder="Last Name" style={fieldStyle} />
        </div>
        <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{ padding: '0 12px', background: '#f8fafc', borderRight: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🇺🇸</span><span style={{ fontSize: 13, color: '#64748b' }}>+1</span>
          </div>
          <input placeholder="(555) 555 - 5555" style={{ ...fieldStyle, border: 'none', borderRadius: 0, flex: 1 }} />
        </div>
        <input placeholder="Email Address" style={{ ...fieldStyle, marginBottom: 12 }} />
        <input placeholder="Confirm Email Address" style={{ ...fieldStyle, marginBottom: 12 }} />
        <input placeholder="Company Name" style={{ ...fieldStyle, marginBottom: 12 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 16, height: 16, border: '1.5px solid #cbd5e1', borderRadius: 4 }} />
          <span style={{ fontSize: 13, color: '#64748b' }}>I agree to the <span style={{ color: '#0086C9' }}>Terms of Use</span></span>
        </div>
        <button style={{ width: '100%', height: 48, background: '#0086C9', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Continue →
        </button>
      </div>
      <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        🔒 Your information is encrypted and never shared.
      </div>
    </div>
  );
}

const fieldStyle: React.CSSProperties = {
  width: '100%', height: 44, padding: '0 12px',
  border: '1px solid #e2e8f0', borderRadius: 8,
  fontSize: 14, color: '#1e293b', outline: 'none',
  background: 'white', boxSizing: 'border-box',
};
