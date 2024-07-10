import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import MainLayout from "@/components/main-layout";

export const metadata: Metadata = {
  title: "Waste My Internet",
  description: "Waste your internet here!!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <TooltipProvider>
            <MainLayout>{children}</MainLayout>
          </TooltipProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
