"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export type FaqEntry = { id: string; question: string; answer: string };

export function FaqAccordion({ title, items }: { title: string; items: FaqEntry[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <section id="faq" className="w-full bg-background py-section-gap">
      <Container>
        <h2 className="mb-12 text-headline-md font-headline uppercase text-on-primary-fixed">
          {title}
        </h2>

        <div className="flex max-w-5xl flex-col border-t border-outline-variant/30">
          {items.map((item, i) => {
            const isOpen = open === item.id;
            return (
              <div key={item.id} className="border-b border-outline-variant/30 py-8">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  className="group flex w-full items-center justify-between gap-4 text-left"
                >
                  <span className="flex items-center gap-8">
                    <span
                      className="text-5xl font-bold text-transparent"
                      style={{ WebkitTextStroke: "1px #00789b" }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-xl font-headline font-bold text-on-surface transition-colors group-hover:text-primary md:text-2xl">
                      {item.question}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full transition-colors",
                      isOpen
                        ? "bg-primary-container/10 text-primary"
                        : "bg-surface-container-high text-on-surface-variant group-hover:bg-primary-container/10 group-hover:text-primary",
                    )}
                  >
                    <Icon name={isOpen ? "close" : "add"} className="text-lg" />
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300",
                    isOpen ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pl-[4.5rem] pr-8 font-body text-body-lg text-on-surface-variant">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
