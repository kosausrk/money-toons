"use server"

import { openai } from "@/app/utils/openai";

export async function uploadTranscribe(formData: FormData) {
	try {
		const audioFile = formData.get("audio") as File;

		if (!audioFile) {
			throw new Error("No Audio File Found");
		}
		
		console.log("hers")
		
		const transcription = await openai.audio.transcriptions.create({
			file: audioFile,
			model: "whisper-1",
			response_format: "srt",
			language: "en"
		})

		return transcription;
	} catch (e) {
		console.log(e);
		return null;
	}
}