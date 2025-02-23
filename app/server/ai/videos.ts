"use server"

import { prisma } from "@/app/utils/prisma";

export async function getFrontPage(skip: number = 0, take: number = 5) {
	try {
		return await prisma.video.findMany({
			skip: skip % (await prisma.video.count()),
			take,
			select: {
				id: true,
				audioUrl: true,
				ticker: true,
				speaker: true,
				createdAt: true
			}
		})
	} catch {
		return null;
	}
}

export async function getSubtitles(id: string) {
	try {
		const subtitles = await prisma.video.findUnique({
			where: {
				id
			},
			select: {
				transcription: true
			}
		})

		if (subtitles == null) {
			return null;
		}

		return subtitles.transcription;
	} catch {
		return null
	}
}