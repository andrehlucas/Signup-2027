import { MailIcon, MapPinIcon } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const includedFeatures = [
  "Prestigious Business Address",
  "Professional Live Call Answering",
  "Personalized Call Transferring",
  "Business Phone/Fax Number",
  "Professional MailIcon Receipt",
  "Voicemail/Fax Converted to Email",
];

const interactiveCards = [
  {
    bgClass:
      "bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(119,119,119,1)_100%),linear-gradient(0deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.5)_100%),url(/figmaAssets/frame-411.png)] bg-cover bg-center",
    text: "Click to view demo",
    hasButton: true,
  },
  {
    bgClass:
      "bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(119,119,119,1)_100%),url(/figmaAssets/frame-411-1.png)] bg-cover bg-center",
    text: "Bundle & Save",
    hasButton: false,
  },
  {
    bgClass:
      "bg-[linear-gradient(0deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.5)_100%),linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(119,119,119,1)_100%),url(/figmaAssets/frame-411-2.png)] bg-cover bg-center",
    text: "Is a virtual office for me?",
    hasButton: false,
  },
  {
    bgClass:
      "bg-[linear-gradient(0deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.5)_100%),linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(119,119,119,1)_100%)]",
    text: "Address Only",
    hasButton: false,
  },
];

const benefitTypes = [
  {
    title: "Consultants:",
    description:
      "Professionals who travel frequently and require a consistent address for correspondence.",
    position: "row-[1_/_2] col-[1_/_2]",
  },
  {
    title: "Startups:",
    description:
      "Young companies looking to save on overheads while establishing a professional image.",
    position: "row-[2_/_3] col-[1_/_2]",
  },
  {
    title: "Freelancers:",
    description:
      "Independent professionals seeking a business address and phone number separate from their personal ones.",
    position: "row-[3_/_4] col-[1_/_2]",
  },
  {
    title: "Remote Teams:",
    description:
      "Organizations with employees working from various locations, needing a centralized business address.",
    position: "row-[1_/_2] col-[2_/_3]",
  },
  {
    title: "International Companies:",
    description:
      "Firms wanting a presence in a new country or region without setting up a physical office.",
    position: "row-[2_/_3] col-[2_/_3]",
  },
  {
    title: "E-commerce Businesses:",
    description:
      "Online retailers that need a physical address for returns and correspondence but don't have a brick-and-mortar store.",
    position: "row-[3_/_4] col-[2_/_3]",
  },
];

const featureCards = [
  {
    title: "Always Connected",
    description:
      "Never miss a vital business opportunity again. With a virtual office, every call is answered promptly and professionally, reflecting your company's commitment to excellence.",
    bgClass: "bg-[#ffffff9e]",
  },
  {
    title: "Brand Elevation",
    description:
      "A virtual office boosts your brand's credibility. With a prime business address and dedicated services, you instantly elevate your company's image, fostering trust among clients and partners.",
    bgClass: "bg-[#ffffffbd]",
  },
];

const popularLocations = [
  "Atlanta, GA",
  "Chicago, IL",
  "Dallas, TX",
  "Houston, TX",
  "Los Angeles, CA",
  "Miami, FL",
  "New York, NY",
  "Tampa, FL",
];

const faqItems = [
  {
    question:
      "How can having a virtual office provide me with a prestigious business address?",
  },
  {
    question:
      "How can having a virtual office provide me with a prestigious business address?",
  },
  {
    question:
      "How can having a virtual office provide me with a prestigious business address?",
  },
];

const reviews = [
  {
    rating: 4.9,
    reviewerName: "{reviewer-name}",
    reviewText:
      "Recently I setup my service with Opus. I'm very impressed with there outstanding customer service while I was completing the on boarding ...",
  },
  {
    rating: 4.9,
    reviewerName: "{reviewer-name}",
    reviewText:
      "Recently I setup my service with Opus. I'm very impressed with there outstanding customer service while I was completing the on boarding ...",
  },
  {
    rating: 4.9,
    reviewerName: "{reviewer-name}",
    reviewText:
      "Recently I setup my service with Opus. I'm very impressed with there outstanding customer service while I was completing the on boarding ...",
  },
  {
    rating: 4.9,
    reviewerName: "{reviewer-name}",
    reviewText:
      "Recently I setup my service with Opus. I'm very impressed with there outstanding customer service while I was completing the on boarding ...",
  },
];

export const Desktop = (): JSX.Element => {
  return (
    <div className="w-full min-w-[1440px] min-h-[4351px] flex">
      <div className="flex w-full h-full flex-col items-start">
        <section className="flex flex-col items-center w-full bg-basewhite">
          <div className="flex flex-col w-full items-center gap-8 px-0 py-10">
            <div className="flex items-end gap-8 max-w-screen-xl w-full px-8 py-0">
              <div className="flex flex-col w-full items-start justify-between">
                <div className="flex flex-col items-start gap-6 w-full">
                  <h1 className="font-normal text-gray-900 text-5xl leading-[60px] w-full [font-family:'Inter',Helvetica]">
                    <span className="text-[#0f1728] tracking-[-0.46px] leading-[60px]">
                      The Ultimate Virtual Office Solution.{" "}
                    </span>
                    <span className="font-bold text-[#36bff9] tracking-[-0.46px] leading-[60px]">
                      All-Inclusive
                    </span>
                    <span className="text-[#0f1728] tracking-[-0.46px] leading-[60px]">
                      {" "}
                      with no long-term contracts for only{" "}
                    </span>
                    <span className="font-bold text-[#36bff9] tracking-[-0.46px] leading-[60px]">
                      $99
                    </span>
                    <span className="text-[#0f1728] tracking-[-0.46px] leading-[60px]">
                      /month.
                    </span>
                  </h1>

                  <p className="[font-family:'Inter',Helvetica] font-normal text-gray-600 text-xl tracking-[0] leading-[30px]">
                    With 650+ locations throughout the USA
                  </p>
                </div>

                <div className="flex max-w-[800px] w-full items-start gap-4 mt-6">
                  <div className="flex flex-col items-start gap-3 flex-1">
                    <div className="flex flex-col items-start gap-1.5 w-full">
                      <div className="flex items-center gap-2 px-3.5 py-3 w-full bg-basewhite rounded-lg border border-solid border-[#cfd4dc] shadow-shadows-shadow-xs">
                        <MapPinIcon className="w-5 h-5 text-gray-500" />
                        <span className="flex-1 font-text-sm-text-md-regular font-[number:var(--text-sm-text-md-regular-font-weight)] text-gray-500 text-[length:var(--text-sm-text-md-regular-font-size)] tracking-[var(--text-sm-text-md-regular-letter-spacing)] leading-[var(--text-sm-text-md-regular-line-height)] [font-style:var(--text-sm-text-md-regular-font-style)]">
                          Search for Zip, State, or City
                        </span>
                      </div>
                    </div>

                    <p className="[font-family:'Inter',Helvetica] font-bold text-gray-600 text-sm tracking-[0] leading-5">
                      Browse Our Top Locations
                    </p>
                  </div>

                  <Button className="h-auto gap-1.5 px-[18px] py-3 bg-blue-light400 rounded-lg border border-solid border-[#36bff9] shadow-shadows-shadow-xs font-text-sm-text-md-semibold font-[number:var(--text-sm-text-md-semibold-font-weight)] text-basewhite text-[length:var(--text-sm-text-md-semibold-font-size)] tracking-[var(--text-sm-text-md-semibold-letter-spacing)] leading-[var(--text-sm-text-md-semibold-line-height)] [font-style:var(--text-sm-text-md-semibold-font-style)]">
                    Get Started
                  </Button>
                </div>
              </div>

              <div className="inline-flex flex-col max-w-[480px] items-start gap-3 pl-4 pr-0 py-0">
                <p className="font-text-sm-text-md-semibold font-[number:var(--text-sm-text-md-semibold-font-weight)] text-gray-600 text-[length:var(--text-sm-text-md-semibold-font-size)] tracking-[var(--text-sm-text-md-semibold-letter-spacing)] leading-[var(--text-sm-text-md-semibold-line-height)] whitespace-nowrap [font-style:var(--text-sm-text-md-semibold-font-style)]">
                  <span className="leading-[var(--text-sm-text-md-semibold-line-height)] font-text-sm-text-md-semibold [font-style:var(--text-sm-text-md-semibold-font-style)] font-[number:var(--text-sm-text-md-semibold-font-weight)] tracking-[var(--text-sm-text-md-semibold-letter-spacing)] text-[length:var(--text-sm-text-md-semibold-font-size)]">
                    When We Say
                  </span>
                  <span className="font-[number:var(--text-sm-text-md-semibold-font-weight)] leading-[var(--text-sm-text-md-semibold-line-height)] font-text-sm-text-md-semibold [font-style:var(--text-sm-text-md-semibold-font-style)] tracking-[var(--text-sm-text-md-semibold-letter-spacing)] text-[length:var(--text-sm-text-md-semibold-font-size)]">
                    {" "}
                    All-Inclusive,{" "}
                  </span>
                  <span className="leading-[var(--text-sm-text-md-semibold-line-height)] font-text-sm-text-md-semibold [font-style:var(--text-sm-text-md-semibold-font-style)] font-[number:var(--text-sm-text-md-semibold-font-weight)] tracking-[var(--text-sm-text-md-semibold-letter-spacing)] text-[length:var(--text-sm-text-md-semibold-font-size)]">
                    We Mean{" "}
                  </span>
                  <span className="font-[number:var(--text-sm-text-md-semibold-font-weight)] leading-[var(--text-sm-text-md-semibold-line-height)] font-text-sm-text-md-semibold [font-style:var(--text-sm-text-md-semibold-font-style)] tracking-[var(--text-sm-text-md-semibold-letter-spacing)] text-[length:var(--text-sm-text-md-semibold-font-size)]">
                    ALL-INCLUSIVE:
                  </span>
                </p>

                <div className="inline-flex flex-col items-start gap-3">
                  {includedFeatures.map((feature, index) => (
                    <div key={index} className="inline-flex items-start gap-3">
                      <img
                        className="w-8 h-8"
                        alt="Check icon"
                        src="/figmaAssets/check-icon.svg"
                      />
                      <div className="flex flex-col w-full items-start pt-0.5 pb-0 px-0">
                        <p className="[font-family:'Inter',Helvetica] font-normal text-gray-600 text-lg tracking-[0] leading-7 whitespace-nowrap">
                          {feature}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-end gap-2 px-5 py-0 w-full">
                  <Button
                    variant="ghost"
                    className="h-auto gap-2 p-0 overflow-hidden"
                  >
                    <span className="font-text-sm-text-md-semibold font-[number:var(--text-sm-text-md-semibold-font-weight)] text-gray-600 text-[length:var(--text-sm-text-md-semibold-font-size)] tracking-[var(--text-sm-text-md-semibold-letter-spacing)] leading-[var(--text-sm-text-md-semibold-line-height)] whitespace-nowrap [font-style:var(--text-sm-text-md-semibold-font-style)]">
                      Learn More
                    </span>
                    <img
                      className="w-5 h-5"
                      alt="Chevron right double"
                      src="/figmaAssets/chevron-right-double.svg"
                    />
                  </Button>
                </div>
              </div>
            </div>

            <div className="inline-flex flex-col items-start justify-center gap-2 w-full">
              <div className="flex max-w-[1280px] w-full items-center justify-between p-8">
                {interactiveCards.map((card, index) => (
                  <div
                    key={index}
                    className="flex max-w-[220px] w-full items-start h-[200px]"
                  >
                    <div
                      className={`flex items-end gap-2 ${card.bgClass} flex-1 h-full rounded-xl overflow-hidden shadow-shadows-shadow-lg relative`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="font-text-sm-text-md-bold font-[number:var(--text-sm-text-md-bold-font-weight)] text-[#ffffff] text-[length:var(--text-sm-text-md-bold-font-size)] text-center tracking-[var(--text-sm-text-md-bold-letter-spacing)] leading-[var(--text-sm-text-md-bold-line-height)] whitespace-nowrap [font-style:var(--text-sm-text-md-bold-font-style)]">
                          {card.text}
                        </p>
                      </div>
                      {card.hasButton && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[68px] h-[68px] bg-[#00000000] rounded-[100000000px] backdrop-blur-[2.0px] backdrop-brightness-[110%] [-webkit-backdrop-filter:blur(2.0px)_brightness(110%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)]">
                          <img
                            className="w-full h-full"
                            alt="Button"
                            src="/figmaAssets/button.svg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex max-w-[220px] w-full items-start h-[200px]">
                  <div className="flex flex-col items-center justify-between bg-[linear-gradient(180deg,rgba(54,191,250,1)_0%,rgba(3,137,209,1)_100%),linear-gradient(0deg,rgba(54,191,250,1)_0%,rgba(54,191,250,1)_100%)] flex-1 h-full rounded-xl overflow-hidden shadow-shadows-shadow-lg">
                    <div className="flex flex-col items-center justify-between px-0 py-3 flex-1 w-full">
                      <p className="[font-family:'Inter',Helvetica] font-medium text-[#ffffff] text-sm text-center tracking-[0] leading-5 whitespace-nowrap">
                        ALL-INCLUSIVE
                      </p>
                      <p className="[font-family:'Inter',Helvetica] font-semibold text-[#ffffff] text-5xl text-center tracking-[-0.96px] leading-[60px] whitespace-nowrap">
                        $99/mo
                      </p>
                    </div>
                    <div className="w-full h-[50px] flex items-center justify-center">
                      <p className="font-text-sm-text-md-bold font-[number:var(--text-sm-text-md-bold-font-weight)] text-[#ffffff] text-[length:var(--text-sm-text-md-bold-font-size)] text-center tracking-[var(--text-sm-text-md-bold-letter-spacing)] leading-[var(--text-sm-text-md-bold-line-height)] whitespace-nowrap [font-style:var(--text-sm-text-md-bold-font-style)]">
                        Sign Up Now
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-8 max-w-screen-xl w-full px-8 py-0">
              <div className="w-full h-[400px] rounded-2xl bg-[url(/figmaAssets/content-1.svg)] bg-cover bg-center" />
            </div>
          </div>

          <div className="inline-flex flex-col items-center">
            <p className="font-text-xl-regular font-[number:var(--text-xl-regular-font-weight)] text-[#181d27] text-[length:var(--text-xl-regular-font-size)] text-center tracking-[var(--text-xl-regular-letter-spacing)] leading-[var(--text-xl-regular-line-height)] whitespace-nowrap [font-style:var(--text-xl-regular-font-style)]">
              See below if a virtual office is a good fit for you
            </p>
            <img
              className="w-5 h-5"
              alt="Section icon"
              src="/figmaAssets/section-icon.svg"
            />
          </div>
        </section>

        <section className="flex flex-col items-center justify-center gap-[81px] px-0 py-10 w-full bg-[#ffffff]">
          <div className="flex max-w-screen-xl items-center justify-center gap-8 px-8 py-0 w-full">
            <div className="flex flex-wrap items-center gap-[26px_24px] flex-1">
              <div className="flex flex-col items-start gap-5 flex-1">
                <Badge
                  variant="secondary"
                  className="font-text-md-semibold font-[number:var(--text-md-semibold-font-weight)] text-[#016aa2] text-[length:var(--text-md-semibold-font-size)] tracking-[var(--text-md-semibold-letter-spacing)] leading-[var(--text-md-semibold-line-height)] [font-style:var(--text-md-semibold-font-style)] bg-transparent border-0 p-0 h-auto"
                >
                  Success Seekers
                </Badge>

                <div className="inline-flex flex-col items-start gap-5">
                  <h2 className="font-display-md-semibold font-[number:var(--display-md-semibold-font-weight)] text-[#181d27] text-[length:var(--display-md-semibold-font-size)] tracking-[var(--display-md-semibold-letter-spacing)] leading-[var(--display-md-semibold-line-height)] whitespace-nowrap [font-style:var(--display-md-semibold-font-style)]">
                    Who Truly Benefits
                    <br />
                    from a Virtual Office?
                  </h2>

                  <p className="font-text-xl-regular font-[number:var(--text-xl-regular-font-weight)] text-[#181d27] text-[length:var(--text-xl-regular-font-size)] tracking-[var(--text-xl-regular-letter-spacing)] leading-[var(--text-xl-regular-line-height)] [font-style:var(--text-xl-regular-font-style)]">
                    From budding entrepreneurs to established enterprises, a
                    virtual office elevates professionalism and flexibility,
                    setting the stage for success.
                  </p>
                </div>

                <div className="grid grid-cols-2 grid-rows-3 w-full gap-[8px_32px]">
                  {benefitTypes.map((benefit, index) => (
                    <div
                      key={index}
                      className={`${benefit.position} w-full h-full flex flex-col items-start`}
                    >
                      <h3 className="font-display-xs-semibold font-[number:var(--display-xs-semibold-font-weight)] text-[#181d27] text-[length:var(--display-xs-semibold-font-size)] tracking-[var(--display-xs-semibold-letter-spacing)] leading-[var(--display-xs-semibold-line-height)] [font-style:var(--display-xs-semibold-font-style)]">
                        {benefit.title}
                      </h3>
                      <p className="font-text-xl-regular font-[number:var(--text-xl-regular-font-weight)] text-[#181d27] text-[length:var(--text-xl-regular-font-size)] tracking-[var(--text-xl-regular-letter-spacing)] leading-[var(--text-xl-regular-line-height)] [font-style:var(--text-xl-regular-font-style)]">
                        {benefit.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col w-[500px] items-center justify-center gap-[29px] p-[30px] backdrop-blur-[146.5px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(146.5px)_brightness(100%)] bg-cover">
              {featureCards.map((card, index) => (
                <Card
                  key={index}
                  className={`flex flex-col items-start justify-center gap-[17px] p-[30px] flex-1 w-full ${card.bgClass} rounded-lg shadow-[0px_4px_4px_#00000040] border-0`}
                >
                  <CardContent className="flex flex-col items-start gap-2 w-full p-0">
                    <div className="inline-flex flex-col items-start gap-3.5">
                      <h3 className="font-display-xs-semibold font-[number:var(--display-xs-semibold-font-weight)] text-[#181d27] text-[length:var(--display-xs-semibold-font-size)] tracking-[var(--display-xs-semibold-letter-spacing)] leading-[var(--display-xs-semibold-line-height)] whitespace-nowrap [font-style:var(--display-xs-semibold-font-style)]">
                        {card.title}
                      </h3>
                      <img
                        className="w-[53px] h-[3px]"
                        alt="Vector"
                        src="/figmaAssets/vector-3.svg"
                      />
                    </div>
                    <p className="font-text-xl-regular font-[number:var(--text-xl-regular-font-weight)] text-[#181d27] text-[length:var(--text-xl-regular-font-size)] tracking-[var(--text-xl-regular-letter-spacing)] leading-[var(--text-xl-regular-line-height)] [font-style:var(--text-xl-regular-font-style)]">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center justify-center gap-6 px-0 py-20 w-full bg-[linear-gradient(0deg,rgba(241,241,241,1)_0%,rgba(241,241,241,1)_100%)] bg-building-bg">
          <h2 className="[font-family:'Inter',Helvetica] font-semibold text-[#181d27] text-3xl tracking-[0] leading-[38px] whitespace-nowrap">
            Over 650 Locations Across the USA
          </h2>

          <p className="font-text-xl-regular font-[number:var(--text-xl-regular-font-weight)] text-[#181d27] text-[length:var(--text-xl-regular-font-size)] tracking-[var(--text-xl-regular-letter-spacing)] leading-[var(--text-xl-regular-line-height)] whitespace-nowrap [font-style:var(--text-xl-regular-font-style)]">
            All-Inclusive Virtual Office Services for Only $99/mo.
          </p>

          <Button className="h-auto gap-1.5 px-[18px] py-3 bg-[#0ba4eb] rounded-lg border-[none] shadow-shadows-shadow-xs-skeuomorphic before:content-[''] before:absolute before:inset-0 before:p-0.5 before:rounded-lg before:[background:linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none font-text-md-semibold font-[number:var(--text-md-semibold-font-weight)] text-[#ffffff] text-[length:var(--text-md-semibold-font-size)] tracking-[var(--text-md-semibold-letter-spacing)] leading-[var(--text-md-semibold-line-height)] [font-style:var(--text-md-semibold-font-style)]">
            Sign Up Now
          </Button>
        </section>

        <section className="flex flex-col w-full gap-16 px-0 py-[60px] bg-basewhite items-center">
          <div className="flex flex-wrap items-start gap-[64px_64px] max-w-screen-xl w-full px-8 py-0">
            <div className="flex flex-col min-w-[480px] max-w-screen-md items-start gap-5 flex-1">
              <div className="flex flex-col items-start gap-3 w-full">
                <h2 className="font-[number:var(--display-sm-display-md-semibold-font-weight)] text-[#181d27] text-[length:var(--display-sm-display-md-semibold-font-size)] tracking-[var(--display-sm-display-md-semibold-letter-spacing)] leading-[var(--display-sm-display-md-semibold-line-height)] font-display-sm-display-md-semibold [font-style:var(--display-sm-display-md-semibold-font-style)]">
                  Curious About Renting a<br />
                  Virtual Office?
                </h2>
              </div>

              <p
                className="font-text-xl-regular font-[number:var(--text-xl-regular-font-weight)] text-[#181d27] text-[length:var(--text-xl-
regular-font-size)] tracking-[var(--text-xl-regular-letter-spacing)] leading-[var(--text-xl-regular-line-height)] [font-style:var(--text-xl-regular-font-style)]"
              >
                Explore how a virtual office can elevate your business presence
                while offering unparalleled flexibility. Tailored solutions
                await you.
              </p>

              <div className="inline-flex gap-5 items-center">
                <Button className="h-auto inline-flex items-center justify-center gap-1.5 px-[18px] py-3 bg-[#0ba4eb] rounded-lg border-[none] shadow-shadows-shadow-xs-skeuomorphic before:content-[''] before:absolute before:inset-0 before:p-0.5 before:rounded-lg before:[background:linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none font-text-md-semibold font-[number:var(--text-md-semibold-font-weight)] text-[#ffffff] text-[length:var(--text-md-semibold-font-size)] tracking-[var(--text-md-semibold-letter-spacing)] leading-[var(--text-md-semibold-line-height)] [font-style:var(--text-md-semibold-font-style)]">
                  Talk to an expert
                </Button>

                <div className="gap-2 inline-flex items-center justify-center">
                  <span className="font-text-xl-semibold font-[number:var(--text-xl-semibold-font-weight)] text-gray-600 text-[length:var(--text-xl-semibold-font-size)] tracking-[var(--text-xl-semibold-letter-spacing)] leading-[var(--text-xl-semibold-line-height)] whitespace-nowrap [font-style:var(--text-xl-semibold-font-style)]">
                    1 (888) 898 - 9868
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col min-w-[480px] items-start gap-8 flex-1">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col min-w-80 w-full items-center"
                >
                  <div className="flex items-start gap-6 w-full">
                    <div className="flex flex-col items-start gap-2 flex-1">
                      <p className="font-text-xl-medium font-[number:var(--text-xl-medium-font-weight)] text-[#181d27] text-[length:var(--text-xl-medium-font-size)] tracking-[var(--text-xl-medium-letter-spacing)] leading-[var(--text-xl-medium-line-height)] [font-style:var(--text-xl-medium-font-style)]">
                        {item.question}
                      </p>
                    </div>
                    <div className="inline-flex flex-col items-start pt-0.5 pb-0 px-0">
                      <img
                        className="w-6 h-6"
                        alt="PlusIcon circle"
                        src="/figmaAssets/plus-circle.svg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full gap-16 px-0 py-10 bg-basewhite flex flex-col items-center">
          <div className="flex flex-col items-center gap-8 max-w-screen-xl w-full px-8 py-0">
            <div className="flex flex-col items-center gap-8 w-full">
              <div className="max-w-screen-md items-center flex flex-col gap-5 w-full">
                <div className="flex flex-col items-center gap-3 w-full">
                  <h2 className="font-[number:var(--display-md-semibold-font-weight)] text-gray-900 text-[length:var(--display-md-semibold-font-size)] text-center tracking-[var(--display-md-semibold-letter-spacing)] leading-[var(--display-md-semibold-line-height)] font-display-md-semibold [font-style:var(--display-md-semibold-font-style)]">
                    Most Popular Locations
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-6 max-w-screen-xl w-full px-8 py-0">
            <div className="flex flex-wrap items-start gap-[48px_32px] w-full">
              {popularLocations.map((location, index) => (
                <div
                  key={index}
                  className="flex flex-col min-w-60 items-start gap-6 flex-1"
                >
                  <div className="w-full h-[200px] rounded-lg bg-cover bg-center" />
                  <div className="flex flex-col items-start gap-6 w-full">
                    <div className="flex flex-col items-start gap-4 w-full">
                      <div className="flex flex-col items-start gap-1 w-full">
                        <h3 className="[font-family:'Inter',Helvetica] font-semibold text-gray-900 text-xl tracking-[0] leading-[30px]">
                          {location}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-screen-xl justify-center gap-2 px-8 py-0 w-full flex flex-col items-center">
              <p className="[font-family:'Inter',Helvetica] font-normal text-gray-600 text-xl tracking-[0] leading-5 whitespace-nowrap">
                <span className="font-[number:var(--text-xl-regular-font-weight)] leading-[var(--text-xl-regular-line-height)] font-text-xl-regular [font-style:var(--text-xl-regular-font-style)] tracking-[var(--text-xl-regular-letter-spacing)] text-[length:var(--text-xl-regular-font-size)]">
                  View All Premium Locations
                </span>
              </p>
            </div>
          </div>
        </section>

        <section className="w-full items-center gap-8 px-0 py-10 bg-[#ffffff] flex flex-col">
          <div className="flex flex-col items-start gap-8 max-w-screen-xl w-full px-8 py-0">
            <div className="flex flex-col items-start gap-8 w-full">
              <div className="max-w-[800px] items-start flex flex-col gap-5 w-full">
                <div className="flex flex-col items-start gap-3 w-full">
                  <Badge
                    variant="secondary"
                    className="text-[#016aa2] font-text-sm-text-md-semibold font-[number:var(--text-sm-text-md-semibold-font-weight)] text-[length:var(--text-sm-text-md-semibold-font-size)] tracking-[var(--text-sm-text-md-semibold-letter-spacing)] leading-[var(--text-sm-text-md-semibold-line-height)] [font-style:var(--text-sm-text-md-semibold-font-style)] bg-transparent border-0 p-0 h-auto"
                  >
                    Customer Reviews
                  </Badge>

                  <h2 className="font-[number:var(--display-md-semibold-font-weight)] text-gray-900 text-[length:var(--display-md-semibold-font-size)] tracking-[var(--display-md-semibold-letter-spacing)] leading-[var(--display-md-semibold-line-height)] font-display-md-semibold [font-style:var(--display-md-semibold-font-style)]">
                    Opus Virtual Office Reviews
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="flex max-w-screen-xl items-center gap-[60px] px-8 py-0 w-full">
            <div className="flex flex-wrap items-start gap-[24px_24px] flex-1">
              {reviews.map((review, index) => (
                <Card
                  key={index}
                  className="min-w-[280px] items-start justify-center gap-3 p-3 flex-1 bg-gray-50 rounded-lg border-[1.5px] border-solid border-[#eaecf0]"
                >
                  <CardContent className="flex flex-col gap-3 p-0 w-full">
                    <div className="flex items-start gap-1 w-full">
                      <img
                        className="w-[52px] h-[52px]"
                        alt="Google"
                        src="/figmaAssets/google.svg"
                      />

                      <div className="flex flex-col items-start flex-1">
                        <p className="font-text-lg-semibold font-[number:var(--text-lg-semibold-font-weight)] text-gray-900 text-[length:var(--text-lg-semibold-font-size)] tracking-[var(--text-lg-semibold-letter-spacing)] leading-[var(--text-lg-semibold-line-height)] [font-style:var(--text-lg-semibold-font-style)]">
                          Google Review
                        </p>

                        <div className="inline-flex items-start gap-1">
                          {[...Array(5)].map((_, starIndex) => (
                            <div
                              key={starIndex}
                              className="w-[18px] h-[18px] overflow-hidden"
                            >
                              <img
                                className="w-full h-full"
                                alt="Star"
                                src="/figmaAssets/star-background.svg"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="inline-flex items-end justify-center gap-2">
                        <span className="font-display-sm-display-md-semibold font-[number:var(--display-sm-display-md-semibold-font-weight)] text-gray-600 text-[length:var(--display-sm-display-md-semibold-font-size)] tracking-[var(--display-sm-display-md-semibold-letter-spacing)] leading-[var(--display-sm-display-md-semibold-line-height)] whitespace-nowrap [font-style:var(--display-sm-display-md-semibold-font-style)]">
                          {review.rating}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex flex-col items-center justify-center gap-2 w-full">
                      <p className="font-text-sm-text-md-semibold font-[number:var(--text-sm-text-md-semibold-font-weight)] text-[#3d455a] text-[length:var(--text-sm-text-md-semibold-font-size)] tracking-[var(--text-sm-text-md-semibold-letter-spacing)] leading-[var(--text-sm-text-md-semibold-line-height)] w-full [font-style:var(--text-sm-text-md-semibold-font-style)]">
                        {review.reviewerName}
                      </p>

                      <p className="font-text-sm-text-md-regular font-[number:var(--text-sm-text-md-regular-font-weight)] text-[#3d455a] text-[length:var(--text-sm-text-md-regular-font-size)] tracking-[var(--text-sm-text-md-regular-letter-spacing)] leading-[var(--text-sm-text-md-regular-line-height)] w-full [font-style:var(--text-sm-text-md-regular-font-style)]">
                        {review.reviewText}
                      </p>

                      <p className="font-text-sm-text-md-semibold font-[number:var(--text-sm-text-md-semibold-font-weight)] text-[#016aa2] text-[length:var(--text-sm-text-md-semibold-font-size)] tracking-[var(--text-sm-text-md-semibold-letter-spacing)] leading-[var(--text-sm-text-md-semibold-line-height)] w-full [font-style:var(--text-sm-text-md-semibold-font-style)]">
                        Read More
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex flex-col max-w-screen-xl items-start justify-center gap-2 px-8 py-0 w-full">
            <Button
              variant="ghost"
              className="h-auto gap-1 pl-0 pr-3 py-0 rounded-lg overflow-hidden"
            >
              <span className="font-text-sm-semibold font-[number:var(--text-sm-semibold-font-weight)] text-gray-600 text-[length:var(--text-sm-semibold-font-size)] tracking-[var(--text-sm-semibold-letter-spacing)] leading-[var(--text-sm-semibold-line-height)] whitespace-nowrap [font-style:var(--text-sm-semibold-font-style)]">
                Read More Reviews
              </span>
              <img
                className="w-5 h-5"
                alt="Arrow narrow right"
                src="/figmaAssets/arrow-narrow-right.svg"
              />
            </Button>
          </div>
        </section>

        <section className="flex flex-col w-full items-center justify-center gap-16 px-0 py-[60px] bg-basewhite">
          <div className="items-center justify-center flex max-w-screen-xl w-full px-8 py-0">
            <div className="flex items-start justify-between px-10 py-0 flex-1 rounded-2xl overflow-hidden shadow-shadows-shadow-md bg-[linear-gradient(135deg,rgba(255,255,255,1)_10%,rgba(255,255,255,0)_100%),url(/figmaAssets/content.png)] bg-cover bg-center relative">
              <div className="flex flex-col items-start justify-center gap-5 px-16 py-5 flex-1">
                <div className="flex flex-col gap-5 w-full">
                  <Badge
                    variant="secondary"
                    className="text-[#0085c9] font-text-sm-text-md-semibold font-[number:var(--text-sm-text-md-semibold-font-weight)] text-[length:var(--text-sm-text-md-semibold-font-size)] tracking-[var(--text-sm-text-md-semibold-letter-spacing)] leading-[var(--text-sm-text-md-semibold-line-height)] [font-style:var(--text-sm-text-md-semibold-font-style)] bg-transparent border-0 p-0 h-auto w-fit"
                  >
                    Get your Free Ebook
                  </Badge>

                  <h2 className="font-semibold text-[#3d455a] text-4xl tracking-[-0.72px] leading-[44px] [font-family:'Inter',Helvetica]">
                    6-Steps for Starting a Business
                  </h2>

                  <p className="[font-family:'Inter',Helvetica] font-normal text-gray-900 text-xl tracking-[0] leading-[30px]">
                    Your Complete Guide to Building a Successful Business
                    <br />
                    Foundation with Confidence
                  </p>
                </div>

                <div className="flex max-w-[600px] w-full items-start gap-4">
                  <div className="flex flex-col items-start gap-1.5 flex-1">
                    <div className="flex flex-col items-start gap-1.5 w-full">
                      <div className="flex items-center gap-2 px-3.5 py-3 w-full bg-[#ffffff] rounded-lg border border-solid shadow-[0px_1px_2px_#0a0c120d]">
                        <MailIcon className="w-5 h-5 text-gray-500" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="flex-1 border-0 shadow-none p-0 h-auto [font-family:'Inter',Helvetica] font-normal text-[#717680] text-base tracking-[0] leading-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>

                    <p className="font-text-sm-regular font-[number:var(--text-sm-regular-font-weight)] text-gray-600 text-[length:var(--text-sm-regular-font-size)] tracking-[var(--text-sm-regular-letter-spacing)] leading-[var(--text-sm-regular-line-height)] [font-style:var(--text-sm-regular-font-style)]">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </div>

                  <Button className="h-auto inline-flex items-center justify-center gap-1.5 px-[18px] py-3 bg-[#0ba4eb] rounded-lg border-[none] shadow-shadows-shadow-xs-skeuomorphic before:content-[''] before:absolute before:inset-0 before:p-0.5 before:rounded-lg before:[background:linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none font-text-md-semibold font-[number:var(--text-md-semibold-font-weight)] text-[#ffffff] text-[length:var(--text-md-semibold-font-size)] tracking-[var(--text-md-semibold-letter-spacing)] leading-[var(--text-md-semibold-line-height)] whitespace-nowrap [font-style:var(--text-md-semibold-font-style)]">
                    Get your&nbsp;&nbsp;Ebook
                  </Button>
                </div>
              </div>

              <div className="w-[304px] h-[324px]" />

              <img
                className="absolute top-[-162px] left-[206px] w-[304px] h-[324px] object-cover"
                alt="Asian man portrait"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
