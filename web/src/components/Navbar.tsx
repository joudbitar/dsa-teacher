import { Link } from "react-router-dom";
import {
  User,
  LogOut,
  ChevronDown,
  ArrowRight,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../auth/useAuth";
import { useTheme } from "../theme/ThemeContext";
import { useState, useRef, useEffect } from "react";

export function Navbar({ className }: { className?: string }) {
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleDarkMode, backgroundColor, textColor } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 border-b backdrop-blur-sm ${
        className || ""
      }`}
      style={{
        backgroundColor: backgroundColor,
        borderColor: "#D4CFC0",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="relative flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-4 group">
            <img
              src="/turtle_logo.png"
              alt="Shelly logo"
              className="block h-12 w-auto py-1 transition-all group-hover:scale-105 object-contain"
            />
            <span
              className="text-3xl font-bold tracking-tight leading-none"
              style={{
                color: textColor,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              Shelly
            </span>
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden lg:flex lg:absolute lg:left-1/2 lg:-translate-x-1/2 items-center space-x-3">
            <Link
              to="/"
              className="text-base font-semibold px-4 py-2 rounded-lg transition-all hover:bg-[rgba(127,85,57,0.1)]"
              style={{
                color: textColor,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              Home
            </Link>
            <Link
              to="/challenges"
              className="text-base font-semibold px-4 py-2 rounded-lg transition-all hover:bg-[rgba(127,85,57,0.1)]"
              style={{
                color: textColor,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              Challenges
            </Link>
            <Link
              to="/docs"
              className="text-base font-semibold px-4 py-2 rounded-lg transition-all hover:bg-[rgba(127,85,57,0.1)]"
              style={{
                color: textColor,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              Docs
            </Link>
          </div>

          {/* Right: Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:bg-[rgba(127,85,57,0.05)]"
                  style={{
                    color: textColor,
                    borderColor: "#D4CFC0",
                  }}
                >
                  <User className="h-4 w-4" />
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {user.email}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-lg border shadow-lg z-50"
                    style={{
                      backgroundColor: backgroundColor,
                      borderColor: "#D4CFC0",
                    }}
                  >
                    <button
                      onClick={toggleDarkMode}
                      className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold transition-all hover:bg-[rgba(127,85,57,0.05)] rounded-t-lg border-b"
                      style={{
                        color: textColor,
                        borderColor: "#D4CFC0",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {isDarkMode ? (
                          <Sun className="h-4 w-4" />
                        ) : (
                          <Moon className="h-4 w-4" />
                        )}
                        <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold transition-all hover:bg-red-50 dark:hover:bg-red-950/20 rounded-b-lg"
                      style={{
                        color: "#dc2626",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg border-2 bg-transparent px-5 py-2 text-sm font-semibold transition-all hover:bg-[rgba(127,85,57,0.05)]"
                  style={{
                    borderColor: "#7F5539",
                    color: "#7F5539",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  Log in
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="inline-flex items-center justify-center rounded-lg px-5 py-2 text-sm font-bold transition-all hover:opacity-90 shadow-sm"
                  style={{
                    backgroundColor: "#7F5539",
                    color: "#FFFEF9",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen((prev) => !prev);
              setIsDropdownOpen(false);
            }}
            className="lg:hidden inline-flex items-center justify-center rounded-lg border px-3 py-2 transition-all hover:bg-[rgba(127,85,57,0.05)]"
            style={{
              borderColor: "#D4CFC0",
              color: textColor,
            }}
            aria-label="Toggle navigation"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden mt-3 rounded-xl border px-4 py-4 flex flex-col gap-4"
            style={{
              backgroundColor,
              borderColor: "#D4CFC0",
              color: textColor,
            }}
          >
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                className="text-base font-semibold px-3 py-2 rounded-lg transition-all hover:bg-[rgba(127,85,57,0.08)]"
                style={{ color: textColor }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/challenges"
                className="text-base font-semibold px-3 py-2 rounded-lg transition-all hover:bg-[rgba(127,85,57,0.08)]"
                style={{ color: textColor }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Challenges
              </Link>
              <Link
                to="/docs"
                className="text-base font-semibold px-3 py-2 rounded-lg transition-all hover:bg-[rgba(127,85,57,0.08)]"
                style={{ color: textColor }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Docs
              </Link>
            </div>

            <div className="border-t pt-4" style={{ borderColor: "#D4CFC0" }}>
              {user ? (
                <div className="flex flex-col gap-3">
                  <div
                    className="text-sm font-medium"
                    style={{ color: textColor }}
                  >
                    {user.email}
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:bg-[rgba(127,85,57,0.08)]"
                    style={{ color: textColor }}
                  >
                    <span className="flex items-center gap-2">
                      {isDarkMode ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                      {isDarkMode ? "Light Mode" : "Dark Mode"}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:bg-red-50 dark:hover:bg-red-950/20"
                    style={{ color: "#dc2626" }}
                  >
                    <span className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-lg border-2 bg-transparent px-3 py-2 text-sm font-semibold transition-all hover:bg-[rgba(127,85,57,0.05)]"
                    style={{
                      borderColor: "#7F5539",
                      color: "#7F5539",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/auth?mode=signup"
                    className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-bold transition-all hover:opacity-90 shadow-sm"
                    style={{
                      backgroundColor: "#7F5539",
                      color: "#FFFEF9",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
