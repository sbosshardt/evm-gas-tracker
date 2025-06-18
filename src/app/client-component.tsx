"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { COMMON_TASKS, SUPPORTED_CURRENCIES, type CurrencyInfo } from "@/lib/constants";
//import { formatNumber } from "@/lib/utils";
import StickyHeader from "./sticky-header";
import { io, Socket } from "socket.io-client";
import { NetworkData } from "@/lib/types";

export default function ClientComponent() {
  const [data, setData] = useState<NetworkData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [isConnected, setIsConnected] = useState<boolean>(false);
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

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin;
        const response = await fetch(`${baseUrl}/initial-data.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch initial data');
        }
        const initialData = await response.json();
        setData(initialData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    const socketInstance = io("/", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket server");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      setIsConnected(false);
    });

    socketInstance.on("data-update", (newData: NetworkData) => {
      console.log("Received data update:", newData);
      setData(newData);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    const storedCurrency = localStorage.getItem("currency");
    const storedTheme = localStorage.getItem("theme");
    const storedLanguage = localStorage.getItem("language");
    setSelectedCurrency(storedCurrency || getFallbackCurrency());
    setTheme(storedTheme || "light");
    setLanguage(storedLanguage || getFallbackLanguage());
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("currency", selectedCurrency);
  }, [selectedCurrency]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const formatNumber = (value: number | undefined, currency: string = selectedCurrency): string => {
    if (value === undefined || value === null) return "-";

    // For cryptocurrencies (BTC, ETH, BNB), use custom formatting
    if (["BTC", "ETH", "BNB"].includes(currency)) {
      // For numbers >= 1, use regular toFixed(4)
      if (Math.abs(value) >= 1) {
        return `${value.toFixed(4)}`;
      }
      // For numbers < 1, use toPrecision to get significant figures
      return `${value.toPrecision(5)}`;
    }

    // For fiat currencies, use Intl.NumberFormat without the currency symbol
    const formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: Math.abs(value) >= 1 ? 2 : 5,
      maximumFractionDigits: Math.abs(value) >= 1 ? 2 : 5,
    });
    return formatter.format(value);
  };

  const formatGasPrice = (value: number | undefined): string => {
    if (value === undefined || value === null) return "-";
    return `${value.toLocaleString()} Gwei`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg">Loading gas prices...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg text-red-500">Failed to load gas prices. Please try refreshing the page.</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <StickyHeader
        currency={selectedCurrency}
        setCurrency={setSelectedCurrency}
        theme={theme}
        setTheme={setTheme}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {Object.entries(data).map(([network, info]) => (
          <Card key={network}>
            <CardContent className="p-4 space-y-2">
              <div className="text-xl font-semibold">{network}</div>
              <div className="text-sm text-muted-foreground">
                Native Token: {info.native_token_symbol} @ {SUPPORTED_CURRENCIES[selectedCurrency]?.symbol}
                {formatNumber(info.token_prices?.[selectedCurrency])}
              </div>
              <div className="text-sm">
                Median Gas Price: {formatGasPrice(info.gas_prices_gwei?.["50"])}
              </div>
              <div className="text-sm font-medium">
                1M Gas ≈ {formatNumber(info.native_token_costs?.["50"])} {info.native_token_symbol} ≈ {SUPPORTED_CURRENCIES[selectedCurrency]?.symbol}
                {formatNumber(info.costs?.[selectedCurrency]?.["50"])} {selectedCurrency}
              </div>
              <hr />
              <div className="text-sm font-medium">Estimated Cost by Task:</div>
              <ul className="text-sm pl-4 list-disc">
                {COMMON_TASKS.map(({ label, gas }) => {
                  const multiplier = gas / 1_000_000;
                  const taskCost = info.costs?.[selectedCurrency]?.["50"] * multiplier;
                  return (
                    <li key={label}>
                      {label}: {SUPPORTED_CURRENCIES[selectedCurrency]?.symbol}{formatNumber(taskCost)}
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

      <div className="mt-4 text-sm text-gray-500">
        WebSocket Status: {isConnected ? "Connected" : "Disconnected"}
      </div>
    </div>
  );
}
