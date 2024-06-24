import "@/styles/globals.css";
import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import { ViewTransitions } from 'next-view-transitions';
import QueryProvider from "@/context/query-provider";
import { cn } from "@/libs/utils";
import SiteFooter from "@/components/site-footer";
import KbarLayout from "@/components/kbar/kbar-layout";
import { Toaster } from "@/components/ui/toaster";
import { fontSpoqaHanSansNeo } from "@/data/data";
import MobileNav from "@/components/nav/mobile-nav";
import { metadataLayout } from "@/config/metadata";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = metadataLayout;

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {

  return (
    <ViewTransitions>
      <html lang="ko" className="scroll-smooth scroll-pt-20">
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/assets/favicons/site.webmanifest" />
        <link rel="shortcut icon" href="/assets/favicons/favicon.ico" />
        <body className={cn('min-h-dvh antialiased', fontSpoqaHanSansNeo.className)}>
          <KbarLayout >
            <QueryProvider>
              <ToastProvider>
                {modal}
                <SiteHeader />
                {children}
                <SiteFooter />
                <MobileNav />
                <Toaster />
              </ToastProvider>
            </QueryProvider>
          </KbarLayout>
        </body>
      </html>
    </ViewTransitions>
  );
}
