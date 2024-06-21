/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['utfs.io'],
	},
	experimental: {
		missingSuspenseWithCSRBailout: false,
	},
}

export default nextConfig
