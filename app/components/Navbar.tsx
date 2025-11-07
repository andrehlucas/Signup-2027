'use client';
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from "@/app/components/ui/sheet";
import { Menu } from "lucide-react";

export function Navbar() {
  return (
    <nav 
      className="fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-200 shadow-sm z-50" 
      data-testid="navbar"
    >
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <div className="max-w-[1280px] mx-auto px-8 py-3">
          <div className="flex items-center gap-4 h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2" data-testid="link-home">
              <img
                src="/opus-logo-icon.svg"
                alt="Opus VO Logo"
                className="h-[70px] w-auto"
                loading="eager"
                data-testid="img-logo-icon"
              />
              <img
                src="/opus-logo-text.svg"
                alt="Opus Virtual Offices"
                className="h-[60px] w-auto"
                loading="eager"
                data-testid="img-logo-text"
              />
            </Link>

            {/* Navigation Links */}
            <div className="flex-1 flex items-center justify-center gap-0.5">
              <Link href="/" data-testid="link-nav-home">
                <div className="px-1.5 py-1 rounded-lg">
                  <span className="px-0.5 font-semibold text-base text-[#414651] hover:text-[#181d27] transition-colors">
                    Home
                  </span>
                </div>
              </Link>
              <Link href="/services" data-testid="link-nav-services">
                <div className="px-1.5 py-1 rounded-lg">
                  <span className="px-0.5 font-semibold text-base text-[#414651] hover:text-[#181d27] transition-colors">
                    Services
                  </span>
                </div>
              </Link>
              <Link href="/locations" data-testid="link-nav-locations">
                <div className="px-1.5 py-1 rounded-lg">
                  <span className="px-0.5 font-semibold text-base text-[#414651] hover:text-[#181d27] transition-colors">
                    Locations
                  </span>
                </div>
              </Link>
              <Link href="/faq" data-testid="link-nav-faq">
                <div className="px-1.5 py-1 rounded-lg">
                  <span className="px-0.5 font-semibold text-base text-[#414651] hover:text-[#181d27] transition-colors">
                    FAQ
                  </span>
                </div>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Phone Number */}
              <div className="px-4 py-2.5 rounded-lg" data-testid="text-phone">
                <span className="font-semibold text-base text-[#535862] hover:text-[#181d27] transition-colors">
                  1 (888) 898-9868
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  color="tertiary"
                  size="lg"
                  data-testid="button-login"
                >
                  Log in
                </Button>
                <Button
                  size="xl"
                  color="primary"
                  data-testid="button-signup"
                >
                  Click to sign up
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-4 h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-[3px]" data-testid="link-home-mobile">
            <img
              src="/opus-logo-icon.svg"
              alt="Opus VO Logo"
              className="h-[27px] w-auto"
              loading="eager"
              data-testid="img-logo-icon-mobile"
            />
            <img
              src="/opus-logo-text.svg"
              alt="Opus Virtual Offices"
              className="h-[23px] w-auto"
              loading="eager"
              data-testid="img-logo-text-mobile"
            />
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button
              size="md"
              color="primary"
              className="px-3 py-2"
              data-testid="button-signup-mobile"
            >
              Tap to sign up
            </Button>

            {/* Hamburger Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  color="tertiary"
                  size="sm"
                  className="p-2"
                  data-testid="button-menu"
                >
                  <Menu className="h-6 w-6 text-[#344054]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Navigate to different pages and access account options
                </SheetDescription>
                <div className="flex flex-col gap-6 mt-4">
                  {/* Navigation Links */}
                  <div className="flex flex-col gap-2">
                    <Link href="/" data-testid="link-nav-home-mobile">
                      <div className="px-4 py-3 rounded-lg">
                        <span className="font-semibold text-lg text-[#414651] hover:text-[#181d27] transition-colors">
                          Home
                        </span>
                      </div>
                    </Link>
                    <Link href="/services" data-testid="link-nav-services-mobile">
                      <div className="px-4 py-3 rounded-lg">
                        <span className="font-semibold text-lg text-[#414651] hover:text-[#181d27] transition-colors">
                          Services
                        </span>
                      </div>
                    </Link>
                    <Link href="/locations" data-testid="link-nav-locations-mobile">
                      <div className="px-4 py-3 rounded-lg">
                        <span className="font-semibold text-lg text-[#414651] hover:text-[#181d27] transition-colors">
                          Locations
                        </span>
                      </div>
                    </Link>
                    <Link href="/faq" data-testid="link-nav-faq-mobile">
                      <div className="px-4 py-3 rounded-lg">
                        <span className="font-semibold text-lg text-[#414651] hover:text-[#181d27] transition-colors">
                          FAQ
                        </span>
                      </div>
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200"></div>

                  {/* Phone Number */}
                  <div className="px-4" data-testid="text-phone-mobile">
                    <a
                      href="tel:+18888989868"
                      className="font-semibold text-base text-[#535862] hover:text-[#181d27] transition-colors"
                    >
                      1 (888) 898-9868
                    </a>
                  </div>

                  {/* Login Button */}
                  <div className="px-4">
                    <Button
                      color="secondary"
                      size="md"
                      className="w-full px-4 py-3"
                      data-testid="button-login-mobile"
                    >
                      Log in
                    </Button>
                  </div>

                  {/* Signup Button */}
                  <div className="px-4">
                    <Button
                      size="md"
                      color="primary"
                      className="w-full px-4 py-3"
                      data-testid="button-signup-mobile-menu"
                    >
                      Tap to sign up
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
