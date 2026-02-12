"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Bundle } from "@/app/add-location/types";

const CARD_HEIGHT = 190;

const bundleBadges: Record<string, string> = {
  plus: "/images/plus-badge.svg",
  pro: "/images/pro-badge.svg",
  premium: "/images/premium-badge.svg",
};

const bundleDescriptions: Record<string, string> = {
  plus: "Everything in Essentials, plus call log, toll-free number, and callout to boost your reach.",
  pro: "Essentials and Plus features combined with supervised call transfer for seamless client handling.",
  premium: "The complete package — every feature included plus dedicated message taking for your team.",
};

const comparisonFeatures: { key: keyof Bundle["features"]; label: string }[] = [
  { key: "businessAddress", label: "Prestigious Business Address" },
  { key: "liveCallAnswering", label: "Professional Live Call Answering" },
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

  const centerLeft = cardPadding;
  const nextLeft = cardPadding + centerCardWidth + cardPadding;

  return (
    <div
      className={cn("w-full", className)}
      data-testid="bundle-inline-selector"
    >
      <div
        ref={containerRef}
        className="relative py-4 overflow-hidden"
      >
        <motion.div
          className="relative w-full cursor-grab active:cursor-grabbing"
          style={{ height: CARD_HEIGHT }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={onDragEnd}
        >
          {[0, 1].map((offset) => {
            const absIndex = activeIndex + offset;
            const index = wrap(0, count, absIndex);
            const bundle = bundles[index];
            const isCenter = offset === 0;
            const isSelected = selectedBundleId === bundle.id;
            const badgeSrc = bundleBadges[bundle.id];

            return (
              <motion.div
                key={`${bundle.id}-${absIndex}`}
                className={cn(
                  "absolute top-0 rounded-2xl overflow-hidden",
                  isCenter ? "z-20 shadow-lg" : "z-10 pointer-events-none shadow-md",
                  isSelected && isCenter
                    ? "ring-2 ring-[#36bff9]"
                    : ""
                )}
                style={{
                  width: centerCardWidth,
                  height: CARD_HEIGHT,
                  background: "linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 30%, #fffde7 60%, #fff8e1 100%)",
                }}
                initial={false}
                animate={{
                  left: isCenter ? centerLeft : nextLeft,
                  scale: isCenter ? 1 : 0.97,
                  opacity: isCenter ? 1 : 0.45,
                }}
                transition={{ type: "tween", ease: [0.25, 0.1, 0.25, 1], duration: 0.4 }}
                onClick={() => {
                  if (offset !== 0) goTo(activeIndex + offset);
                }}
                data-testid={`inline-bundle-card-${bundle.id}`}
              >
                <div className="p-5 flex flex-col justify-between h-full">
                  <div className="flex flex-col gap-2">
                    {badgeSrc && (
                      <img
                        src={badgeSrc}
                        alt={bundle.tier}
                        className="h-7 w-auto object-contain self-start"
                        data-testid={`inline-badge-${bundle.id}`}
                      />
                    )}

                    <p className="text-sm leading-relaxed text-gray-600 line-clamp-2" data-testid={`inline-description-${bundle.id}`}>
                      {bundleDescriptions[bundle.id] || bundle.name}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCenter) onSelect(bundle);
                    }}
                    className={cn(
                      "w-full py-2.5 rounded-xl text-sm font-semibold transition-all text-white",
                      isSelected && isCenter
                        ? "bg-[#36bff9] hover:bg-[#2aa8e0]"
                        : "bg-[#1a1a1a] hover:bg-[#333]"
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
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-md transition-colors"
          aria-label="Next bundle"
          data-testid="inline-bundle-next"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <div className="mt-2 px-2" data-testid="inline-comparison-table">
        <div className="flex items-center gap-2 mb-3" data-testid="comparison-header">
          <span className="flex-1 min-w-0 text-xs font-medium text-gray-900" data-testid="text-what-you-get">What you get:</span>
          <div className="flex items-center flex-shrink-0" style={{ width: "140px" }}>
            <span className="text-center text-xs font-medium text-gray-500" style={{ width: "70px" }} data-testid="text-essentials-col">Essentials</span>
            <div className="relative overflow-hidden" style={{ width: "70px", height: "16px" }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeBundle.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#36bff9]"
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
