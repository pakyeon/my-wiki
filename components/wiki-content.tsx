"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import type { Components } from "react-markdown";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

function childrenToText(children: React.ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(childrenToText).join("");
  }

  if (React.isValidElement(children)) {
    return childrenToText((children.props as { children?: React.ReactNode }).children);
  }

  return "";
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-가-힣]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractTocFromMarkdown(content: string) {
  const items: TocItem[] = [];
  for (const line of content.split("\n")) {
    const h2 = line.match(/^##\s+(.+)/);
    const h3 = line.match(/^###\s+(.+)/);
    if (h2) {
      const text = h2[1].trim();
      items.push({ id: slugify(text), text, level: 2 });
    } else if (h3) {
      const text = h3[1].trim();
      items.push({ id: slugify(text), text, level: 3 });
    }
  }
  return items;
}

function TableOfContents({ items }: Readonly<{ items: TocItem[] }>) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (items.length === 0 || typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    const timeout = window.setTimeout(() => {
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el) {
          observer.observe(el);
        }
      }
    }, 80);

    return () => {
      window.clearTimeout(timeout);
      observer.disconnect();
    };
  }, [items]);

  return (
    <nav className="space-y-0.5">
      <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">On this page</p>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={(event) => {
            event.preventDefault();
            const el = document.getElementById(item.id);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
              setActiveId(item.id);
            }
          }}
          className={cn(
            "block rounded px-1 py-1 text-xs leading-snug transition-colors",
            item.level === 3 && "pl-4",
            activeId === item.id ? "font-medium text-slate-900" : "text-slate-500 hover:text-slate-700",
          )}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}

function headingWithId(
  Tag: "h2" | "h3",
  className: string,
): Components["h2"] {
  return function Heading({ children }) {
    const text = childrenToText(children);

    return (
      <Tag id={slugify(text)} className={className}>
        {children}
      </Tag>
    );
  };
}

const components: Components = {
  h2: headingWithId("h2", "mt-8 mb-3 text-xl font-semibold tracking-tight text-slate-950"),
  h3: headingWithId("h3", "mt-6 mb-2 text-lg font-semibold tracking-tight text-slate-900"),
  p({ children }) {
    return <p className="my-3 text-[15px] leading-8 text-slate-700">{children}</p>;
  },
  ul({ children }) {
    return <ul className="my-3 list-disc space-y-1 pl-5 text-[15px] leading-8 text-slate-700">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="my-3 list-decimal space-y-1 pl-5 text-[15px] leading-8 text-slate-700">{children}</ol>;
  },
  a({ href, children }) {
    return (
      <a
        href={href}
        className="text-slate-900 underline decoration-slate-300 underline-offset-2 transition-colors hover:decoration-slate-700"
      >
        {children}
      </a>
    );
  },
  code({ children }) {
    return <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">{children}</code>;
  },
  pre({ children }) {
    return <pre className="my-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4">{children}</pre>;
  },
};

export function WikiContent({
  title,
  content,
}: Readonly<{
  title?: string;
  content: string;
}>) {
  const tocItems = React.useMemo(() => extractTocFromMarkdown(content), [content]);
  const hasToc = tocItems.length > 0;

  return (
    <div className="w-full">
      <div className={cn("mx-auto px-0 py-0", hasToc ? "max-w-5xl" : "max-w-3xl")}>
        <div className={cn(hasToc && "flex gap-8")}>
          <div className={cn("min-w-0", hasToc ? "max-w-[720px] flex-1" : "w-full")}>
            {title ? <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-950">{title}</h1> : null}
            <div className="wiki-content">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex, rehypeSanitize]} components={components}>
                {content}
              </ReactMarkdown>
            </div>
          </div>
          {hasToc ? (
            <aside className="hidden w-48 shrink-0 lg:block">
              <div className="sticky top-10">
                <TableOfContents items={tocItems} />
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}
