"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";

export default function StickyHeader({
  currency,
  setCurrency,
  theme,
  setTheme,
}: {
  currency: string;
  setCurrency: (c: string) => void;
  theme: string;
  setTheme: (t: string) => void;
}) {
  return (
    <div className="sticky top-0 z-30 bg-background pb-4 pt-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-bold">Live Gas Costs on EVM Networks</h1>
          <p className="text-muted-foreground text-sm">
            Real-time transaction cost estimates across Ethereum-compatible networks.
          </p>
        </div>
        <div className="flex gap-2 items-center flex-wrap justify-end">
          <ToggleGroup
            type="single"
            value={currency}
            onValueChange={(val) => val && setCurrency(val)}
          >
            {Object.entries(SUPPORTED_CURRENCIES).map(([code, { symbol }]) => (
              <ToggleGroupItem key={code} value={code}>
                {code} {symbol}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
