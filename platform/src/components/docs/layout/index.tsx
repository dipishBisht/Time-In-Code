"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { docsNav } from "@/utils/data";
import { ChevronRight } from "lucide-react";

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="pt-28 min-h-screen flex flex-col">
      <div className="flex-1 mx-auto container">
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
