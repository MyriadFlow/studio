/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
	  domains: ['utfs.io'],
	},
	experimental: {
	  missingSuspenseWithCSRBailout: false,
	},
	async headers() {
	  return [
		{
		  source: '/(.*)', // Apply this to all routes
		  headers: [
			{
			  key: 'Content-Security-Policy',
			  value: "frame-ancestors 'self' http://localhost:* https://*.vercel.app https://*.ngrok-free.app https://secure-mobile.walletconnect.com https://secure.walletconnect.com",
			},
		  ],
		},
	  ]
	},
  }
  
  export default nextConfig
  