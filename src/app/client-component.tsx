"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { COMMON_TASKS, SUPPORTED_CURRENCIES, type CurrencyInfo } from "@/lib/constants";
//import { formatNumber } from "@/lib/utils";
import StickyHeader from "./sticky-header";
import { io, Socket } from "socket.io-client";
import { NetworkData } from "@/lib/types";

interface ClientComponentProps {
  initialData: NetworkData;
}

export default function ClientComponent({ initialData }: ClientComponentProps) {
  const [data, setData] = useState<NetworkData>(initialData);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const formatNumber = (value: number, currency: string = selectedCurrency): string => {
    //const currencyInfo: CurrencyInfo = SUPPORTED_CURRENCIES[currency];
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(value);
  };

  const formatGasPrice = (value: number): string => {
    return `${value.toLocaleString()} Gwei`;
  };

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
                Native Token: {info.native_token_symbol} @{" "}
                {SUPPORTED_CURRENCIES[selectedCurrency]?.symbol}
                {formatNumber(info.token_prices?.[selectedCurrency])}
              </div>
              <div className="text-sm">
                Median Gas Price: {formatGasPrice(info.gas_prices_gwei?.["50"])}
              </div>
              <div className="text-sm font-medium">
                1M Gas ≈ {formatNumber(info.native_token_costs?.["50"])} {" "}
                {info.native_token_symbol} ≈{" "}
                {SUPPORTED_CURRENCIES[selectedCurrency]?.symbol}
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
                      {label}: {SUPPORTED_CURRENCIES[selectedCurrency]?.symbol}
                      {formatNumber(taskCost)} {selectedCurrency}
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
