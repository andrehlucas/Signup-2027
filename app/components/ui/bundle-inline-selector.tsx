"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Bundle, featureIndividualPrices, ESSENTIALS_PLAN } from "@/app/add-location/types";
import { bundleThemes } from "@/app/add-location/bundle-theme";

const CARD_HEIGHT = 304;

const comparisonFeatures: { key: keyof Bundle["features"]; label: string }[] = [
  { key: "businessAddress", label: "Prestigious Business Address" },
  { key: "liveCallAnswering", label: "Professional Live Call Answering" },
  { key: "callLog", label: "Call Log" },
  { key: "tollFreeNumber", label: "Toll-Free Number" },
  { key: "calloutFeature", label: "Callout Feature" },
  { key: "supervisedCallTransfer", label: "Supervised Call Transfer" },
  { key: "messageTaking", label: "Message Taking" },
  { key: "appointmentMaking", label: "Appointment Making (20/mo)" },
];

function getUpgradeFeatures(bundle: Bundle, essentialsBundle: Bundle) {
  return comparisonFeatures.filter(
    ({ key }) => bundle.features[key] && !essentialsBundle.features[key]
  );
}

function calculateSavings(bundle: Bundle): number {
  let alaCarteTotal = ESSENTIALS_PLAN.price;
  for (const [key, included] of Object.entries(bundle.features)) {
    if (included && featureIndividualPrices[key as keyof Bundle["features"]] > 0) {
      alaCarteTotal += featureIndividualPrices[key as keyof Bundle["features"]];
    }
  }
  return alaCarteTotal - bundle.price;
}

interface BundleInlineSelectorProps {
  bundles: Bundle[];
  selectedBundleId?: string;
  onSelect: (bundle: Bundle) => void;
  essentialsBundle: Bundle;
  className?: string;
  comparisonOpen?: boolean;
  comparisonControl?: ReactNode;
  comparisonId?: string;
}

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

export function BundleInlineSelector({
  bundles,
  selectedBundleId,
  onSelect,
  essentialsBundle,
  className,
  comparisonOpen = true,
  comparisonControl,
  comparisonId,
}: BundleInlineSelectorProps) {
  const getInitialIndex = useCallback(() => {
    if (!selectedBundleId) return 0;
    const idx = bundles.findIndex((b) => b.id === selectedBundleId);
    return idx >= 0 ? idx : 0;
  }, [bundles, selectedBundleId]);

  const [activeIndex, setActiveIndex] = useState(getInitialIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(400);
  const count = bundles.length;

  useEffect(() => {
    setActiveIndex(getInitialIndex());
  }, [selectedBundleId, getInitialIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    setContainerWidth(el.offsetWidth);
    return () => observer.disconnect();
  }, []);

  if (count === 0) return null;

  const currentIndex = wrap(0, count, activeIndex);
  const activeBundle = bundles[currentIndex];
  const activeTheme = bundleThemes[activeBundle.id] || bundleThemes.plus;
  const accentColor = activeTheme.accent;
  const savings = calculateSavings(activeBundle);

  const cardPadding = 8;
  const centerCardWidth = containerWidth * 0.8;

  const goTo = (newIndex: number) => {
    setActiveIndex(newIndex);
  };

  const handlePrev = () => goTo(activeIndex - 1);
  const handleNext = () => goTo(activeIndex + 1);

  const swipeConfidenceThreshold = 3000;
  const swipePower = (offset: number, velocity: number) =>
    Math.abs(offset) * velocity;

  const onDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo
  ) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) handleNext();
    else if (swipe > swipeConfidenceThreshold) handlePrev();
  };

  const prevLeft = -(centerCardWidth * 0.6);
  const centerLeft = cardPadding;
  const nextLeft = cardPadding + centerCardWidth + cardPadding;

  return (
    <div
      className={cn("w-full", className)}
      data-testid="bundle-inline-selector"
    >
      {/* Mobile slider - hidden on md+ */}
      <div
        ref={containerRef}
        className="relative py-4 overflow-hidden md:hidden"
      >
        <motion.div
          className="relative w-full cursor-grab active:cursor-grabbing"
          style={{ height: CARD_HEIGHT }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={onDragEnd}
        >
          {[-1, 0, 1].map((offset) => {
            const absIndex = activeIndex + offset;
            const index = wrap(0, count, absIndex);
            const bundle = bundles[index];
            const isCenter = offset === 0;
            const isPrev = offset === -1;
            const isSelected = selectedBundleId === bundle.id;
            const theme = bundleThemes[bundle.id] || bundleThemes.plus;
            const upgradeFeatures = getUpgradeFeatures(bundle, essentialsBundle);

            let left = centerLeft;
            let cardOpacity = 1;
            let cardScale = 1;
            if (isPrev) {
              left = prevLeft;
              cardOpacity = 0.15;
              cardScale = 0.92;
            } else if (!isCenter) {
              left = nextLeft;
              cardOpacity = 0.45;
              cardScale = 0.97;
            }

            return (
              <motion.div
                key={`${bundle.id}-${absIndex}`}
                className={cn(
                  "absolute top-0 rounded-xl overflow-hidden border transition-colors",
                  isCenter ? "z-20" : "z-10 pointer-events-none",
                  isSelected && isCenter
                    ? "ring-2 ring-gray-900/10"
                    : ""
                )}
                style={{
                  width: centerCardWidth,
                  height: CARD_HEIGHT,
                  background: theme.surface,
                  borderColor: isSelected && isCenter ? theme.accent : theme.border,
                }}
                initial={false}
                animate={{
                  left,
                  scale: cardScale,
                  opacity: cardOpacity,
                }}
                transition={{ type: "tween", ease: [0.25, 0.1, 0.25, 1], duration: 0.4 }}
                onClick={() => {
                  if (offset !== 0) goTo(activeIndex + offset);
                }}
                data-testid={`inline-bundle-card-${bundle.id}`}
              >
                <div className="px-5 pt-5 pb-4 flex flex-col justify-between h-full">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-baseline justify-between">
                      <span
                        className="text-lg font-bold tracking-tight"
                        style={{ fontFamily: "'Inter', sans-serif", color: theme.accent }}
                        data-testid={`inline-badge-${bundle.id}`}
                      >
                        {bundle.tier}
                      </span>
                      <span className="text-lg font-bold" style={{ color: theme.accent }} data-testid={`inline-price-${bundle.id}`}>
                        ${bundle.price}<span className="text-xs font-normal">/mo</span>
                      </span>
                    </div>

                    <div className="space-y-1" data-testid={`inline-description-${bundle.id}`}>
                      <p className="text-xs font-semibold" style={{ color: theme.accent }}>
                        Essentials included, plus:
                      </p>
                      <ul className="space-y-0.5">
                        {upgradeFeatures.map((feature) => (
                          <li key={feature.key} className="flex items-start gap-1.5 text-xs leading-4 text-gray-800">
                            <Check className="mt-0.5 h-3 w-3 shrink-0" style={{ color: theme.accent }} aria-hidden="true" />
                            <span>{feature.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {(() => {
                      const cardSavings = calculateSavings(bundle);
                      return cardSavings > 0 ? (
                        <span
                          className="inline-flex self-start items-center text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: theme.surface,
                            color: theme.accent,
                            border: `1px solid ${theme.border}`,
                          }}
                          data-testid={`inline-savings-badge-${bundle.id}`}
                        >
                          Save ${cardSavings}/mo
                        </span>
                      ) : null;
                    })()}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCenter) onSelect(bundle);
                    }}
                    className={cn(
                      "w-full py-2.5 rounded-md text-sm font-semibold transition-colors",
                      isSelected && isCenter
                        ? "bg-[#344054] text-white hover:bg-[#263241]"
                        : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                    )}
                    tabIndex={isCenter ? 0 : -1}
                    data-testid={`inline-select-bundle-${bundle.id}`}
                  >
                    {isSelected && isCenter ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="h-4 w-4" />
                        Selected
                      </span>
                    ) : (
                      `Select ${bundle.tier} Bundle`
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          aria-label="Next bundle"
          data-testid="inline-bundle-next"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Desktop grid - hidden on mobile, shown on md+ */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
        {bundles.map((bundle) => {
          const isSelected = selectedBundleId === bundle.id;
          const theme = bundleThemes[bundle.id] || bundleThemes.plus;
          const upgradeFeatures = getUpgradeFeatures(bundle, essentialsBundle);
          const bundleSavings = calculateSavings(bundle);

          return (
            <div
              key={bundle.id}
              className={cn(
                "rounded-xl overflow-hidden border transition-colors",
                isSelected ? "ring-2 ring-gray-900/10" : "hover:brightness-[0.99]"
              )}
              style={{
                background: theme.surface,
                borderColor: isSelected ? theme.accent : theme.border,
                minHeight: CARD_HEIGHT,
              }}
              data-testid={`inline-bundle-card-${bundle.id}`}
            >
              <div className="p-5 flex flex-col justify-between h-full">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xl font-bold tracking-tight"
                      style={{ fontFamily: "'Inter', sans-serif", color: theme.accent }}
                      data-testid={`inline-badge-${bundle.id}`}
                    >
                      {bundle.tier}
                    </span>
                    <span className="text-lg font-bold" style={{ color: theme.accent }} data-testid={`inline-price-${bundle.id}`}>
                      ${bundle.price}<span className="text-xs font-normal">/mo</span>
                    </span>
                  </div>

                  <div className="space-y-1.5" data-testid={`inline-description-${bundle.id}`}>
                    <p className="text-xs font-semibold" style={{ color: theme.accent }}>
                      Essentials included, plus:
                    </p>
                    <ul className="space-y-1">
                      {upgradeFeatures.map((feature) => (
                        <li key={feature.key} className="flex items-start gap-2 text-xs leading-4 text-gray-800">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: theme.accent }} aria-hidden="true" />
                          <span>{feature.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {bundleSavings > 0 && (
                    <span
                      className="text-xs font-semibold rounded-full px-2.5 py-0.5 self-start"
                      style={{
                       color: theme.accent,
                       backgroundColor: theme.surface,
                       border: `1px solid ${theme.border}`,
                      }}
                    >
                      Save ${bundleSavings}/mo
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onSelect(bundle)}
                  className={cn(
                    "w-full py-2.5 rounded-md text-sm font-semibold transition-colors mt-3",
                    isSelected
                      ? "bg-[#344054] text-white hover:bg-[#263241]"
                      : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                  )}
                  data-testid={`inline-select-bundle-${bundle.id}`}
                >
                  {isSelected ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="h-4 w-4" />
                      Selected
                    </span>
                  ) : (
                    `Select ${bundle.tier} Bundle`
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {comparisonControl}
      <div id={comparisonId} hidden={!comparisonOpen}>
      <div className="mt-4" data-testid="essentials-baseline-option">
        <div
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
          data-testid="essentials-baseline-header"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-xs font-medium text-gray-500">Baseline plan</span>
            <h3 className="text-sm font-semibold text-gray-900">{essentialsBundle.tier}</h3>
            <span className="text-sm text-gray-600">{essentialsBundle.name}</span>
            <span className="ml-auto flex items-baseline gap-1 text-gray-900">
              <span className="text-lg font-bold">${essentialsBundle.price}</span>
              <span className="text-xs text-gray-600">/mo</span>
            </span>
          </div>
        </div>
      </div>

      {/* Mobile comparison table */}
      <div className="mt-2 px-2 md:hidden" data-testid="inline-comparison-table">
        <div className="flex items-center gap-2 mb-3" data-testid="comparison-header">
        <span className="flex-1 min-w-0 text-xs font-medium text-gray-900" data-testid="text-what-you-get">Included features</span>
          <div className="flex items-center flex-shrink-0" style={{ width: "140px" }}>
            <span
              className="text-center text-xs font-medium text-gray-600"
              style={{ width: "70px" }}
              aria-label="Essentials baseline plan"
              data-testid="text-essentials-col"
            >
              Essentials
            </span>
            <div className="relative overflow-hidden" style={{ width: "70px", height: "16px" }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeBundle.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center rounded-sm text-xs font-bold"
                  style={{ color: accentColor, backgroundColor: activeTheme.surface }}
                  data-testid={`text-bundle-col-${activeBundle.id}`}
                >
                  {activeBundle.tier}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="space-y-0">
          {comparisonFeatures.map((feature, idx) => {
            const essentialsHas = essentialsBundle.features[feature.key];
            const activeBundleHas = activeBundle.features[feature.key];

            return (
              <div
                key={feature.key}
                className={cn(
                  "flex items-center gap-2 py-2",
                  idx < comparisonFeatures.length - 1 ? "border-b border-gray-100" : ""
                )}
                data-testid={`comparison-row-${feature.key}`}
              >
                <span className="flex-1 min-w-0 text-xs text-gray-700" data-testid={`comparison-label-${feature.key}`}>{feature.label}</span>
                <div className="flex items-center flex-shrink-0" style={{ width: "140px" }}>
                  <div className="flex justify-center" style={{ width: "70px" }} data-testid={`comparison-essentials-${feature.key}`}>
                    {essentialsHas ? (
                      <Check className="h-3.5 w-3.5 text-gray-400" />
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </div>
                  <div className="relative overflow-hidden" style={{ width: "70px", height: "16px" }} data-testid={`comparison-bundle-${feature.key}`}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${activeBundle.id}-${feature.key}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        {activeBundleHas ? (
                          <Check className="h-3.5 w-3.5" style={{ color: accentColor }} />
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {savings > 0 && (
          <div className="border-t border-gray-200 mt-1 pt-3 pb-1">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeBundle.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="text-center text-sm font-semibold"
                style={{ color: accentColor }}
                data-testid={`savings-line-${activeBundle.id}`}
              >
                You save ${savings}/mo with {activeBundle.tier}
              </motion.p>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Desktop comparison table - all bundles shown as columns */}
      <div className="hidden md:block mt-4 px-2" data-testid="inline-comparison-table-desktop">
        <div className="flex items-center gap-2 mb-3" data-testid="comparison-header-desktop">
        <span className="flex-1 min-w-0 text-xs font-medium text-gray-900">Included features</span>
          <div className="flex items-center flex-shrink-0" style={{ width: `${(bundles.length + 1) * 80}px` }}>
            <span
              className="text-center text-xs font-medium text-gray-600"
              style={{ width: "80px" }}
              aria-label="Essentials baseline plan"
            >
              Essentials
            </span>
            {bundles.map((bundle) => (
              <span
                key={bundle.id}
                className="text-center text-xs font-bold"
                  aria-label={`${bundle.tier} upgrade plan`}
                style={{
                  width: "80px",
                  color: (bundleThemes[bundle.id] || bundleThemes.plus).accent,
                }}
              >
                {bundle.tier}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-0">
          {comparisonFeatures.map((feature, idx) => {
            const essentialsHas = essentialsBundle.features[feature.key];

            return (
              <div
                key={feature.key}
                className={cn(
                  "flex items-center gap-2 py-2",
                  idx < comparisonFeatures.length - 1 ? "border-b border-gray-100" : ""
                )}
                data-testid={`comparison-row-desktop-${feature.key}`}
              >
                <span className="flex-1 min-w-0 text-xs text-gray-700">{feature.label}</span>
                <div className="flex items-center flex-shrink-0" style={{ width: `${(bundles.length + 1) * 80}px` }}>
                  <div className="flex justify-center" style={{ width: "80px" }}>
                    {essentialsHas ? (
                      <Check className="h-3.5 w-3.5 text-gray-400" />
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </div>
                  {bundles.map((bundle) => {
                    const bundleHas = bundle.features[feature.key];
                    return (
                      <div key={bundle.id} className="flex justify-center" style={{ width: "80px" }}>
                        {bundleHas ? (
                          <Check
                            className="h-3.5 w-3.5"
                            style={{ color: (bundleThemes[bundle.id] || bundleThemes.plus).accent }}
                          />
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}
