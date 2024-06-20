import { prisma } from '@/utils/connect'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
	try {
		const body = await req.json()

		console.log(body)

		// 	where: {
		// 		brandName: body[1],
		// 	},
		// })const brand = await prisma.brand.findUnique({

		// console.log(brandId)

		await prisma.collection.create({
			data: {
				collectionName: body[0],
				brandId: body[1],
			},
		})

		return new NextResponse(JSON.stringify({ message: 'Collection Created' }), {
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
