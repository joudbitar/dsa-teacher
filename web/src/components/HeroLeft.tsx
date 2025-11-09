import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroLeft() {
  const heroText = "Master the fundamentals";
  const subtext = "Learn multiplication before you touch the calculator.";

  return (
    <div className="flex flex-col justify-center space-y-8">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 w-fit">
        <span className="h-2 w-2 rounded-full bg-primary" />
        <span className="text-sm font-medium text-primary">
          Fundamentals-first · No copy-paste coding
        </span>
      </div>

      {/* Hero Text */}
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
        <span className="text-foreground">{heroText}</span>
      </h1>

      {/* Subtext */}
      <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl">
        {subtext}
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/challenges"
          className={cn(
            "inline-flex items-center justify-center rounded-lg bg-accent px-8 py-4 text-base font-bold text-accent-foreground",
            "shadow-lg shadow-accent/30 transition-colors hover:shadow-accent/40"
          )}
        >
          Browse Challenges
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
        <button className="inline-flex items-center justify-center rounded-lg border-2 border-primary bg-transparent px-8 py-4 text-base font-semibold text-primary transition-colors hover:bg-primary/10">
          How It Works
        </button>
      </div>
    </div>
  );
}
