import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MailIcon } from "lucide-react";

export function Footer() {
  const popularLocations = [
    "Atlanta",
    "Chicago",
    "Dallas",
    "Los Angeles",
    "Houston",
    "Miami",
    "New York",
    "Tampa",
  ];

  const aboutLinks = [
    "Contact Us",
    "About Us",
    "In the News",
    "Is It For Me?",
    "Support",
  ];

  const resourceLinks = [
    "FAQ",
    "Answering Services",
    "Blog",
    "Is It For Me?",
    "Afiliate Program",
    "Partners",
    "Privacy Policy",
    "Terms of Use",
  ];

  return (
    <footer className="bg-[#182230] w-full" data-testid="footer">
      {/* Main Footer Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Logo and Supporting Content - Mobile & Desktop */}
            <div className="flex flex-col gap-6 lg:max-w-[320px] lg:min-w-[320px]">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <img
                  src="/opus-logo-icon.svg"
                  alt="Opus VO Logo"
                  className="h-[70px] w-auto"
                  data-testid="img-footer-logo-icon"
                />
                <img
                  src="/opus-logo-text.svg"
                  alt="Opus Virtual Offices"
                  className="h-[60px] w-auto"
                  data-testid="img-footer-logo-text"
                />
              </div>

              {/* BBB Badge */}
              <div className="flex items-start gap-3.5">
                <div className="relative h-[45px] w-[120px]">
                  <img
                    src="/BBB.svg"
                    alt="BBB Accredited"
                    className="w-full h-full object-contain"
                    data-testid="img-bbb-badge"
                  />
                </div>
                <div className="bg-[#015a75] rounded-[4.5px] h-[45px] w-[50px] flex items-center justify-center">
                  <span className="text-white text-[30px] font-bold font-['Impact']" data-testid="text-bbb-rating">
                    A+
                  </span>
                </div>
              </div>

              {/* App Store Badges */}
              <div className="flex gap-3">
                <a href="#" className="block" data-testid="link-app-store">
                  <img
                    src="/App-store-download.svg"
                    alt="Download on the App Store"
                    className="h-[44px] w-[151px]"
                  />
                </a>
                <a href="#" className="block" data-testid="link-google-play">
                  <img
                    src="/google-play-download.svg"
                    alt="Get it on Google Play"
                    className="h-[45px] w-[152px]"
                  />
                </a>
              </div>

              {/* Credit Cards Accepted */}
              <img
                src="/Credit-cards-accepted.svg"
                alt="Credit cards accepted"
                className="h-auto w-auto"
                data-testid="img-credit-cards"
              />
            </div>

            {/* Links Section - Desktop Only */}
            <div className="hidden lg:flex flex-1 gap-8">
              {/* Most Popular Locations */}
              <div className="flex flex-col gap-4 flex-1">
                <h3 className="text-[#d0d5dd] text-base font-medium" data-testid="heading-locations">
                  Most Popular Locations
                </h3>
                <div className="flex flex-col gap-3">
                  {popularLocations.map((location, index) => (
                    <a
                      key={index}
                      href="#"
                      className="text-[#eaecf0] text-base font-semibold hover:underline"
                      data-testid={`link-location-${index}`}
                    >
                      {location}
                    </a>
                  ))}
                  <a
                    href="#"
                    className="text-[#eaecf0] text-base font-semibold underline"
                    data-testid="link-all-locations"
                  >
                    See Most Popular Locations
                  </a>
                </div>
              </div>

              {/* About */}
              <div className="flex flex-col gap-4 flex-1">
                <h3 className="text-[#d0d5dd] text-base font-medium" data-testid="heading-about">
                  About
                </h3>
                <div className="flex flex-col gap-3">
                  {aboutLinks.map((link, index) => (
                    <a
                      key={index}
                      href="#"
                      className="text-[#eaecf0] text-base font-semibold hover:underline"
                      data-testid={`link-about-${index}`}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="flex flex-col gap-4 flex-1">
                <h3 className="text-[#d0d5dd] text-base font-medium" data-testid="heading-resources">
                  Resources
                </h3>
                <div className="flex flex-col gap-3">
                  {resourceLinks.map((link, index) => (
                    <a
                      key={index}
                      href="#"
                      className="text-[#eaecf0] text-base font-semibold hover:underline"
                      data-testid={`link-resource-${index}`}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Links Section */}
          <div className="lg:hidden mt-12 space-y-8">
            {/* Most Popular Locations - Mobile */}
            <div className="space-y-4">
              <h3 className="text-[#d0d5dd] text-xl font-bold" data-testid="heading-locations-mobile">
                Most Popular Locations
              </h3>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                <div className="flex flex-col gap-3 flex-1 min-w-[150px]">
                  {popularLocations.slice(0, 4).map((location, index) => (
                    <a
                      key={index}
                      href="#"
                      className="text-[#eaecf0] text-base font-semibold hover:underline"
                      data-testid={`link-location-mobile-${index}`}
                    >
                      {location}
                    </a>
                  ))}
                </div>
                <div className="flex flex-col gap-3 flex-1 min-w-[150px]">
                  {popularLocations.slice(4).map((location, index) => (
                    <a
                      key={index + 4}
                      href="#"
                      className="text-[#eaecf0] text-base font-semibold hover:underline"
                      data-testid={`link-location-mobile-${index + 4}`}
                    >
                      {location}
                    </a>
                  ))}
                </div>
              </div>
              <a
                href="#"
                className="text-[#eaecf0] text-base font-semibold underline w-full block"
                data-testid="link-all-locations-mobile"
              >
                See Most Popular Locations
              </a>
            </div>

            {/* Resources - Mobile */}
            <div className="space-y-4">
              <h3 className="text-[#d0d5dd] text-xl font-bold" data-testid="heading-resources-mobile">
                Resources
              </h3>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                <div className="flex flex-col gap-3 flex-1 min-w-[150px]">
                  {resourceLinks.slice(0, 4).map((link, index) => (
                    <a
                      key={index}
                      href="#"
                      className="text-[#eaecf0] text-base font-semibold hover:underline"
                      data-testid={`link-resource-mobile-${index}`}
                    >
                      {link}
                    </a>
                  ))}
                </div>
                <div className="flex flex-col gap-3 flex-1 min-w-[150px]">
                  {resourceLinks.slice(4).map((link, index) => (
                    <a
                      key={index + 4}
                      href="#"
                      className="text-[#eaecf0] text-base font-semibold hover:underline"
                      data-testid={`link-resource-mobile-${index + 4}`}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* About - Mobile */}
            <div className="space-y-4">
              <h3 className="text-[#d0d5dd] text-xl font-bold" data-testid="heading-about-mobile">
                About
              </h3>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                <div className="flex flex-col gap-3 flex-1 min-w-[150px]">
                  {aboutLinks.slice(0, 3).map((link, index) => (
                    <a
                      key={index}
                      href="#"
                      className="text-[#eaecf0] text-base font-semibold hover:underline"
                      data-testid={`link-about-mobile-${index}`}
                    >
                      {link}
                    </a>
                  ))}
                </div>
                <div className="flex flex-col gap-3 flex-1 min-w-[150px]">
                  {aboutLinks.slice(3).map((link, index) => (
                    <a
                      key={index + 3}
                      href="#"
                      className="text-[#eaecf0] text-base font-semibold hover:underline"
                      data-testid={`link-about-mobile-${index + 3}`}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-[#101828] w-full">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 lg:justify-between lg:items-center">
            {/* Newsletter Text */}
            <div className="flex flex-col gap-2 lg:max-w-[768px]">
              <h3 className="text-white text-lg lg:text-xl font-semibold" data-testid="heading-newsletter">
                Join our newsletter
              </h3>
              <p className="text-[#eaecf0] text-base" data-testid="text-newsletter-description">
                Stay updated with the latest news, tips, and exclusive offers directly in your inbox.
              </p>
            </div>

            {/* Newsletter Form */}
            <div className="flex flex-col lg:flex-row gap-4 lg:w-[400px]">
              <div className="flex-1">
                <div className="h-[50px] bg-white border border-[#d5d7da] rounded-lg px-3.5 py-2.5 flex items-center gap-2">
                  <MailIcon className="w-5 h-5 text-[#a4a7ae]" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 border-0 shadow-none p-0 h-auto text-[#717680] text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                    data-testid="input-newsletter-email"
                  />
                </div>
              </div>
              <Button
                className="h-[50px] gap-1.5 px-[18px] py-3 w-full lg:w-auto bg-blue-light400 rounded-lg border border-solid border-[#36bff9] shadow-shadows-shadow-xs font-text-sm-text-md-semibold font-[number:var(--text-sm-text-md-semibold-font-weight)] text-basewhite text-[length:var(--text-sm-text-md-semibold-font-size)] tracking-[var(--text-sm-text-md-semibold-letter-spacing)] leading-[var(--text-sm-text-md-semibold-line-height)] [font-style:var(--text-sm-text-md-semibold-font-style)]"
                data-testid="button-subscribe"
              >
                Subscribe
              </Button>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 pt-8 border-t border-[#182230] flex flex-col lg:flex-row gap-6 lg:justify-between lg:items-center">
            <p className="text-[#d0d5dd] text-base order-2 lg:order-1" data-testid="text-copyright">
              © 2025 Opus Virtual Offices. All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex gap-6 order-1 lg:order-2" data-testid="social-icons">
              <a href="#" className="text-[#98a2b3] hover:text-white transition-colors" data-testid="link-twitter">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-[#98a2b3] hover:text-white transition-colors" data-testid="link-linkedin">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="#" className="text-[#98a2b3] hover:text-white transition-colors" data-testid="link-facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-[#98a2b3] hover:text-white transition-colors" data-testid="link-youtube">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
