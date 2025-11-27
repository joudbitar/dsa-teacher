import { Link } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";

export function Footer({ className }: { className?: string }) {
  const { backgroundColor, textColor, secondaryTextColor } = useTheme();

  // Use the primary brown color from the theme
  const primaryBrown = "#7F5539";

  return (
    <footer
      className={`border-t backdrop-blur-sm ${className || ""}`}
      style={{
        backgroundColor: backgroundColor,
        borderColor: "#D4CFC0",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo and Team - All Horizontal */}
        <div className="flex flex-row justify-center items-center gap-16 mb-8 flex-wrap">
          <Link to="/" className="flex items-center gap-4 group flex-shrink-0">
            <img
              src="/turtle_logo.png"
              alt="Shelly logo"
              className="block h-14 w-auto transition-all group-hover:scale-105 object-contain"
            />
            <span
              className="text-3xl font-bold tracking-tight leading-none whitespace-nowrap"
              style={{
                color: textColor,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              Shelly
            </span>
          </Link>

          <div className="flex flex-col items-center gap-3">
            <h3
              className="font-semibold font-mono"
              style={{ color: textColor }}
            >
              Team
            </h3>
            <div className="flex gap-4 text-sm font-mono">
              <a
                href="https://www.linkedin.com/in/tahamoula/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:opacity-80"
                style={{ color: primaryBrown }}
              >
                Taha Moula
              </a>
              <span style={{ color: secondaryTextColor }}>•</span>
              <a
                href="https://www.linkedin.com/in/walter-ambrossi-101877244/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:opacity-80"
                style={{ color: primaryBrown }}
              >
                Walter Ambrossi
              </a>
              <span style={{ color: secondaryTextColor }}>•</span>
              <a
                href="https://joudbitar.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:opacity-80"
                style={{ color: primaryBrown }}
              >
                Joud Bitar
              </a>
            </div>
          </div>
        </div>

        <div
          className="mt-8 border-t pt-8 text-center text-sm font-mono"
          style={{
            borderColor: "#D4CFC0",
            color: secondaryTextColor,
          }}
        >
          <p>
            © 2025 Shelly. Built for hackers who want to master fundamentals.
          </p>
        </div>
      </div>
    </footer>
  );
}
