import { headers } from "next/headers";
import { RouteTransition } from "@/app/components/RouteTransition";
import { SiteHeader } from "@/app/components/SiteHeader";
import { TimescapeProvider } from "@/app/components/timescape/TimescapeProvider";
import { TimescapeStage } from "@/app/components/timescape/TimescapeStage";
import { TimescapeSwitch } from "@/app/components/timescape/TimescapeSwitch";
import "@fontsource-variable/bricolage-grotesque/wdth.css";
import "@fontsource-variable/ibm-plex-sans/wght.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";

export async function generateMetadata() {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const host = (forwardedHost ?? requestHeaders.get("host") ?? "localhost")
    .split(",")[0]
    .trim();
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol = (
    forwardedProtocol ??
    (host.startsWith("localhost") ? "http" : "https")
  )
    .split(",")[0]
    .trim();

  let metadataBase;

  try {
    metadataBase = new URL(`${protocol}://${host}`);
  } catch {
    metadataBase = new URL("http://localhost");
  }

  return {
    metadataBase,
    title: {
      default: "RW Studio | 若雾工作室",
      template: "%s | RW Studio",
    },
    description:
      "RW Studio 若雾工作室，在东方美学与未来数字技术之间探索新的艺术表达。",
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
    openGraph: {
      type: "website",
      locale: "zh_CN",
      siteName: "RW Studio",
      title: "RW Studio | 若雾工作室",
      description:
        "在传统东方意境与未来数字技术之间，探索新的艺术表达方式。",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "RW Studio 若雾工作室，东方数字山水",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "RW Studio | 若雾工作室",
      description:
        "在传统东方意境与未来数字技术之间，探索新的艺术表达方式。",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" data-timescape="dawn">
      <head>
        <link
          rel="preload"
          as="image"
          href="/timescape/dawn-desktop.jpg"
          media="(min-width: 721px)"
        />
        <link
          rel="preload"
          as="image"
          href="/timescape/dawn-mobile.jpg"
          media="(max-width: 720px)"
        />
      </head>
      <body>
        <TimescapeProvider>
          <a className="skip-link" href="#main-content">
            跳至主要内容
          </a>
          <TimescapeStage />
          <SiteHeader />
          <TimescapeSwitch />
          <RouteTransition>{children}</RouteTransition>
        </TimescapeProvider>
      </body>
    </html>
  );
}
