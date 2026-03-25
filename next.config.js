/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@napi-rs/canvas", "tesseract.js", "pdfjs-dist"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        "@napi-rs/canvas": "commonjs @napi-rs/canvas",
      });
    }
    return config;
  },
};

module.exports = nextConfig;
