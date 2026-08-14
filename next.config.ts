import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/para-psav",
        destination: "/cripto-exchanges/uruguay",
        permanent: true,
      },
      {
        source: "/:locale(es|en|pt)/para-psav",
        destination: "/:locale/cripto-exchanges/uruguay",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
