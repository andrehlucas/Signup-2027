import React from "react";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@workspace/opus-vo-design-system/components/ui/button";

export const steps = ["Your Info", "Pick Your Location"];

export function FunnelChrome({ current, children }: { current: number; children: React.ReactNode }) {
  return (
    <div className="opus-shell">
      <header className="opus-top">
        <div className="opus-frame">
          <img className="opus-logo" src="/__mockup/images/opus-vo-main-logo.svg" alt="OPUS Virtual Offices" />
          <div className="opus-trust"><ShieldCheck size={15} aria-hidden="true" /> Secure setup <b>·</b> No payment required</div>
        </div>
      </header>
      <div className="opus-frame">
        <nav className="opus-progress" aria-label="Purchase progress">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className={`opus-step ${index + 1 === current ? "active" : index + 1 < current ? "done" : ""}`}>
                <span className="opus-num">{index + 1 < current ? "✓" : index + 1}</span><span>{step}</span>
              </div>
              {index < steps.length - 1 && <div className="opus-connector" />}
            </React.Fragment>
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}

export function FooterActions({ back = "Back", next = "Continue", onBack, onNext }: {
  back?: string; next?: string; onBack?: () => void; onNext?: () => void;
}) {
  return <div className="opus-actions">
    <Button type="button" hierarchy="secondary" size="md" className="min-w-24" leadingIcon={<ArrowLeft size={16} />} onClick={onBack}>{back}</Button>
    <Button type="button" hierarchy="primary" size="md" className="min-w-32" trailingIcon={<ArrowRight size={16} />} onClick={onNext}>{next}</Button>
  </div>;
}

export function Field({ label, id, type = "text", placeholder, value, onChange }: {
  label: string; id: string; type?: string; placeholder?: string; value?: string; onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return <label><span className="opus-label">{label}</span><input id={id} className="opus-input" type={type} placeholder={placeholder} value={value} onChange={onChange} /></label>;
}