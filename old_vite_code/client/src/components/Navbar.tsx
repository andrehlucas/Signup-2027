import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-200 shadow-sm transition-transform duration-300 z-50 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`} 
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
                <div className="px-1.5 py-1 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="px-0.5 font-semibold text-base text-[#414651]">
                    Home
                  </span>
                </div>
              </Link>
              <Link href="/services" data-testid="link-nav-services">
                <div className="px-1.5 py-1 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="px-0.5 font-semibold text-base text-[#414651]">
                    Services
                  </span>
                </div>
              </Link>
              <Link href="/locations" data-testid="link-nav-locations">
                <div className="px-1.5 py-1 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="px-0.5 font-semibold text-base text-[#414651]">
                    Locations
                  </span>
                </div>
              </Link>
              <Link href="/faq" data-testid="link-nav-faq">
                <div className="px-1.5 py-1 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="px-0.5 font-semibold text-base text-[#414651]">
                    FAQ
                  </span>
                </div>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Phone Number */}
              <div className="px-4 py-2.5 rounded-lg" data-testid="text-phone">
                <span className="font-semibold text-base text-[#535862]">
                  1 (888) 898-9868
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="px-4 py-2.5 rounded-lg font-semibold text-base text-[#535862] hover:bg-gray-50"
                  data-testid="button-login"
                >
                  Log in
                </Button>
                <Button
                  className="h-auto gap-1.5 px-[18px] py-3 bg-blue-light400 rounded-lg border border-solid border-[#36bff9] shadow-shadows-shadow-xs font-text-sm-text-md-semibold font-[number:var(--text-sm-text-md-semibold-font-weight)] text-basewhite text-[length:var(--text-sm-text-md-semibold-font-size)] tracking-[var(--text-sm-text-md-semibold-letter-spacing)] leading-[var(--text-sm-text-md-semibold-line-height)] [font-style:var(--text-sm-text-md-semibold-font-style)]"
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
              className="h-auto gap-1.5 px-3 py-2 bg-blue-light400 rounded-lg border border-solid border-[#36bff9] shadow-shadows-shadow-xs font-text-sm-text-md-semibold font-[number:var(--text-sm-text-md-semibold-font-weight)] text-basewhite text-[length:var(--text-sm-text-md-semibold-font-size)] tracking-[var(--text-sm-text-md-semibold-letter-spacing)] leading-[var(--text-sm-text-md-semibold-line-height)] [font-style:var(--text-sm-text-md-semibold-font-style)]"
              data-testid="button-signup-mobile"
            >
              Tap to sign up
            </Button>

            {/* Hamburger Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 rounded-lg"
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
                      <div className="px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="font-semibold text-lg text-[#414651]">
                          Home
                        </span>
                      </div>
                    </Link>
                    <Link href="/services" data-testid="link-nav-services-mobile">
                      <div className="px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="font-semibold text-lg text-[#414651]">
                          Services
                        </span>
                      </div>
                    </Link>
                    <Link href="/locations" data-testid="link-nav-locations-mobile">
                      <div className="px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="font-semibold text-lg text-[#414651]">
                          Locations
                        </span>
                      </div>
                    </Link>
                    <Link href="/faq" data-testid="link-nav-faq-mobile">
                      <div className="px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="font-semibold text-lg text-[#414651]">
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
                      className="font-semibold text-base text-[#535862] hover:text-[#0ba5ec] transition-colors"
                    >
                      1 (888) 898-9868
                    </a>
                  </div>

                  {/* Login Button */}
                  <div className="px-4">
                    <Button
                      variant="outline"
                      className="w-full px-4 py-3 rounded-lg font-semibold text-base text-[#535862] hover:bg-gray-50"
                      data-testid="button-login-mobile"
                    >
                      Log in
                    </Button>
                  </div>

                  {/* Signup Button */}
                  <div className="px-4">
                    <Button
                      className="w-full h-auto gap-1.5 px-4 py-3 bg-blue-light400 rounded-lg border border-solid border-[#36bff9] shadow-shadows-shadow-xs font-text-sm-text-md-semibold font-[number:var(--text-sm-text-md-semibold-font-weight)] text-basewhite text-[length:var(--text-sm-text-md-semibold-font-size)] tracking-[var(--text-sm-text-md-semibold-letter-spacing)] leading-[var(--text-sm-text-md-semibold-line-height)] [font-style:var(--text-sm-text-md-semibold-font-style)]"
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
