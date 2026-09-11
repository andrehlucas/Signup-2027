import React, { useState } from "react";
import { Check, ExternalLink } from "lucide-react";
import { Badge } from "@workspace/opus-vo-design-system/components/ui/badge";
import { Button } from "@workspace/opus-vo-design-system/components/ui/button";
import { FunnelChrome } from "./_shared/FunnelChrome";

export default function Confirmation() {
  const [open, setOpen] = useState(false);
  return <FunnelChrome current={4}><main className="opus-main"><div className="opus-confirm">
    <Badge color="success" variant="pill" size="md" leadingIcon={<Check size={14}/>}>Order confirmed · OP-240184</Badge>
    <h1 className="opus-title">Your professional address is reserved.</h1>
    <p className="opus-subtitle">Thank you, Alex. We’ve emailed your receipt and setup link to alex@morganstudio.co.</p>
    <div className="opus-rule"/><h2 className="opus-serif" style={{fontSize:22}}>One important step before we can receive mail</h2>
    <p className="opus-subtitle" style={{fontSize:14}}>USPS Form 1583 authorizes OPUS to accept mail on your behalf. It takes about three minutes and keeps your service compliant.</p>
    <div className="opus-next"><div className="opus-next-num">01</div><div><h3>Confirm your identity and business details</h3><p>Have a government-issued photo ID ready.</p></div></div>
    <div className="opus-next"><div className="opus-next-num">02</div><div><h3>Complete USPS Form 1583</h3><p>Upload two accepted documents and sign electronically.</p></div></div>
    <Button type="button" hierarchy="primary" size="lg" className="mt-6" trailingIcon={<ExternalLink size={15}/>} onClick={()=>setOpen(true)}>Start USPS Form 1583 setup</Button>
    {open&&<p className="opus-secure text-brand-600">Setup link opened in your secure customer portal.</p>}
    <p className="opus-muted" style={{fontSize:12,marginTop:22}}>Your address: 848 Brickell Avenue, PH5, Miami, FL 33131</p>
  </div></main></FunnelChrome>;
}