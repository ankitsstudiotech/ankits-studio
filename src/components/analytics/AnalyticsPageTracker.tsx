"use client";

import { useEffect } from "react";
import { trackProgrammeView, trackBranchView } from "@/lib/analytics";

export function ProgrammeViewTracker({ name }: { name: string }) {
  useEffect(() => {
    trackProgrammeView(name);
  }, [name]);
  return null;
}

export function BranchViewTracker({ name }: { name: string }) {
  useEffect(() => {
    trackBranchView(name);
  }, [name]);
  return null;
}
