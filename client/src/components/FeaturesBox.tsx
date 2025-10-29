import { Button } from "@/components/ui/button";

interface FeaturesBoxProps {
  features: string[];
}

export const FeaturesBox = ({ features }: FeaturesBoxProps) => {
  return (
    <div className="inline-flex flex-col w-full lg:max-w-[418px] self-stretch items-start gap-3 sm:gap-2.5 pl-0 lg:pl-4 pr-0 py-0">
      <p className="font-text-sm-text-md-regular font-[number:var(--text-sm-text-md-regular-font-weight)] text-gray-600 text-[length:var(--text-sm-text-md-regular-font-size)] tracking-[var(--text-sm-text-md-regular-letter-spacing)] leading-[var(--text-sm-text-md-regular-line-height)] [font-style:var(--text-sm-text-md-regular-font-style)]">
        When We Say <span className="font-semibold">All-Inclusive,</span><br />We Mean <span className="font-semibold">ALL-INCLUSIVE:</span>
      </p>

      <div className="inline-flex flex-col items-start gap-3.5 sm:gap-3 w-full">
        {features.map((feature, index) => (
          <div key={index} className="inline-flex items-start gap-2.5 sm:gap-2.5" data-testid={`feature-${index}`}>
            <img
              className="w-7 h-7 sm:w-7 sm:h-7 flex-shrink-0"
              alt="Check icon"
              src="/figmaAssets/check-icon.svg"
              width="32"
              height="32"
              loading="eager"
            />
            <div className="flex flex-col w-full items-start pt-0.5 pb-0 px-0">
              <p className="[font-family:'Inter',Helvetica] font-normal text-gray-600 text-base sm:text-sm md:text-base tracking-[0] leading-normal">
                {feature}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-end gap-2 px-0 sm:px-5 py-0 w-full">
        <Button
          variant="ghost"
          className="h-auto gap-2 p-0 overflow-hidden"
          data-testid="button-learn-more"
        >
          <span className="font-text-sm-text-md-semibold font-[number:var(--text-sm-text-md-semibold-font-weight)] text-gray-600 text-[length:var(--text-sm-text-md-semibold-font-size)] tracking-[var(--text-sm-text-md-semibold-letter-spacing)] leading-[var(--text-sm-text-md-semibold-line-height)] whitespace-nowrap [font-style:var(--text-sm-text-md-semibold-font-style)]">
            Learn More
          </span>
          <img
            className="w-5 h-5"
            alt="Chevron right double"
            src="/figmaAssets/chevron-right-double.svg"
            width="20"
            height="20"
            loading="eager"
          />
        </Button>
      </div>
    </div>
  );
};
