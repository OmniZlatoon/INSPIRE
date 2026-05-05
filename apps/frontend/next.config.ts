import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // outputFileTracingRoot tells Next.js/Turbopack to resolve node_modules
  // relative to the monorepo root (where `next` is actually installed).
  // This fixes the "Next.js package not found" Turbopack panic in npm workspaces.
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
