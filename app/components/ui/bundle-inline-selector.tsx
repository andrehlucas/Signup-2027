"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Check, Minus } from "lucide-react";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Carousel } from "@astryxdesign/core/Carousel";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { StackItem } from "@astryxdesign/core/Stack";
import { Table, pixel, proportional } from "@astryxdesign/core/Table";
import type { TableColumn } from "@astryxdesign/core/Table";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import { Bundle, featureIndividualPrices, ESSENTIALS_PLAN } from "@/app/add-location/types";
import { tierScope } from "@/app/add-location/bundle-theme";

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

type ComparisonRow = { key: string; label: string };
const comparisonRows: ComparisonRow[] = comparisonFeatures.map(({ key, label }) => ({ key, label }));

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

/** Included / not included mark for a comparison cell, in the scoped tier accent. */
function FeatureMark({ included, label, muted = false }: { included: boolean; label: string; muted?: boolean }) {
  return included ? (
    <Icon icon={Check} size="sm" color={muted ? "secondary" : "accent"} label={`${label}: included`} />
  ) : (
    <Icon icon={Minus} size="sm" color="disabled" label={`${label}: not included`} />
  );
}

function TierCard({
  bundle,
  essentialsBundle,
  isSelected,
  onSelect,
}: {
  bundle: Bundle;
  essentialsBundle: Bundle;
  isSelected: boolean;
  onSelect: (bundle: Bundle) => void;
}) {
  const upgradeFeatures = getUpgradeFeatures(bundle, essentialsBundle);
  const savings = calculateSavings(bundle);

  return (
    <Card
      padding={5}
      height="100%"
      style={tierScope(bundle.id)}
      // Selected: a 2px outline in the tier's own accent (DESIGN.md).
      className={isSelected ? "[outline:2px_solid_var(--color-text-accent)] [outline-offset:-1px]" : undefined}
      data-testid={`inline-bundle-card-${bundle.id}`}
    >
      <VStack gap={3} height="100%">
        <HStack gap={2} vAlign="center" hAlign="between">
          <Heading level={3} color="accent" data-testid={`inline-badge-${bundle.id}`}>
            {bundle.tier}
          </Heading>
          <Text weight="bold" color="accent" hasTabularNumbers data-testid={`inline-price-${bundle.id}`}>
            ${bundle.price}/mo
          </Text>
        </HStack>

        <VStack gap={1.5} data-testid={`inline-description-${bundle.id}`}>
          <Text type="supporting" weight="semibold" color="accent">
            Essentials included, plus:
          </Text>
          <VStack as="ul" gap={1}>
            {upgradeFeatures.map((feature) => (
              <HStack as="li" key={feature.key} gap={1.5} vAlign="start">
                <Icon icon={Check} size="sm" color="accent" />
                <Text type="supporting">{feature.label}</Text>
              </HStack>
            ))}
          </VStack>
        </VStack>

        {savings > 0 && (
          <Text type="supporting" weight="semibold" color="accent" data-testid={`inline-savings-badge-${bundle.id}`}>
            Save ${savings}/mo
          </Text>
        )}

        <StackItem size="fill" />

        <Button
          type="button"
          variant={isSelected ? "primary" : "secondary"}
          label={isSelected ? "Selected" : `Select ${bundle.tier} Bundle`}
          icon={isSelected ? <Icon icon={Check} size="sm" /> : undefined}
          aria-pressed={isSelected}
          onClick={() => onSelect(bundle)}
          width="100%"
          data-testid={`inline-select-bundle-${bundle.id}`}
        />
      </VStack>
    </Card>
  );
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const [visibleIndex, setVisibleIndex] = useState(() =>
    Math.max(0, bundles.findIndex((bundle) => bundle.id === selectedBundleId))
  );

  // Phones: the comparison follows the carousel card in view. Carousel has no
  // slide-change callback, so watch which slide is most visible.
  useEffect(() => {
    const root = carouselRef.current;
    if (!root) return;
    const slides = [...root.querySelectorAll<HTMLElement>("[data-bundle-slide]")];
    const ratios = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target, entry.intersectionRatio);
        let best = -1;
        let bestRatio = 0.5;
        slides.forEach((slide, index) => {
          const ratio = ratios.get(slide) ?? 0;
          if (ratio > bestRatio) {
            best = index;
            bestRatio = ratio;
          }
        });
        if (best >= 0) setVisibleIndex(best);
      },
      { threshold: [0.25, 0.5, 0.75, 1] }
    );
    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [bundles]);

  if (bundles.length === 0) return null;

  const activeBundle = bundles[Math.min(visibleIndex, bundles.length - 1)];
  const activeSavings = calculateSavings(activeBundle);

  const featureColumn: TableColumn<ComparisonRow> = {
    key: "label",
    header: "Included features",
    width: proportional(2, { minWidth: 140 }),
    renderCell: (row) => <Text type="supporting">{row.label}</Text>,
  };
  const essentialsColumn: TableColumn<ComparisonRow> = {
    key: "essentials",
    header: <Text type="supporting" color="secondary">Essentials</Text>,
    width: pixel(88),
    align: "center",
    renderCell: (row) => (
      <FeatureMark
        included={essentialsBundle.features[row.key as keyof Bundle["features"]]}
        label="Essentials"
        muted
      />
    ),
  };
  const tierColumn = (bundle: Bundle, testId?: string): TableColumn<ComparisonRow> => ({
    key: bundle.id,
    header: (
      <Text type="supporting" weight="bold" color="accent" style={tierScope(bundle.id)} data-testid={testId}>
        {bundle.tier}
      </Text>
    ),
    width: pixel(104),
    align: "center",
    renderCell: (row) => (
      <HStack hAlign="center" style={tierScope(bundle.id)}>
        <FeatureMark included={bundle.features[row.key as keyof Bundle["features"]]} label={bundle.tier} />
      </HStack>
    ),
  });

  return (
    <VStack gap={4} className={className} data-testid="bundle-inline-selector">
      {/* Phones: one card per view; swipe or use the carousel buttons. */}
      <VStack ref={carouselRef} className="md:hidden">
        {/* Swipe (the next card peeks in); no overlay buttons over card text. */}
        <Carousel hasSnap hasButtons={false} gap={3} aria-label="Bundles">
          {bundles.map((bundle) => (
            <VStack key={bundle.id} data-bundle-slide width="82vw" maxWidth={340} height="100%">
              <TierCard
                bundle={bundle}
                essentialsBundle={essentialsBundle}
                isSelected={selectedBundleId === bundle.id}
                onSelect={onSelect}
              />
            </VStack>
          ))}
        </Carousel>
      </VStack>

      {/* Tablet and up: all tiers side by side. */}
      <VStack className="hidden md:flex">
        <Grid columns={{ minWidth: 200, max: 4 }} gap={4}>
          {bundles.map((bundle) => (
            <TierCard
              key={bundle.id}
              bundle={bundle}
              essentialsBundle={essentialsBundle}
              isSelected={selectedBundleId === bundle.id}
              onSelect={onSelect}
            />
          ))}
        </Grid>
      </VStack>

      {comparisonControl}
      <VStack gap={4} id={comparisonId} hidden={!comparisonOpen}>
        <Card variant="muted" padding={3} data-testid="essentials-baseline-option">
          <HStack gap={3} vAlign="center" wrap="wrap" data-testid="essentials-baseline-header">
            <Text type="supporting" color="secondary">Baseline plan</Text>
            <Heading level={3}>{essentialsBundle.tier}</Heading>
            <Text color="secondary">{essentialsBundle.name}</Text>
            <StackItem size="fill" />
            <Text weight="bold" hasTabularNumbers>${essentialsBundle.price}/mo</Text>
          </HStack>
        </Card>

        {/* Phones: Essentials against the tier in view. */}
        <VStack gap={3} className="md:hidden" data-testid="inline-comparison-table">
          <Table
            data={comparisonRows}
            idKey="key"
            density="compact"
            textOverflow="wrap"
            columns={[featureColumn, essentialsColumn, tierColumn(activeBundle, `text-bundle-col-${activeBundle.id}`)]}
          />
          {activeSavings > 0 && (
            <Text justify="center" weight="semibold" color="accent" style={tierScope(activeBundle.id)} data-testid={`savings-line-${activeBundle.id}`}>
              You save ${activeSavings}/mo with {activeBundle.tier}
            </Text>
          )}
        </VStack>

        {/* Tablet and up: every tier as a column. */}
        <VStack className="hidden md:flex" data-testid="inline-comparison-table-desktop">
          <Table
            data={comparisonRows}
            idKey="key"
            density="compact"
            textOverflow="wrap"
            columns={[featureColumn, essentialsColumn, ...bundles.map((bundle) => tierColumn(bundle))]}
          />
        </VStack>
      </VStack>
    </VStack>
  );
}
