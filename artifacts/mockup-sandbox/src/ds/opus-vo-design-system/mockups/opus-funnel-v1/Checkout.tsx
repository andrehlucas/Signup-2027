import React, { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@workspace/opus-vo-design-system/components/ui/button";
import { FunnelChrome, Field, FooterActions } from "./_shared/FunnelChrome";

export default function Checkout() {
  const [term, setTerm] = useState("monthly");
  const [agree, setAgree] = useState(false);
  const [paid, setPaid] = useState(false);
  return <FunnelChrome current={4}><main className="opus-main"><div className="opus-grid"><section>
    <div className="opus-kicker">Step 04 / Checkout</div><h1 className="opus-title">Review, then make it official.</h1>
    <p className="opus-subtitle">Your secure checkout is the last step. You won’t be charged until you select Place order.</p>
    <div className="opus-panel" style={{marginTop:28}}>
      <h2 style={{fontSize:17,margin:"0 0 17px"}}>Billing term</h2>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{["monthly","3 months","6 months","12 months"].map(x =>
        <Button type="button" size="sm" hierarchy={term===x?"primary":"secondary"} onClick={()=>setTerm(x)} key={x}>{x}</Button>)}</div>
      <div style={{height:1,background:"var(--color-gray-200)",margin:"27px 0"}}/>
      <h2 style={{fontSize:17,margin:"0 0 17px"}}>Payment details</h2>
      <div className="opus-fields"><div className="opus-span"><Field label="Cardholder name" id="cardname" placeholder="Alex Morgan"/></div><div className="opus-span"><Field label="Card number" id="card" placeholder="1234  5678  9012  3456"/></div><Field label="Expiration" id="expiry" placeholder="MM / YY"/><Field label="Security code" id="cvv" placeholder="CVV"/></div>
      <div className="opus-secure"><Lock size={14} className="text-brand-600" aria-hidden="true"/> 256-bit encrypted payment processing</div>
      <div style={{marginTop:24}}><label className="opus-check"><input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)}/><span>I agree to the OPUS <span className="opus-link">Service Agreement</span>, including address use and USPS Form 1583 requirements.</span></label></div>
      <FooterActions next={paid?"Order placed":"Place order"} onNext={()=>agree&&setPaid(true)} onBack={()=>{}}/>
    </div>
  </section><aside className="opus-panel" style={{height:"max-content"}}><h2 style={{fontSize:17,margin:"0 0 20px"}}>Your order</h2>
    <div className="opus-review-row"><strong>Miami — Brickell Avenue</strong><span>Business address<br/>848 Brickell Avenue</span></div><div className="opus-review-row"><strong>The Essentials</strong><span>$99.00 / month</span></div><div className="opus-review-row"><strong>Business phone</strong><span>Included</span></div>
    <div className="opus-summary"><div className="opus-summary-row"><span>Due today</span><b>$99.00</b></div><div className="opus-summary-row"><span>Recurring</span><b>$99.00 / mo</b></div><div className="opus-summary-total"><span>Total today</span><strong style={{float:"right"}}>$99.00</strong></div></div>
  </aside></div></main></FunnelChrome>;
}