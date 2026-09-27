"use client";

import Image from "next/image";

// Brand mark — /public/bscsafe.png. Requested at one fixed intrinsic width so every
// call site (22px … 48px) shares a single optimised asset, then scaled down via CSS.
export default function BSCVerifyLogo({ size = 32 }) {
  return (
    <Image
      src="/bscsafe.png"
      alt="BSC Safe"
      width={128}
      height={128}
      priority
      style={{ width: size, height: size, display: "block", objectFit: "contain" }}
    />
  );
}
