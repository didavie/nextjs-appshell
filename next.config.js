/** @type {import('next').NextConfig} */
const removeImports = require("next-remove-imports")();

const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  experimental: {
    mdxRs: true,
  },
  
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withMDX = require("@next/mdx")();
module.exports = withBundleAnalyzer(withMDX(removeImports(nextConfig)));
