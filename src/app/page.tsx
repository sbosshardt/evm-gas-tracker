import fs from "fs/promises";
import path from "path";
import { Metadata } from "next";
import ClientComponent from "./client-component";

export const metadata: Metadata = {
  title: "Live Gas Costs on EVM Networks | EVM Gas Tracker",
  description: "Track real-time transaction costs and gas prices across Ethereum, Polygon, Arbitrum, Optimism, Base, and more.",
  metadataBase: new URL("https://evmgastracker.com"),
  openGraph: {
    title: "Live Gas Costs on EVM Networks",
    description: "Track real-time transaction costs and gas prices across Ethereum-compatible chains.",
    url: "https://evmgastracker.com",
    siteName: "EVM Gas Tracker",
    type: "website",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "EVM Gas Tracker Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Gas Costs on EVM Networks",
    description: "See what it costs to make transactions on Ethereum, Polygon, Arbitrum, and more — in real time.",
    images: ["/og-preview.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

async function getInitialData() {
  const filePath = path.join(process.cwd(), "public", "initial-data.json");
  const json = await fs.readFile(filePath, "utf-8");
  return JSON.parse(json);
}

export default async function Page() {
  const data = await getInitialData();
  return (
    <main className="min-h-screen bg-background text-foreground px-4 pb-12">
      <section className="max-w-7xl mx-auto pt-8">
        <ClientComponent initialData={data} />
      </section>
    </main>
  );
}
