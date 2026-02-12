"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Bundle, featureLabels } from "@/app/add-location/types";

const bundleBadges: Record<string, string> = {
  plus: "/images/plus-badge.svg",
  pro: "/images/pro-badge.svg",
  premium: "/images/premium-badge.svg",
};

const bundleBackgrounds: Record<string, string> = {
  plus: "/images/bg-bundle-01.webp",
  pro: "/images/bg-bundle-02.webp",
  premium: "/images/bg-bundle-03.webp",
};

const comparisonFeatures: { key: keyof Bundle["features"]; label: string }[] = [
  { key: "businessAddress", label: "Prestigious Business Address" },
  { key: "liveCallAnswering", label: "Professional Live Call Answering" },
  { key: "callTransferring", label: "Personalized Call Transferring" },
  { key: "businessPhoneFax", label: "Business Phone/Fax Number" },
  { key: "mailReceipt", label: "Professional Mail Receipt" },
  { key: "voicemailToEmail", label: "Voicemail/Fax Converted to Email" },
  { key: "callLog", label: "Call Log" },
  { key: "tollFreeNumber", label: "Toll-Free Number" },
  { key: "calloutFeature", label: "Callout Feature" },
  { key: "supervisedCallTransfer", label: "Supervised Call Transfer" },
  { key: "messageTaking", label: "Message Taking" },
];

interface BundleInlineSelectorProps {
  bundles: Bundle[];
  selectedBundleId?: string;
  onSelect: (bundle: Bundle) => void;
  essentialsBundle: Bundle;
  className?: string;
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

  const centerCardWidth = containerWidth * 0.8;
  const sideGap = (containerWidth - centerCardWidth) / 2;
  const sideCardOffset = centerCardWidth * 0.5 + sideGap * 0.5 + 4;

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

  const visibleIndices = [-1, 0, 1];

  const displayedFeatures = (bundle: Bundle) => {
    return Object.entries(bundle.features)
      .filter(([key, enabled]) => {
        if (!enabled) return false;
        const alwaysShow = ["businessAddress", "liveCallAnswering", "businessPhoneFax"];
        const bundleUpgrades = ["calloutFeature", "tollFreeNumber", "callLog", "supervisedCallTransfer", "messageTaking"];
        return alwaysShow.includes(key) || bundleUpgrades.includes(key);
      })
      .map(([key]) => key);
  };

  return (
    <div
      className={cn("w-full", className)}
      data-testid="bundle-inline-selector"
    >
      <div
        ref={containerRef}
        className="relative flex items-center justify-center py-4 overflow-hidden"
        style={{ minHeight: "320px" }}
      >
        <button
          onClick={handlePrev}
          className="absolute left-1 z-30 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
          aria-label="Previous bundle"
          data-testid="inline-bundle-prev"
        >
          <ChevronLeft className="h-4 w-4 text-gray-700" />
        </button>

        <motion.div
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ minHeight: "300px" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={onDragEnd}
        >
          {visibleIndices.map((offset) => {
            const absIndex = activeIndex + offset;
            const index = wrap(0, count, absIndex);
            const bundle = bundles[index];
            const isCenter = offset === 0;
            const isSelected = selectedBundleId === bundle.id;
            const badgeSrc = bundleBadges[bundle.id];
            const bgSrc = bundleBackgrounds[bundle.id];
            const features = displayedFeatures(bundle);

            return (
              <motion.div
                key={`${bundle.id}-${absIndex}`}
                className={cn(
                  "absolute rounded-2xl overflow-hidden border-2",
                  "bg-gradient-to-b from-[#0a1628] to-[#0f2240]",
                  isCenter ? "z-20 shadow-2xl" : "z-10 pointer-events-none",
                  isSelected && isCenter
                    ? "border-[#36bff9] ring-2 ring-[#36bff9]"
                    : "border-white/10"
                )}
                style={{
                  width: isCenter ? centerCardWidth : centerCardWidth * 0.85,
                }}
                initial={false}
                animate={{
                  x: offset === 0 ? 0 : offset * sideCardOffset,
                  scale: isCenter ? 1 : 0.88,
                  opacity: isCenter ? 1 : 0.4,
                  filter: isCenter ? "blur(0px)" : "blur(2px)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={() => {
                  if (offset !== 0) goTo(activeIndex + offset);
                }}
                data-testid={`inline-bundle-card-${bundle.id}`}
              >
                {bgSrc && (
                  <div
                    className="absolute inset-0 rounded-2xl bg-cover bg-center pointer-events-none"
                    style={{
                      backgroundImage: `url(${bgSrc})`,
                      mixBlendMode: "lighten",
                      opacity: 0.75,
                    }}
                  />
                )}

                <div className="relative p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {badgeSrc && (
                        <img
                          src={badgeSrc}
                          alt={bundle.tier}
                          className="h-5 w-auto object-contain"
                          data-testid={`inline-badge-${bundle.id}`}
                        />
                      )}
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#36bff9]">
                        {bundle.badge}
                      </span>
                    </div>
                    {isSelected && isCenter && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-300 bg-emerald-500/20 rounded-full px-2 py-0.5" data-testid={`status-selected-${bundle.id}`}>
                        <Check className="h-3 w-3" />
                        Active
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-0.5" data-testid={`text-tier-${bundle.id}`}>
                    {bundle.tier}
                  </h3>

                  <div className="mb-3">
                    <span className="text-2xl font-bold text-white" data-testid={`text-price-${bundle.id}`}>
                      ${bundle.price}
                    </span>
                    {bundle.originalPrice && (
                      <span className="text-sm text-white/40 line-through ml-2">
                        ${bundle.originalPrice}
                      </span>
                    )}
                    <span className="text-white/50 text-sm ml-1">/mo</span>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    {features.map((key) => (
                      <div key={key} className="flex items-center gap-2" data-testid={`text-feature-${bundle.id}-${key}`}>
                        <div className="w-4 h-4 rounded-full bg-[#36bff9]/20 flex items-center justify-center flex-shrink-0">
                          <Check className="h-2.5 w-2.5 text-[#36bff9]" />
                        </div>
                        <span className="text-white/80 text-xs leading-tight">
                          {featureLabels[key] || key}
                        </span>
                      </div>
                    ))}
                  </div>

                  {isCenter && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(bundle);
                      }}
                      className={cn(
                        "w-full py-2 rounded-lg text-sm font-semibold transition-all",
                        isSelected
                          ? "bg-[#36bff9] hover:bg-[#2aa8e0] text-white"
                          : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                      )}
                      data-testid={`inline-select-bundle-${bundle.id}`}
                    >
                      {isSelected ? (
                        <span className="flex items-center justify-center gap-2">
                          <Check className="h-4 w-4" />
                          Selected
                        </span>
                      ) : (
                        `Select ${bundle.tier}`
                      )}
                    </button>
                  )}
                </div>

                <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]" />
              </motion.div>
            );
          })}
        </motion.div>

        <button
          onClick={handleNext}
          className="absolute right-1 z-30 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
          aria-label="Next bundle"
          data-testid="inline-bundle-next"
        >
          <ChevronRight className="h-4 w-4 text-gray-700" />
        </button>
      </div>

      <div className="mt-2 px-2" data-testid="inline-comparison-table">
        <div className="flex items-center gap-2 mb-3" data-testid="comparison-header">
          <span className="flex-1 text-xs font-medium text-gray-900" data-testid="text-what-you-get">What you get:</span>
          <div className="flex items-center w-[140px]">
            <span className="w-[70px] text-center text-xs font-medium text-gray-500" data-testid="text-essentials-col">Essentials</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={activeBundle.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="w-[70px] text-center text-xs font-bold text-[#36bff9]"
                data-testid={`text-bundle-col-${activeBundle.id}`}
              >
                {activeBundle.tier}
              </motion.span>
            </AnimatePresence>
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
                <span className="flex-1 text-xs text-gray-700" data-testid={`comparison-label-${feature.key}`}>{feature.label}</span>
                <div className="flex items-center w-[140px]">
                  <div className="w-[70px] flex justify-center" data-testid={`comparison-essentials-${feature.key}`}>
                    {essentialsHas ? (
                      <Check className="h-3.5 w-3.5 text-gray-400" />
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </div>
                  <div className="w-[70px] flex justify-center" data-testid={`comparison-bundle-${feature.key}`}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${activeBundle.id}-${feature.key}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                      >
                        {activeBundleHas ? (
                          <Check className="h-3.5 w-3.5 text-[#36bff9]" />
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
      </div>
    </div>
  );
}
