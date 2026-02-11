"use client";

import * as React from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, DollarSign, X } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Bundle, featureLabels } from "@/app/add-location/types";

interface BundleFocusRailProps {
  bundles: Bundle[];
  selectedBundleId?: string;
  onSelect: (bundle: Bundle) => void;
  onClose: () => void;
  onRevert?: () => void;
  essentialsPrice?: number;
  className?: string;
}

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

const BASE_SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 1,
};

const TAP_SPRING = {
  type: "spring" as const,
  stiffness: 450,
  damping: 18,
  mass: 1,
};

export function BundleFocusRail({
  bundles,
  selectedBundleId,
  onSelect,
  onClose,
  onRevert,
  essentialsPrice = 99,
  className,
}: BundleFocusRailProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const getSelectedIdx = React.useCallback(() => {
    if (!selectedBundleId) return 0;
    const idx = bundles.findIndex((b) => b.id === selectedBundleId);
    return idx >= 0 ? idx : 0;
  }, [bundles, selectedBundleId]);

  const [active, setActive] = React.useState(getSelectedIdx);
  const lastWheelTime = React.useRef<number>(0);
  const count = bundles.length;

  React.useEffect(() => {
    setActive(getSelectedIdx());
  }, [selectedBundleId, getSelectedIdx]);

  React.useEffect(() => {
    containerRef.current?.focus();
  }, []);

  if (count === 0) return null;

  const activeIndex = wrap(0, count, active);
  const activeItem = bundles[activeIndex];

  const handlePrev = () => setActive((p) => p - 1);
  const handleNext = () => setActive((p) => p + 1);

  const onWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 400) return;
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    const delta = isHorizontal ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 20) {
      if (delta > 0) handleNext();
      else handlePrev();
      lastWheelTime.current = now;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "Escape") onClose();
  };

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

  const isSelected = (bundle: Bundle) => selectedBundleId === bundle.id;

  return (
    <div
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden text-white outline-none select-none",
        className
      )}
      ref={containerRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
      data-testid="bundle-focus-rail"
    >
      <div className="relative z-10 flex flex-1 flex-col justify-center px-4">
        <motion.div
          className="relative mx-auto flex h-[500px] w-full max-w-5xl items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ perspective: "1200px" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={onDragEnd}
        >
          {visibleIndices.map((offset) => {
            const absIndex = active + offset;
            const index = wrap(0, count, absIndex);
            const bundle = bundles[index];
            const isCenter = offset === 0;
            const dist = Math.abs(offset);

            const xOffset = offset * 360;
            const zOffset = -dist * 150;
            const scale = isCenter ? 1 : 0.82;
            const rotateY = offset * -15;
            const opacity = isCenter ? 1 : 0.5;
            const blur = isCenter ? 0 : dist * 4;
            const brightness = isCenter ? 1 : 0.6;
            const selected = isSelected(bundle);

            return (
              <motion.div
                key={absIndex}
                className={cn(
                  "absolute w-[320px] md:w-[360px] rounded-2xl border-2 shadow-2xl overflow-hidden",
                  "bg-gradient-to-b from-[#0a1628] to-[#0f2240]",
                  isCenter ? "z-20" : "z-10",
                  selected && isCenter
                    ? "border-[#36bff9] ring-2 ring-[#36bff9]"
                    : "border-white/10"
                )}
                initial={false}
                animate={{
                  x: xOffset,
                  z: zOffset,
                  scale: scale,
                  rotateY: rotateY,
                  opacity: opacity,
                  filter: `blur(${blur}px) brightness(${brightness})`,
                }}
                transition={(val: string) => {
                  if (val === "scale") return TAP_SPRING;
                  return BASE_SPRING;
                }}
                style={{ transformStyle: "preserve-3d" }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (offset !== 0) setActive((p) => p + offset);
                }}
                data-testid={`rail-bundle-card-${bundle.id}`}
              >
                <div className="p-6 flex flex-col h-full min-h-[440px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#36bff9]">
                      {bundle.badge}
                    </span>
                    {selected && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-300 bg-emerald-500/20 rounded-full px-2 py-0.5">
                        <Check className="h-3 w-3" />
                        Active
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">
                    {bundle.tier}
                  </h3>

                  <div className="mb-3">
                    <span className="text-3xl font-bold text-white">
                      ${bundle.price}
                    </span>
                    {bundle.originalPrice && (
                      <span className="text-sm text-white/40 line-through ml-2">
                        ${bundle.originalPrice}
                      </span>
                    )}
                    <span className="text-white/50 text-sm ml-1">/mo</span>
                  </div>

                  <div className="space-y-2.5 flex-1">
                    {Object.entries(bundle.features)
                      .filter(([, enabled]) => enabled)
                      .map(([key]) => (
                        <div key={key} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#36bff9]/20 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3.5 w-3.5 text-[#36bff9]" />
                          </div>
                          <span className="text-white/80 text-sm">
                            {featureLabels[key]}
                          </span>
                        </div>
                      ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(bundle);
                    }}
                    className={cn(
                      "mt-4 w-full py-2.5 rounded-lg text-sm font-semibold transition-all",
                      selected
                        ? "bg-[#36bff9] hover:bg-[#2aa8e0] text-white"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    )}
                    data-testid={`rail-button-select-bundle-${bundle.id}`}
                  >
                    {selected ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="h-4 w-4" />
                        Selected
                      </span>
                    ) : (
                      "Select"
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 rounded-full bg-[#0a1628]/10 p-3 text-white backdrop-blur-sm ring-1 ring-[#0a1628]/10 transition hover:bg-[#0a1628]/20 active:scale-90"
            aria-label="Previous bundle"
            data-testid="rail-arrow-prev"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 rounded-full bg-[#0a1628]/10 p-3 text-white backdrop-blur-sm ring-1 ring-[#0a1628]/10 transition hover:bg-[#0a1628]/20 active:scale-90"
            aria-label="Next bundle"
            data-testid="rail-arrow-next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </motion.div>

        <div className="mx-auto mt-6 flex w-full max-w-4xl flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.25 }}
              className="text-center"
            >
              <h3 className="text-4xl font-extrabold tracking-tight text-[#0a1628]">
                {activeItem.tier}
              </h3>
              {activeItem.originalPrice && (
                <p className="text-sm font-semibold text-white">
                  Save ${activeItem.originalPrice - activeItem.price}/mo
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-[#0a1628]/80 p-1 ring-1 ring-white/10 backdrop-blur-md">
              <button
                onClick={handlePrev}
                className="rounded-full p-2.5 text-white/60 transition hover:bg-white/10 hover:text-white active:scale-95"
                aria-label="Previous"
                data-testid="rail-button-prev"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="min-w-[40px] text-center text-xs font-mono text-white/50">
                {activeIndex + 1} / {count}
              </span>
              <button
                onClick={handleNext}
                className="rounded-full p-2.5 text-white/60 transition hover:bg-white/10 hover:text-white active:scale-95"
                aria-label="Next"
                data-testid="rail-button-next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {onRevert && selectedBundleId !== "essentials" && (
            <button
              onClick={onRevert}
              className="text-sm text-[#0a1628]/60 hover:text-[#0a1628] underline"
              data-testid="button-revert-essentials"
            >
              Revert to The Essentials (${essentialsPrice}/mo)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
