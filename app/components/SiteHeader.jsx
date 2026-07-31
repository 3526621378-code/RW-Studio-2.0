"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/app/data/site-content";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="RW Studio 首页">
        <span className="wordmark-monogram">RW</span>
        <span className="wordmark-name">
          RW Studio
          <small>若雾工作室</small>
        </span>
      </Link>

      <nav className="primary-nav" aria-label="主导航">
        {navigation.map((item) => {
          const isCurrent =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              className="nav-link"
              href={item.href}
              key={item.href}
              aria-current={isCurrent ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
