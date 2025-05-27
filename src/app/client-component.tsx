"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { COMMON_TASKS, SUPPORTED_CURRENCIES } from "@/lib/constants";
import StickyHeader from "./sticky-header";

export default function ClientComponent({ data }: { data: any }) {
  const [currency, setCurrency] = useState("USD");
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  const getFallbackCurrency = (): string => {
    const locale = navigator.language;
    if (locale.startsWith("en-US")) return "USD";
    if (locale.startsWith("en-GB")) return "GBP";
    if (locale.startsWith("de") || locale.startsWith("fr")) return "EUR";
    if (locale.startsWith("ja")) return "JPY";
    if (locale.startsWith("zh")) return "CNY";
    if (locale.startsWith("hi")) return "INR";
    if (locale.startsWith("ko")) return "KRW";
    return "USD";
  };

  const getFallbackLanguage = (): string => {
    return navigator.language?.split("-")[0] || "en";
  };

  useEffect(() => {
    const storedCurrency = localStorage.getItem("currency");
    const storedTheme = localStorage.getItem("theme");
    const storedLanguage = localStorage.getItem("language");
    setCurrency(storedCurrency || getFallbackCurrency());
    setTheme(storedTheme || "light");
    setLanguage(storedLanguage || getFallbackLanguage());
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <div className="p-4">
      <StickyHeader
        currency={currency}
        setCurrency={setCurrency}
        theme={theme}
        setTheme={setTheme}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {Object.entries(data).map(([network, info]) => (
          <Card key={network}>
            <CardContent className="p-4 space-y-2">
              <div className="text-xl font-semibold">{network}</div>
              <div className="text-sm text-muted-foreground">
                Native Token: {info.native_token_symbol} @{" "}
                {SUPPORTED_CURRENCIES[currency]?.symbol}
                {info.token_prices?.[currency] ?? "-"}
              </div>
              <div className="text-sm">
                Median Gas Price: {info.gas_prices_gwei?.["50"]?.toFixed(2)} Gwei
              </div>
              <div className="text-sm font-medium">
                1M Gas ≈ {info.native_token_costs?.["50"]?.toFixed(6)}{" "}
                {info.native_token_symbol} ≈{" "}
                {SUPPORTED_CURRENCIES[currency]?.symbol}
                {info.costs?.[currency]?.["50"]?.toFixed(4)} {currency}
              </div>
              <hr />
              <div className="text-sm font-medium">Estimated Cost by Task:</div>
              <ul className="text-sm pl-4 list-disc">
                {COMMON_TASKS.map(({ label, gas }) => {
                  const multiplier = gas / 1_000_000;
                  const taskCost = info.costs?.[currency]?.["50"] * multiplier;
                  return (
                    <li key={label}>
                      {label}: {SUPPORTED_CURRENCIES[currency]?.symbol}
                      {taskCost?.toFixed(4)} {currency}
                    </li>
                  );
                })}
              </ul>
              <div className="text-xs text-muted-foreground mt-2">
                Updated: {info.datetime}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
