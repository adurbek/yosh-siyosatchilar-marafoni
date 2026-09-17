"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

type Props = {
  name: string;
  role: string;
  /** Photo path, e.g. "/commission/1.jpg". Falls back to a placeholder if missing. */
  photo: string;
};

/**
 * A single commission-member row: portrait photo on the left, name (bold) and
 * role (muted) on the right. If the photo file is absent, a neutral avatar
 * placeholder is shown so real photos can be dropped into /public/commission
 * later without touching the code.
 */
export function MemberCard({ name, role, photo }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex items-start gap-5 border-t border-outline-variant/40 py-6">
      <div className="relative h-[128px] w-[108px] flex-shrink-0 overflow-hidden rounded-sm bg-surface-container">
        {failed ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#eaf2fb] to-[#dbe7f5]">
            <Icon name="person" className="text-5xl text-primary-container/70" />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={name}
            className="h-full w-full object-cover object-top"
            onError={() => setFailed(true)}
          />
        )}
      </div>

      <div className="pt-1">
        <h3 className="font-headline text-body-lg font-bold leading-snug text-on-surface">
          {name}
        </h3>
        <p className="mt-2 font-body text-sm leading-relaxed text-on-surface-variant">
          {role}
        </p>
      </div>
    </div>
  );
}
