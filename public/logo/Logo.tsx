"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Logo({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className} style={{ minHeight: "50px" }} />;
  }

  return (
    <div className={className}>
      <Image
        fill
        priority
        alt="Creminox Logo"
        src="/logo/creminox-logo.png"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}
