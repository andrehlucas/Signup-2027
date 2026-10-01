import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { Badge } from "@workspace/opus-vo-design-system/components/ui/badge";
import { Button } from "@workspace/opus-vo-design-system/components/ui/button";
import { FunnelChrome } from "./_shared/FunnelChrome";
import { availableLocations } from "./_shared/locations";

const states = [...new Set(availableLocations.map((location) => location.state))].sort();

export default function Location() {
  const [selectedState, setSelectedState] = useState(states[0] ?? "");
  const [selectedLocationId, setSelectedLocationId] = useState(availableLocations[0]?.id ?? "");
  const [submitted, setSubmitted] = useState(false);
  const locationsInState = useMemo(
    () => availableLocations.filter((location) => location.state === selectedState),
    [selectedState],
  );
  const locationCount = locationsInState.length;

  const changeState = (state: string) => {
    setSelectedState(state);
    setSelectedLocationId(availableLocations.find((location) => location.state === state)?.id ?? "");
    setSubmitted(false);
  };

  return (
    <FunnelChrome current={2}>
      <main className="opus-main">
        <div className="opus-kicker">Step 02 / Location</div>
        <h1 className="opus-title">Put your business on the map.</h1>
        <p className="opus-subtitle">
          Choose a business address. Every location is a real, staffed office with mail receipt and
          forwarding available.
        </p>
        <div className="opus-panel" style={{ marginTop: 28 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "end", maxWidth: 460 }}>
            <label style={{ flex: 1 }}>
              <span className="opus-label">State</span>
              <select
                className="opus-input"
                value={selectedState}
                onChange={(event) => changeState(event.target.value)}
              >
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </label>
            <div style={{ paddingBottom: 14, fontSize: 13 }}>
              <MapPin
                size={15}
                className="text-brand-600"
                aria-hidden="true"
                style={{ display: "inline", verticalAlign: "middle" }}
              />{" "}
              {locationCount} {locationCount === 1 ? "location" : "locations"}
            </div>
          </div>
          <div className="opus-location-list" role="radiogroup" aria-label="Available office locations">
            {locationsInState.map((location) => (
              <label
                className={`opus-location ${selectedLocationId === location.id ? "selected" : ""}`}
                key={location.id}
              >
                <img src={location.imageUrl} alt={`${location.name} office interior`} />
                <div>
                  <h3>
                    {location.name.replace(" - ", " — ")}{" "}
                    {location.isPremium && (
                      <Badge color="brand" size="sm" variant="pill">Premium</Badge>
                    )}
                  </h3>
                  <p>{location.address}, {location.addressLine2}</p>
                  <p>{location.city}, {location.stateCode} {location.zipCode}</p>
                </div>
                <input
                  className="opus-location-radio"
                  type="radio"
                  name="office-location"
                  value={location.id}
                  aria-label={`Select ${location.name}`}
                  checked={selectedLocationId === location.id}
                  onChange={() => setSelectedLocationId(location.id)}
                />
              </label>
            ))}
          </div>
          <div className="opus-actions" style={{ justifyContent: "flex-end" }}>
            <Button
              type="button"
              hierarchy="primary"
              size="md"
              className="min-w-40"
              disabled={!selectedLocationId || submitted}
              onClick={() => setSubmitted(true)}
            >
              Complete signup
            </Button>
          </div>
          {submitted && (
            <p className="opus-secure" role="status">
              Signup complete. No payment was collected.
            </p>
          )}
        </div>
      </main>
    </FunnelChrome>
  );
}