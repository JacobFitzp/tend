import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  // Relative asset paths so the static export loads correctly via file:// in Electron
  assetPrefix: process.env.ELECTRON_BUILD ? './' : undefined,
};

export default nextConfig;
