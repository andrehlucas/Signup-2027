import { useState } from "react";
import { MailIcon, MapPinIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FeaturesBox } from "@/components/FeaturesBox";
import { ActionSearchBar, LocationItem } from "@/components/ActionSearchBar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import officeBuildingImg from "@assets/office-building_1761587957783.webp";
import businessAddressBg from "@assets/business-address-bg_1761590800705.webp";
import bgCtaImg from "@assets/bg-cta_1761591194000.webp";
import bgCtaPromoImg from "@assets/bg-cta-promo_1761591480531.webp";
import man_holding_tablet from "@assets/man-holding-tablet.webp";
import receptionistCardBg from "@assets/receptionist-card-bg_1761593285326.webp";
import cashHandsHoldingBg from "@assets/cash-hands-holding_1761593304143.webp";
import multipleProfessionalsBg from "@assets/multiple-professionals_1761593320843.webp";
import newYorkAerialView from "@assets/new-york-aerial-view_1761593422460.webp";
import promoVideo from "@assets/Opus VO - 45 Sec Promo - 1920x1080_1761681440103.mp4";
import playerCover from "@assets/player-cover_1761748637474.webp";

const includedFeatures = [
  "Prestigious Business Address",
  "Professional Live Call Answering",
  "Personalized Call Transferring",
  "Business Phone/Fax Number",
  "Professional Mail Receipt",
  "Voicemail/Fax Converted to Email",
];

const interactiveCards = [
  {
    bgClass:
      "bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(119,119,119,1)_100%),linear-gradient(0deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.5)_100%)]",
    bgImage: receptionistCardBg,
    text: "Click to view demo",
    hasButton: true,
  },
  {
    bgClass:
      "bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(119,119,119,1)_100%)]",
    bgImage: cashHandsHoldingBg,
    text: "Bundle & Save",
    hasButton: false,
  },
  {
    bgClass:
      "bg-[linear-gradient(0deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.5)_100%),linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(119,119,119,1)_100%)]",
    bgImage: multipleProfessionalsBg,
    text: "Is a virtual office for me?",
    hasButton: false,
  },
  {
    bgClass:
      "bg-[linear-gradient(0deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.5)_100%),linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(119,119,119,1)_100%)]",
    bgImage: businessAddressBg,
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
  { name: "Atlanta, GA", image: "/atlanta.webp" },
  { name: "Chicago, IL", image: "/chicago.webp" },
  { name: "Dallas, TX", image: "/dallas.webp" },
  { name: "Houston, TX", image: "/houston.webp" },
  { name: "Los Angeles, CA", image: "/los-angeles.webp" },
  { name: "Miami, FL", image: "/miami.webp" },
  { name: "New York, NY", image: "/new-york.webp" },
  { name: "Tampa, FL", image: "/tampa.webp" },
];

const sampleLocations: LocationItem[] = [
  { 
    id: "1", 
    city: "New York", 
    state: "NY", 
    type: "city", 
    premium: true,
    addressLine1: "1345 Avenue of the Americas",
    addressLine2: "Floor 2"
  },
  { 
    id: "2", 
    city: "Los Angeles", 
    state: "CA", 
    type: "city", 
    premium: true,
    addressLine1: "11601 Wilshire Blvd",
    addressLine2: "Suite 500"
  },
  { 
    id: "3", 
    city: "Chicago", 
    state: "IL", 
    type: "city", 
    premium: true,
    addressLine1: "200 S Wacker Dr",
    addressLine2: "Suite 3100"
  },
  { 
    id: "4", 
    city: "California", 
    type: "state",
    addressLine1: "32 Locations available",
    addressLine2: "Click to See locations"
  },
  { 
    id: "5", 
    city: "Texas", 
    type: "state",
    addressLine1: "20 Locations available",
    addressLine2: "Click to See locations"
  },
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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const Desktop = (): JSX.Element => {
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  return (
    <div className="w-full flex pt-[72px] lg:pt-[104px]">
      <div className="flex w-full h-full flex-col items-start">
        <section className="flex flex-col items-center w-full bg-basewhite">
          <div className="flex flex-col w-full items-center gap-4 sm:gap-6 md:gap-8 px-0 py-6 sm:py-8 md:py-10">
            <div className="flex flex-col lg:flex-row items-start gap-6 md:gap-8 max-w-screen-xl w-full px-4 sm:px-6 md:px-8 py-0">
              <motion.div 
                className="flex flex-col flex-1 items-start justify-start h-full w-full"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0 }}
              >
                <div className="flex flex-col items-start gap-4 sm:gap-6 w-full">
                  <h1 className="[font-family:'Inter',Helvetica] font-normal text-[#0f1728] text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[-0.46px] leading-tight w-full">The Ultimate Virtual Office Solution. <span className="font-bold text-blue-light400">All-Inclusive</span> with no long-term contracts for only <span className="font-bold text-blue-light400">$99</span>/month.</h1>

                  <p className="[font-family:'Inter',Helvetica] font-normal text-gray-600 text-base sm:text-lg md:text-xl tracking-[0] leading-relaxed">
                    With 650+ locations throughout the USA
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row max-w-[800px] w-full items-start gap-3 sm:gap-4 mt-4 sm:mt-6">
                  <div className="flex flex-col items-start gap-3 flex-1 w-full sm:max-w-[400px]">
                    <div className="flex flex-col items-start gap-1.5 w-full">
                      <ActionSearchBar
                        initialResults={sampleLocations}
                        placeholder="Search for Zip, State, or City"
                        onSelect={(location) => {
                          console.log("Selected location:", location);
                        }}
                      />
                    </div>

                    <p className="[font-family:'Inter',Helvetica] font-bold text-gray-600 text-sm tracking-[0] leading-normal">
                      Browse Our Top Locations
                    </p>
                  </div>

                  <Button className="hidden sm:flex h-[50px] gap-1.5 px-[18px] py-3 w-full sm:w-auto bg-blue-light400 rounded-lg border border-solid border-[#36bff9] shadow-shadows-shadow-xs font-text-sm-text-md-semibold font-[number:var(--text-sm-text-md-semibold-font-weight)] text-basewhite text-[length:var(--text-sm-text-md-semibold-font-size)] tracking-[var(--text-sm-text-md-semibold-letter-spacing)] leading-[var(--text-sm-text-md-semibold-line-height)] [font-style:var(--text-sm-text-md-semibold-font-style)]" data-testid="button-get-started">
                    Get Started
                  </Button>
                </div>
              </motion.div>

              <motion.div 
                className="w-full lg:w-auto"
                initial={{ opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0 }}
              >
                <FeaturesBox features={includedFeatures} />
              </motion.div>
            </div>

            <div className="flex flex-col items-start justify-center gap-2 w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 max-w-[1280px] w-full px-4 sm:px-6 md:px-8 mx-auto">
                {interactiveCards.map((card, index) => (
                  <div
                    key={index}
                    className={`flex w-full items-start h-[130px] ${index === 0 ? 'hidden sm:flex' : ''}`}
                    data-testid={`card-interactive-${index}`}
                  >
                    <motion.div
                      className={`flex items-end gap-2 ${card.bgClass} flex-1 h-full rounded-xl overflow-hidden shadow-shadows-shadow-lg relative bg-cover bg-center cursor-pointer`}
                      style={card.bgImage ? { backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 100%), linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(119,119,119,1) 100%), url(${card.bgImage})` } : undefined}
                      whileHover={{ filter: "brightness(1.2)" }}
                      transition={{ duration: 0.3 }}
                      onClick={card.hasButton ? () => setIsVideoDialogOpen(true) : undefined}
                    >
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center h-[42px] px-2">
                        <p className="font-text-sm-text-md-bold font-[number:var(--text-sm-text-md-bold-font-weight)] text-[#ffffff] text-[length:var(--text-sm-text-md-bold-font-size)] text-center tracking-[var(--text-sm-text-md-bold-letter-spacing)] leading-[var(--text-sm-text-md-bold-line-height)] [font-style:var(--text-sm-text-md-bold-font-style)] text-xs sm:text-sm">
                          {card.text}
                        </p>
                      </div>
                      {card.hasButton && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+4px)] w-[68px] h-[68px] bg-[#00000000] rounded-[100000000px] backdrop-blur-[2.0px] backdrop-brightness-[110%] [-webkit-backdrop-filter:blur(2.0px)_brightness(110%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)]">
                          <img
                            className="w-full h-full"
                            alt="Button"
                            src="/figmaAssets/button.svg"
                            width="68"
                            height="68"
                            loading="eager"
                          />
                        </div>
                      )}
                    </motion.div>
                  </div>
                ))}

                <div 
                  className="flex w-full items-start h-[130px]" 
                  data-testid="card-pricing"
                >
                  <motion.div 
                    className="flex items-end gap-2 bg-[linear-gradient(180deg,rgba(54,191,250,1)_0%,rgba(3,137,209,1)_100%),linear-gradient(0deg,rgba(54,191,250,1)_0%,rgba(54,191,250,1)_100%)] flex-1 h-full rounded-xl overflow-hidden shadow-shadows-shadow-lg relative cursor-pointer group"
                    initial="rest"
                    whileHover="hover"
                  >
                    <motion.div 
                      className="absolute top-0 inset-x-0 flex items-center justify-center pt-3"
                      variants={{
                        rest: { opacity: 1 },
                        hover: { opacity: 1 }
                      }}
                    >
                      <p className="[font-family:'Inter',Helvetica] font-medium text-[#ffffff] text-xs sm:text-sm text-center tracking-[0] leading-normal whitespace-nowrap">
                        ALL-INCLUSIVE
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className="absolute inset-0 flex flex-col items-center justify-center"
                      variants={{
                        rest: { gap: "0px" },
                        hover: { gap: "4px" }
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="[font-family:'Inter',Helvetica] font-bold text-[#ffffff] text-center tracking-[-0.96px] whitespace-nowrap text-3xl sm:text-4xl lg:text-[48px]">
                        $99/mo
                      </p>
                      <motion.p 
                        className="[font-family:'Inter',Helvetica] font-medium text-[#ffffff] text-center tracking-[0] leading-normal whitespace-nowrap text-xs sm:text-sm"
                        variants={{
                          rest: { opacity: 0, height: 0 },
                          hover: { opacity: 1, height: "auto" }
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        NO HIDDEN FEES
                      </motion.p>
                    </motion.div>

                    <motion.div 
                      className="absolute inset-x-0 bottom-0 flex items-center justify-center h-[42px] px-2"
                      variants={{
                        rest: { opacity: 1 },
                        hover: { opacity: 1 }
                      }}
                    >
                      <p className="font-text-sm-text-md-bold font-[number:var(--text-sm-text-md-bold-font-weight)] text-[#ffffff] text-[length:var(--text-sm-text-md-bold-font-size)] text-center tracking-[var(--text-sm-text-md-bold-letter-spacing)] leading-[var(--text-sm-text-md-bold-line-height)] [font-style:var(--text-sm-text-md-bold-font-style)] text-xs sm:text-sm">
                        Sign Up Now
                      </p>
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              <div 
                className="sm:hidden w-full px-4 sm:px-6 md:px-8 mx-auto max-w-[1280px]"
                data-testid="video-promo-mobile"
              >
                <video
                  className="w-full rounded-xl shadow-shadows-shadow-lg"
                  controls
                  preload="none"
                  poster={playerCover}
                >
                  <source src={promoVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            <motion.div 
              className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 max-w-screen-xl w-full px-4 sm:px-6 md:px-8 py-0"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
            >
              <div className="w-full h-[200px] sm:h-[300px] md:h-[400px] rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url(${newYorkAerialView})` }} />
            </motion.div>
          </div>

          <motion.div 
            className="inline-flex flex-col items-center px-4"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <p className="font-text-xl-regular font-[number:var(--text-xl-regular-font-weight)] text-[#181d27] text-[length:var(--text-xl-regular-font-size)] text-center tracking-[var(--text-xl-regular-letter-spacing)] leading-[var(--text-xl-regular-line-height)] [font-style:var(--text-xl-regular-font-style)]">
              See below if a virtual office is a good fit for you
            </p>
            <img
              className="w-5 h-5"
              alt="Section icon"
              src="/figmaAssets/section-icon.svg"
              width="20"
              height="20"
              loading="eager"
            />
          </motion.div>
        </section>

        <section className="flex flex-col items-center justify-center gap-12 sm:gap-16 md:gap-20 lg:gap-[81px] px-0 py-6 sm:py-8 md:py-10 w-full bg-[#ffffff]">
          <motion.div 
            className="flex flex-col lg:flex-row max-w-screen-xl items-start justify-center gap-6 md:gap-8 px-4 sm:px-6 md:px-8 py-0 w-full"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div 
              className="flex flex-col items-start gap-5 flex-1 w-full"
              variants={fadeInUp}
            >
              <Badge
                variant="secondary"
                className="font-text-md-semibold font-[number:var(--text-md-semibold-font-weight)] text-[#016aa2] text-[length:var(--text-md-semibold-font-size)] tracking-[var(--text-md-semibold-letter-spacing)] leading-[var(--text-md-semibold-line-height)] [font-style:var(--text-md-semibold-font-style)] bg-transparent border-0 p-0 h-auto"
              >
                Success Seekers
              </Badge>

              <div className="inline-flex flex-col items-start gap-4 sm:gap-5">
                <h2 className="font-display-md-semibold font-[number:var(--display-md-semibold-font-weight)] text-[#181d27] text-[length:var(--display-md-semibold-font-size)] tracking-[var(--display-md-semibold-letter-spacing)] leading-[var(--display-md-semibold-line-height)] [font-style:var(--display-md-semibold-font-style)] text-2xl sm:text-3xl md:text-4xl">
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

              <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 sm:gap-6 md:gap-[8px_32px]">
                {benefitTypes.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="w-full h-full flex flex-col items-start gap-1"
                    data-testid={`benefit-${index}`}
                    variants={fadeInUp}
                  >
                    <h3 className="font-display-xs-semibold font-[number:var(--display-xs-semibold-font-weight)] text-[#181d27] text-[length:var(--display-xs-semibold-font-size)] tracking-[var(--display-xs-semibold-letter-spacing)] leading-[var(--display-xs-semibold-line-height)] [font-style:var(--display-xs-semibold-font-style)]">
                      {benefit.title}
                    </h3>
                    <p className="font-text-lg-regular font-[number:var(--text-lg-regular-font-weight)] text-[#181d27] text-[length:var(--text-lg-regular-font-size)] tracking-[var(--text-lg-regular-letter-spacing)] leading-[var(--text-lg-regular-line-height)] [font-style:var(--text-lg-regular-font-style)]">
                      {benefit.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col w-full lg:w-[500px] self-stretch items-center justify-center gap-5 sm:gap-[29px] p-5 sm:p-[30px] bg-cover bg-center" 
              style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(${officeBuildingImg})` }}
              variants={fadeInUp}
            >
              {featureCards.map((card, index) => (
                <Card
                  key={index}
                  className={`flex flex-col items-start justify-center gap-3 sm:gap-[17px] p-5 sm:p-[30px] flex-1 w-full ${card.bgClass} rounded-lg shadow-[0px_4px_4px_#00000040] border-0`}
                  data-testid={`feature-card-${index}`}
                >
                  <CardContent className="flex flex-col items-start gap-2 w-full p-0">
                    <div className="inline-flex flex-col items-start gap-3.5">
                      <h3 className="font-display-xs-semibold font-[number:var(--display-xs-semibold-font-weight)] text-[#181d27] text-[length:var(--display-xs-semibold-font-size)] tracking-[var(--display-xs-semibold-letter-spacing)] leading-[var(--display-xs-semibold-line-height)] [font-style:var(--display-xs-semibold-font-style)]">
                        {card.title}
                      </h3>
                      <img
                        className="w-[53px] h-[3px]"
                        alt="Vector"
                        src="/figmaAssets/vector-3.svg"
                        width="53"
                        height="3"
                        loading="eager"
                      />
                    </div>
                    <p className="font-text-lg-regular font-[number:var(--text-lg-regular-font-weight)] text-[#181d27] text-[length:var(--text-lg-regular-font-size)] tracking-[var(--text-lg-regular-letter-spacing)] leading-[var(--text-lg-regular-line-height)] [font-style:var(--text-lg-regular-font-style)]">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </motion.div>
        </section>

        <motion.section 
          className="flex flex-col items-center justify-center gap-4 sm:gap-6 px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 w-full bg-cover bg-center" 
          style={{ backgroundImage: `url(${bgCtaImg})` }}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <h2 className="[font-family:'Inter',Helvetica] font-semibold text-[#181d27] text-xl sm:text-2xl md:text-3xl tracking-[0] leading-tight text-center">
            Over 650 Locations Across the USA
          </h2>

          <p className="font-text-xl-regular font-[number:var(--text-xl-regular-font-weight)] text-[#181d27] text-[length:var(--text-xl-regular-font-size)] tracking-[var(--text-xl-regular-letter-spacing)] leading-[var(--text-xl-regular-line-height)] [font-style:var(--text-xl-regular-font-style)] text-center">
            All-Inclusive Virtual Office Services for Only $99/mo.
          </p>

          <Button className="h-auto gap-1.5 px-[18px] py-3 bg-[#0ba4eb] rounded-lg border-[none] shadow-shadows-shadow-xs-skeuomorphic before:content-[''] before:absolute before:inset-0 before:p-0.5 before:rounded-lg before:[background:linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none font-text-md-semibold font-[number:var(--text-md-semibold-font-weight)] text-[#ffffff] text-[length:var(--text-md-semibold-font-size)] tracking-[var(--text-md-semibold-letter-spacing)] leading-[var(--text-md-semibold-line-height)] [font-style:var(--text-md-semibold-font-style)]" data-testid="button-sign-up">
            Sign Up Now
          </Button>
        </motion.section>

        <section className="flex flex-col w-full gap-8 sm:gap-12 md:gap-16 px-0 py-10 sm:py-12 md:py-[60px] bg-basewhite items-center">
          <motion.div 
            className="flex flex-col lg:flex-row items-start gap-8 sm:gap-12 md:gap-16 max-w-screen-xl w-full px-4 sm:px-6 md:px-8 py-0"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div 
              className="flex flex-col w-full lg:max-w-screen-md items-start gap-4 sm:gap-5 flex-1"
              variants={fadeInUp}
            >
              <div className="flex flex-col items-start gap-3 w-full">
                <h2 className="font-[number:var(--display-sm-display-md-semibold-font-weight)] text-[#181d27] text-[length:var(--display-sm-display-md-semibold-font-size)] tracking-[var(--display-sm-display-md-semibold-letter-spacing)] leading-[var(--display-sm-display-md-semibold-line-height)] font-display-sm-display-md-semibold [font-style:var(--display-sm-display-md-semibold-font-style)] text-2xl sm:text-3xl md:text-4xl">
                  Curious About Renting a Virtual Office?
                </h2>
              </div>

              <p
                className="font-text-xl-regular font-[number:var(--text-xl-regular-font-weight)] text-[#181d27] text-[length:var(--text-xl-regular-font-size)] tracking-[var(--text-xl-regular-letter-spacing)] leading-[var(--text-xl-regular-line-height)] [font-style:var(--text-xl-regular-font-style)]"
              >
                Explore how a virtual office can elevate your business presence
                while offering unparalleled flexibility. Tailored solutions
                await you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center w-full">
                <Button className="h-auto inline-flex items-center justify-center gap-1.5 px-[18px] py-3 w-full sm:w-auto bg-[#0ba4eb] rounded-lg border-[none] shadow-shadows-shadow-xs-skeuomorphic before:content-[''] before:absolute before:inset-0 before:p-0.5 before:rounded-lg before:[background:linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none font-text-md-semibold font-[number:var(--text-md-semibold-font-weight)] text-[#ffffff] text-[length:var(--text-md-semibold-font-size)] tracking-[var(--text-md-semibold-letter-spacing)] leading-[var(--text-md-semibold-line-height)] [font-style:var(--text-md-semibold-font-style)]" data-testid="button-talk-expert">
                  Talk to an expert
                </Button>

                <div className="gap-2 inline-flex items-center justify-center">
                  <span className="font-text-xl-semibold font-[number:var(--text-xl-semibold-font-weight)] text-gray-600 text-[length:var(--text-xl-semibold-font-size)] tracking-[var(--text-xl-semibold-letter-spacing)] leading-[var(--text-xl-semibold-line-height)] [font-style:var(--text-xl-semibold-font-style)]">
                    1 (888) 898 - 9868
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col w-full items-start gap-6 sm:gap-8 flex-1"
              variants={fadeInUp}
            >
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full items-center"
                  data-testid={`faq-${index}`}
                >
                  <div className="flex items-start gap-4 sm:gap-6 w-full">
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
                        width="24"
                        height="24"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        <section className="w-full gap-8 sm:gap-12 md:gap-16 px-0 py-8 sm:py-10 bg-basewhite flex flex-col items-center">
          <motion.div 
            className="flex flex-col items-center gap-6 sm:gap-8 max-w-screen-xl w-full px-4 sm:px-6 md:px-8 py-0"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="flex flex-col items-center gap-6 sm:gap-8 w-full">
              <div className="max-w-screen-md items-center flex flex-col gap-4 sm:gap-5 w-full">
                <div className="flex flex-col items-center gap-3 w-full">
                  <h2 className="font-[number:var(--display-md-semibold-font-weight)] text-gray-900 text-[length:var(--display-md-semibold-font-size)] text-center tracking-[var(--display-md-semibold-letter-spacing)] leading-[var(--display-md-semibold-line-height)] font-display-md-semibold [font-style:var(--display-md-semibold-font-style)] text-2xl sm:text-3xl md:text-4xl">
                    Most Popular Locations
                  </h2>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="flex flex-col items-start gap-6 max-w-screen-xl w-full px-4 sm:px-6 md:px-8 py-0"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full">
              {popularLocations.map((location, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-start gap-4 sm:gap-6"
                  data-testid={`location-${index}`}
                  variants={fadeInUp}
                >
                  <div 
                    className="w-full aspect-square sm:h-[200px] sm:aspect-auto rounded-lg bg-cover bg-center relative overflow-hidden"
                    style={{ backgroundImage: `url(${location.image})` }}
                  >
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-center sm:justify-start p-3 sm:p-4" style={{ background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0) 100%)' }}>
                      <h3 className="sm:hidden [font-family:'Inter',Helvetica] font-semibold text-white text-base tracking-[0] leading-normal text-center">
                        {location.name}
                      </h3>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-start w-full">
                    <h3 className="[font-family:'Inter',Helvetica] font-semibold text-gray-900 text-lg sm:text-xl tracking-[0] leading-normal">
                      {location.name}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="max-w-screen-xl justify-center gap-2 px-0 py-0 w-full flex flex-col items-center">
              <p className="[font-family:'Inter',Helvetica] font-normal text-gray-600 text-base sm:text-lg md:text-xl tracking-[0] leading-relaxed text-center">
                <span className="font-text-xl-regular [font-style:var(--text-xl-regular-font-style)] tracking-[var(--text-xl-regular-letter-spacing)] text-[length:var(--text-xl-regular-font-size)] font-semibold">
                  View All Premium Locations
                </span>
              </p>
            </div>
          </motion.div>
        </section>

        <section className="w-full items-center gap-6 sm:gap-8 px-0 py-8 sm:py-10 bg-[#ffffff] flex flex-col">
          <motion.div 
            className="flex flex-col items-start gap-6 sm:gap-8 max-w-screen-xl w-full px-4 sm:px-6 md:px-8 py-0"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="flex flex-col items-start gap-6 sm:gap-8 w-full">
              <div className="max-w-[800px] items-start flex flex-col gap-4 sm:gap-5 w-full">
                <div className="flex flex-col items-start gap-3 w-full">
                  <Badge
                    variant="secondary"
                    className="text-[#016aa2] font-text-sm-text-md-semibold font-[number:var(--text-sm-text-md-semibold-font-weight)] text-[length:var(--text-sm-text-md-semibold-font-size)] tracking-[var(--text-sm-text-md-semibold-letter-spacing)] leading-[var(--text-sm-text-md-semibold-line-height)] [font-style:var(--text-sm-text-md-semibold-font-style)] bg-transparent border-0 p-0 h-auto"
                  >
                    Customer Reviews
                  </Badge>

                  <h2 className="font-[number:var(--display-md-semibold-font-weight)] text-gray-900 text-[length:var(--display-md-semibold-font-size)] tracking-[var(--display-md-semibold-letter-spacing)] leading-[var(--display-md-semibold-line-height)] font-display-md-semibold [font-style:var(--display-md-semibold-font-style)] text-2xl sm:text-3xl md:text-4xl">
                    Opus Virtual Office Reviews
                  </h2>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="flex max-w-screen-xl items-center gap-[60px] px-4 sm:px-6 md:px-8 py-0 w-full"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
              {reviews.map((review, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card
                    className="items-start justify-center gap-3 p-3 bg-gray-50 rounded-lg border-[1.5px] border-solid border-[#eaecf0]"
                    data-testid={`review-${index}`}
                  >
                    <CardContent className="flex flex-col gap-3 p-0 w-full">
                      <div className="flex items-start gap-1 w-full">
                        <img
                          className="w-[52px] h-[52px]"
                          alt="Google"
                          src="/figmaAssets/google.svg"
                          width="52"
                          height="52"
                          loading="lazy"
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
                                  width="18"
                                  height="18"
                                  loading="lazy"
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
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="flex flex-col max-w-screen-xl items-start justify-center gap-2 px-4 sm:px-6 md:px-8 py-0 w-full"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Button
              variant="ghost"
              className="h-auto gap-1 pl-0 pr-3 py-0 rounded-lg overflow-hidden"
              data-testid="button-more-reviews"
            >
              <span className="font-text-sm-semibold font-[number:var(--text-sm-semibold-font-weight)] text-gray-600 text-[length:var(--text-sm-semibold-font-size)] tracking-[var(--text-sm-semibold-letter-spacing)] leading-[var(--text-sm-semibold-line-height)] whitespace-nowrap [font-style:var(--text-sm-semibold-font-style)]">
                Read More Reviews
              </span>
              <img
                className="w-5 h-5"
                alt="Arrow narrow right"
                src="/figmaAssets/arrow-narrow-right.svg"
                width="20"
                height="20"
                loading="lazy"
              />
            </Button>
          </motion.div>
        </section>

        <section className="flex flex-col w-full items-center justify-center gap-8 sm:gap-12 md:gap-16 px-0 py-10 sm:py-12 md:py-[60px] bg-basewhite">
          <motion.div 
            className="items-center justify-center flex max-w-screen-xl w-full px-4 sm:px-6 md:px-8 py-0"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6 sm:gap-8 p-6 sm:p-8 md:px-10 lg:px-16 md:py-5 flex-1 rounded-2xl overflow-hidden shadow-shadows-shadow-md bg-cover bg-center relative" style={{ backgroundImage: `linear-gradient(135deg, rgba(255, 255, 255, 1) 10%, rgba(255, 255, 255, 0) 100%), url(${bgCtaPromoImg})` }}>
              <div className="flex flex-col items-start justify-center gap-4 sm:gap-5 flex-1 w-full lg:w-auto">
                <div className="flex flex-col gap-4 sm:gap-5 w-full">
                  <Badge
                    variant="secondary"
                    className="text-[#0085c9] font-text-sm-text-md-semibold font-[number:var(--text-sm-text-md-semibold-font-weight)] text-[length:var(--text-sm-text-md-semibold-font-size)] tracking-[var(--text-sm-text-md-semibold-letter-spacing)] leading-[var(--text-sm-text-md-semibold-line-height)] [font-style:var(--text-sm-text-md-semibold-font-style)] bg-transparent border-0 p-0 h-auto w-fit"
                  >
                    Get your Free Ebook
                  </Badge>

                  <h2 className="font-semibold text-[#3d455a] text-2xl sm:text-3xl md:text-4xl tracking-[-0.72px] leading-tight [font-family:'Inter',Helvetica]">
                    6-Steps for Starting a Business
                  </h2>

                  <p className="[font-family:'Inter',Helvetica] font-normal text-gray-900 text-base sm:text-lg md:text-xl tracking-[0] leading-relaxed">
                    Your Complete Guide to Building a Successful Business
                    Foundation with Confidence
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row max-w-[600px] w-full items-start gap-3 sm:gap-4">
                  <div className="flex flex-col items-start gap-1.5 flex-1 w-full">
                    <div className="flex flex-col items-start gap-1.5 w-full">
                      <div className="flex items-center gap-2 px-3.5 py-3 w-full bg-[#ffffff] rounded-lg border border-solid shadow-[0px_1px_2px_#0a0c120d]">
                        <MailIcon className="w-5 h-5 text-gray-500" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="flex-1 border-0 shadow-none p-0 h-auto [font-family:'Inter',Helvetica] font-normal text-[#717680] text-base tracking-[0] leading-normal focus-visible:ring-0 focus-visible:ring-offset-0"
                          data-testid="input-email-ebook"
                        />
                      </div>
                    </div>

                    <p className="font-text-sm-regular font-[number:var(--text-sm-regular-font-weight)] text-gray-600 text-[length:var(--text-sm-regular-font-size)] tracking-[var(--text-sm-regular-letter-spacing)] leading-[var(--text-sm-regular-line-height)] [font-style:var(--text-sm-regular-font-style)]">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </div>

                  <Button className="h-auto inline-flex items-center justify-center gap-1.5 px-[18px] py-3 w-full sm:w-auto bg-[#0ba4eb] rounded-lg border-[none] shadow-shadows-shadow-xs-skeuomorphic before:content-[''] before:absolute before:inset-0 before:p-0.5 before:rounded-lg before:[background:linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none font-text-md-semibold font-[number:var(--text-md-semibold-font-weight)] text-[#ffffff] text-[length:var(--text-md-semibold-font-size)] tracking-[var(--text-md-semibold-letter-spacing)] leading-[var(--text-md-semibold-line-height)] [font-style:var(--text-md-semibold-font-style)]" data-testid="button-get-ebook">
                    Get your Ebook
                  </Button>
                </div>
              </div>

              <div className="hidden lg:flex w-full lg:w-[304px] h-[250px] sm:h-[300px] lg:h-[324px] relative flex-shrink-0 overflow-hidden items-end">
                <img
                  className="w-full h-full object-contain object-bottom lg:object-cover"
                  alt="Asian man portrait"
                  src={man_holding_tablet}
                  width="304"
                  height="324"
                  loading="lazy" />
              </div>
            </div>
          </motion.div>
        </section>
        
        <Footer />
      </div>

      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 bg-black border-0">
          <video
            className="w-full h-auto"
            controls
            autoPlay
            preload="metadata"
            poster={playerCover}
          >
            <source src={promoVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </DialogContent>
      </Dialog>
    </div>
  );
};
