import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Permitir el acceso desde la IP local en desarrollo
  allowedDevOrigins: ["192.168.1.36", "localhost:3000"],
};

export default nextConfig;
