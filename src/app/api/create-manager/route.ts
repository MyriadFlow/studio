import { prisma } from '@/utils/connect'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
	try {
		const body = await req.json()

		// console.log(body)

		// await prisma.manager.create({
		// 	data: {
		//     walletAddress: body.walletAddress,
		//     brands: {
		//       create
		//     }
		//   },
		// })

		return new NextResponse(JSON.stringify({ message: 'Manager Created' }), {
			status: 201,
		})
	} catch (error) {
		console.log(error)

		return new NextResponse(
			JSON.stringify({ message: 'something went wrong' }),
			{ status: 500 }
		)
	}
}
