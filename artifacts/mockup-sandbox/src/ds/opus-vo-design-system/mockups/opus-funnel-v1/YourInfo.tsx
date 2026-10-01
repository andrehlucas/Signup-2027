import React, { useState } from "react";
import { FunnelChrome, Field, FooterActions } from "./_shared/FunnelChrome";

export default function YourInfo() {
  const [ok, setOk] = useState(false);
  const [continued, setContinued] = useState(false);
  const [form, setForm] = useState({
    first: "Alex",
    last: "Morgan",
    email: "alex@morganstudio.co",
    phone: "(305) 555-0184",
    company: "Morgan Studio",
  });
  const set = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: event.target.value });

  return (
    <FunnelChrome current={1}>
      <main className="opus-main">
        <div className="opus-grid">
          <section>
            <div className="opus-kicker">Step 01 / Contact details</div>
            <h1 className="opus-title">Let’s get your office set up.</h1>
            <p className="opus-subtitle">
              Share your contact details so we can set up your OPUS account.
            </p>
            <div className="opus-panel" style={{ marginTop: 28 }}>
              <div className="opus-fields">
                <Field label="First name" id="first" value={form.first} onChange={set("first")} />
                <Field label="Last name" id="last" value={form.last} onChange={set("last")} />
                <div className="opus-span">
                  <Field label="Business email" id="email" type="email" value={form.email} onChange={set("email")} />
                </div>
                <Field label="Mobile phone" id="phone" value={form.phone} onChange={set("phone")} />
                <Field label="Company name" id="company" value={form.company} onChange={set("company")} />
              </div>
              <div style={{ marginTop: 23 }}>
                <label className="opus-check">
                  <input type="checkbox" checked={ok} onChange={(event) => setOk(event.target.checked)} />
                  <span>
                    I agree to the <span className="opus-link">Terms of Use</span> and understand that a
                    government-issued ID will be required for USPS Form 1583.
                  </span>
                </label>
              </div>
              <FooterActions next="Continue" onNext={() => setContinued(true)} />
              {continued && (
                <p className="opus-secure" role="status">
                  Your contact details are ready. Next, pick your location.
                </p>
              )}
            </div>
          </section>
          <aside className="opus-side">
            <h3>A credible address, without the lease.</h3>
            <p>
              OPUS gives you a real street address, mail handling, and a professional presence in
              the markets that matter to your business.
            </p>
            <p>Most customers complete setup in about five minutes.</p>
          </aside>
        </div>
      </main>
    </FunnelChrome>
  );
}