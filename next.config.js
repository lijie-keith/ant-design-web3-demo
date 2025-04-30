/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@ant-design", "antd", "rc-util", "rc-pagination", "rc-picker", "rc-input"],
  experimental: {
    // 如果 Next.js 有相关实验性配置
    prefetchInRender: true,
  },
}

module.exports = nextConfig
