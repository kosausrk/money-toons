"use server"

import { eleven } from "@/app/utils/eleven";
import { Readable } from "node:stream";
import { Storage } from '@google-cloud/storage';
import { createReadStream, createWriteStream, readFileSync } from "node:fs";
import { openai } from "@/app/utils/openai";
import { prisma } from "@/app/utils/prisma";
import { Speaker } from "@prisma/client";
import { generateAIPrompt, getTickers } from "./stock";
import { unlink } from "node:fs/promises";

const voices: { name: Speaker, id: string }[] = [
	{
		name: Speaker.Peter,
		id: "Am3kQ9sNGQvjBZAvuhZr",
	},
	{
		name: Speaker.Fish,
		id: "bx1RgtnvnBdxbH9nHwxj"
	},
	{
		name: Speaker.Rick,
		id: "FNvkXyaplrUc5059C7F2"
	},
	{
		name: Speaker.Stewie,
		id: "Xy43ZWHSUulCVStF0GMd"
	},
	{
		name: Speaker.Brian,
		id: "q0NwORrq1L2zhydVwVXf"
	},
	{
		name: Speaker.Omni,
		id: "ex9wBLWz2wYdr7z7zuMo"
	}
]

function getRandomCharacter() {
	const randomIndex = Math.floor(Math.random() * voices.length);

	return voices[randomIndex];
}

export async function populateBrainRot() {
	try {
		console.log("eeegsfb")
		try {
			const a = await prisma.video.findMany({
				where: {

				}
			});
			console.log(a)
			
		} catch {
		}
		const tickers: string[] = await getTickers();
	
		for (let i = 0; i < tickers.length; i++) {
			const current = tickers[i];
			console.log(`Generating brainrot for ${current}`);
			const prompt = await generateAIPrompt(current);
			console.log(`Prompt finished for ${current}`);
			await voice(prompt, current);
		}
		
	} catch {
		throw new Error("ertg")
	}
}

export async function voice(text: string, ticker: string) {
	const speech = await openai.chat.completions.create({
		model: "gpt-4o",
		messages: [
			{
				role: "developer",
				content: `
					You are an ai assistant that given a text prompt with
					stock market and news headlines will create a short
					summary of whether or not to buy the stock and what's
					happening with the company. Please respond in plain
					text only, without any markdown formatting`
			},
			{
				role: "user",
				content: text
			}
		]
	})
	const character = getRandomCharacter();

	let speechText = speech.choices[0]?.message?.content || "Sorry, we didn't have any data on this stock.";

	if (character.name == Speaker.Fish) {
		speechText = "BREAKING NEWS!!" + speechText;
	} else if (character.name == Speaker.Stewie) {
		speechText = "Listen Brian, " + speechText;
	} else if (character.name == Speaker.Omni) {
		speechText = "MARK... we need to talk... " + speechText;
	}

	const audioStream = await eleven.textToSpeech.convertAsStream(character.id,
		{
			text: speechText,
			model_id: "eleven_multilingual_v2"
		}
	)
	const fileName = `${character.name}-${Date.now()}.mp3`;
	const writableStream = createWriteStream(fileName);
	const readableStream = Readable.from(audioStream);
	readableStream.pipe(writableStream);

	const storage = new Storage();
	const bucket = storage.bucket("brainrot-finance")
	const file = bucket.file(fileName);

	await new Promise<void>((resolve, reject) => {
		writableStream.on("finish", resolve);
		writableStream.on("error", reject);
	});

	const audioBuffer = readFileSync(fileName);

	await file.save(audioBuffer, {
		metadata: {
			contentType: 'audio/mpeg'
		}
	})

	const audioUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

	const transcription = await openai.audio.transcriptions.create({
		file: createReadStream(fileName),
		model: "whisper-1",
		response_format: "srt",
		language: "en"
	});

	await unlink(fileName);

	await prisma.video.create({
		data: {
			audioUrl,
			transcription,
			ticker,
			speaker: character.name
		}
	});

}