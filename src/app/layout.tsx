import "@/styles/globals.css";
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import MainLayout from "@/components/main-layout";
import { Toaster } from "@/components/ui/sonner";

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
          <MantineProvider>
            <TooltipProvider>
              <MainLayout>{children}</MainLayout>
              <Toaster closeButton duration={5000} position="bottom-right" />
            </TooltipProvider>
          </MantineProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
