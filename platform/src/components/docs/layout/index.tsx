"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const docsNav = [
  { label: "Quick Start", to: "/docs/quick-start" },
  { label: "Installation", to: "/docs/installation" },
  { label: "Authentication", to: "/docs/authentication" },
  { label: "Viewing Stats", to: "/docs/viewing-stats" },
  { label: "API Reference", to: "/docs/api-reference" },
  { label: "Embedding", to: "/docs/embedding" },
  { label: "Troubleshooting", to: "/docs/troubleshooting" },
];

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container">
        <div className="flex gap-10 py-10">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <nav className="sticky top-24 space-y-1">
              <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-3 px-3">
                Documentation
              </p>
              {docsNav.map((item) => (
                <Link
                  key={item.to}
                  href={item.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    pathname === item.to
                      ? "bg-primary/5 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {pathname === item.to && (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 max-w-3xl">
            <article className="prose-docs">{children}</article>
          </main>
        </div>
      </div>
    </div>
  );
}
