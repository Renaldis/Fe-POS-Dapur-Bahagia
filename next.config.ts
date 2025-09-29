import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com"], // wajib untuk load gambar dari cloudinary
  },
};

export default nextConfig;
