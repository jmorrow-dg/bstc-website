"use client";

import { useEffect } from "react";
import { storeAttribution } from "@/lib/attribution";

export default function AttributionTracker() {
  useEffect(() => {
    storeAttribution();
  }, []);

  return null;
}
