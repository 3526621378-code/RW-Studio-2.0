import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  // Keep Turbopack scoped to this repository. The parent directory also has a
  // package-lock.json, which would otherwise make Next.js infer the wrong root.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
