"use client"

import "./styles/home.scss"
import { useState, useRef, RefObject, useEffect, SetStateAction, Dispatch } from "react";
import { VolumeX, Volume2 } from "lucide-react";
import parseSRT from "parse-srt";
import { getFrontPage, getSubtitles } from "./server/ai/videos";
import { $Enums, Speaker } from "@prisma/client";
import { ChartContainer, ChartLegendContent } from "@/components/ui/chart";
import { Area, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchNewsArticles, fetchStockChartData } from "./server/ai/stock";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

type SubtitleCue = {
	id?: string;
	start: number;    // Start time in seconds
	end: number;      // End time in seconds
	text: string;
};  

type VideoParams = {
	muted: boolean,
	video: Video,
	setIsMuted: Dispatch<SetStateAction<boolean>>,
	audioRef: RefObject<HTMLAudioElement | null>,
	render: boolean;
}

type Video = {
    id: string;
    audioUrl: string;
    ticker: string;
    speaker: $Enums.Speaker;
    createdAt: Date;
}

const stockVideos = [
	"https://storage.googleapis.com/brainrot-finance/videos/fractal.mp4",
	"https://storage.googleapis.com/brainrot-finance/videos/dont-touch-it.mp4",
	"https://storage.googleapis.com/brainrot-finance/videos/subwaysurfers.mp4",
	"https://storage.googleapis.com/brainrot-finance/videos/scoreboard.mp4",
	"https://storage.googleapis.com/brainrot-finance/videos/3d-prints-1.mp4",
	"https://storage.googleapis.com/brainrot-finance/videos/mc-parkour-1.mp4",
	"https://storage.googleapis.com/brainrot-finance/videos/mc-parkour-2.mp4",
	"https://storage.googleapis.com/brainrot-finance/videos/mc-parkour-3.mp4",
	"https://storage.googleapis.com/brainrot-finance/videos/pizza-place-salad.mp4"
]

const speakers: { name: Speaker, img: string }[] = [
	{
		name: Speaker.Peter,
		img: "/peter.png",
	},
	{
		name: Speaker.Fish,
		img: "/fish.webp"
	},
	{
		name: Speaker.Rick,
		img: "/rick.png"
	},
	{
		name: Speaker.Stewie,
		img: "/stewie.png"
	},
	{
		name: Speaker.Brian,
		img: "/brian.png"
	},
	{
		name: Speaker.Omni,
		img: "/omni.png"
	}
]

const chartConfig = {
	price: {
		label: "Price",
		color: "#6d28d9"
	}
};

function getSpeakerImage(speakerName: Speaker): string | undefined {
	const speaker = speakers.find((s) => s.name === speakerName);
	return speaker ? speaker.img : undefined;
}  

function getRandomTwoDistinctItems(videos: string[]): [string, string] {
	if (videos.length < 2) {
		// If there's only one or zero videos, gracefully handle
		return [videos[0] ?? "", videos[0] ?? ""];
	}

	const first = videos[Math.floor(Math.random() * videos.length)];
	let second = videos[Math.floor(Math.random() * videos.length)];

	// Ensure they are distinct
	while (second === first) {
		second = videos[Math.floor(Math.random() * videos.length)];
	}

	return [first, second];
}

function DataWrapper({ video, audioRef, muted, setIsMuted, render } : VideoParams) {
	const hasFetchedRef = useRef(false);
	const [stockData, setStockData] = useState<{ name: string, value: number }[]>([]);
	const [articles, setNews] = useState<{
			title: string, author: string, article_url: string
	}[]>([]);
	
	
	
	useEffect(() => {
		if (render && !hasFetchedRef.current) {
				hasFetchedRef.current = true;
		
				(async () => {
				const newsData = await fetchNewsArticles(video.ticker);
				const stockData = await fetchStockChartData(video.ticker);
		
				if (stockData) {
					setStockData(stockData);
				}
				if (newsData) {
					setNews(newsData);
				}
				})();
			}
	}, [render, video.ticker]);

	return (
		<>
			<Video
				render={render}
				audioRef={audioRef}
				muted={muted}
				setIsMuted={setIsMuted}
				video={video}
			/>
			<div className="chart-wrapper">
				<h3 className="stock-header">${video.ticker}</h3>
				<ChartContainer config={chartConfig}>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart
						data={stockData}
						margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
						>
						{/* Define your gradient fill */}
						<defs>
							<linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor={chartConfig.price.color} stopOpacity={0.6} />
							<stop offset="95%" stopColor={chartConfig.price.color} stopOpacity={0} />
							</linearGradient>
						</defs>

						{/* X Axis - format the label as a date if your 'name' is a date string */}
						<XAxis
							dataKey="name"
							stroke="#999"
							tick={{ fontSize: 12 }}
							tickFormatter={(value) =>
							new Date(value).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
							})
							}
						/>

						{/* Y Axis - auto domain so the chart looks nice  */}
						<YAxis
							stroke="#999"
							tick={{ fontSize: 12 }}
							domain={["auto", "auto"]}
						/>

						{/* A custom tooltip, or your existing <ChartTooltip> / <ChartTooltipContent> if you prefer */}
						<Tooltip
							wrapperStyle={{ backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: 4 }}
							labelFormatter={(value: string) =>
							new Date(value).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
							})
							}
							formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
						/>

						{/* If you want a legend, you can keep <Legend> or your existing <ChartLegendContent> */}
						<Legend content={<ChartLegendContent />} />
						<Area
							type="monotone"
							dataKey="price"
							fill="url(#colorPrice)"
							fillOpacity={0.35}
							stroke="none"
						/>

						{/* Draw the main line on top */}
						<Line
							type="monotone"
							dataKey="value"
							stroke={chartConfig.price.color}
							strokeWidth={2}
							dot={false}
							activeDot={{ r: 5 }}
						/>
						</LineChart>
					</ResponsiveContainer>
				</ChartContainer>
				<div className="container mx-auto pl-8">
					<h1 className="text-3xl text-white font-bold mb-4">Finance News</h1>
				
					<ScrollArea className="h-[250px]" onWheel={(e) => e.stopPropagation()}>
						<Table className="shadow-md border rounded-lg">
						<TableHeader>
							<TableRow>
							<TableHead className="w-1/3">Author</TableHead>
							<TableHead className="w-2/3">Title</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
								{articles.map((news, index) => (
									<TableRow key={index}>
										<TableCell>{news.author}</TableCell>
										<TableCell><Link className="underline text-blue-500" href={news.article_url}>{news.title}</Link></TableCell>
									</TableRow>
								))}
						</TableBody>
						</Table>
					</ScrollArea>
				</div>
			</div>
		</>
	)
}

function Video({ video, audioRef, muted, setIsMuted, render } : VideoParams) {
	const [subtitles, setSubtitles] = useState<SubtitleCue[]>([]);
	const [currentSubtitle, setCurrentSubtitle] = useState<string>("");
	const [startTimestamp] = useState<number>(() => Date.now());
	const [[srcA, srcB]] = useState(() => getRandomTwoDistinctItems(stockVideos));
	const [characterImage] = useState(() => getSpeakerImage(video.speaker));

	useEffect(() => {
		if (render) {
			console.log(video.id + " - " + render);
			async function asyncCall() {

				const subtitlesRaw = await getSubtitles(video.id);
				
				if (subtitlesRaw != null) {
					setSubtitles(parseSRT(subtitlesRaw));
				}
			}

			asyncCall();
		}

	}, [render, video.id]);

	const handleTimeUpdate = () => {
		if (!audioRef.current) return;
		const time = audioRef.current.currentTime; // in seconds
	
		// Find the current subtitle text
		const activeCue = subtitles.find(
			(cue) => time >= cue.start && time <= cue.end
		);
		setCurrentSubtitle(activeCue ? activeCue.text : "");
	};

	const handleToggleMute = () => {
		setIsMuted((prev) => {
			const newMuted = !prev
			if (audioRef.current) {
			  audioRef.current.muted = newMuted
			  // If you want to ensure playback continues, call play() 
			  // when you unmute (some browsers may require it)
			  if (!newMuted) {
				const elapsed = (Date.now() - startTimestamp) / 1000;
				audioRef.current.currentTime = elapsed;

				audioRef.current.play().catch((err) => {
				  console.error("Failed to play audio after unmuting:", err)
				})
			  }
			}
			return newMuted
		})
		
	};

	return (
		<div className={`vertical-wrapper`}>
			{render && (
				<>
					<div className="top">
						<video key={render ? srcA : 'placeholderTop'} loop muted playsInline autoPlay>
							<source src={srcA} type="video/mp4"/>
							Your browser does not support the video tag.
						</video>
					</div>
					<div className="bottom">
						<video key={render ? srcB : 'placeholderBottom'} onTimeUpdate={handleTimeUpdate} loop muted playsInline autoPlay>
							<source src={srcB} type="video/mp4"/>
							Your browser does not support the video tag.
						</video>
					</div>
				</>
			)}
			{characterImage && (
				<Image
					className="character-profile"
					src={characterImage}
					alt={video.speaker}
					style={
						video.speaker === Speaker.Fish ?
						{
							bottom: 0,
							right: "10%",
							maxWidth: "80%"
						} :
						video.speaker === Speaker.Rick ?
						{
							bottom: "5%",
							left: "0%",
							maxWidth: "80%"
						} :
						video.speaker === Speaker.Omni ?
						{
							left: "0%",
							maxWidth: "80%"
						} : undefined
					}
				/>
			)}
			<div className="controls">
				<button onClick={handleToggleMute}>
					{muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
				</button>
			</div>
			<div
				className="subtitle-wrapper"
			>
				{currentSubtitle}
			</div>
			{render && (
				<audio
					onTimeUpdate={handleTimeUpdate}
					ref={audioRef}
					src={video.audioUrl}
					loop
					autoPlay
					muted={muted}
					style={{ display: "none" }}
				/>
			)}
		</div>
	)
}

export default function Home() {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [isMuted, setIsMuted] = useState(true);
	const [videos, setVideos] = useState<Video[]>([]);
	const [activeIndex, setActiveIndex] = useState<number>(0);

	const [skip, setSkip] = useState(0);
	const take = 5;

	async function loadPage(newSkip: number) {
		const data = await getFrontPage(newSkip, take);
		if (!data) return;
		// If skip=0, replace; otherwise, append
		if (newSkip === 0) {
			setVideos(data);
		} else {
			setVideos((prev) => [...prev, ...data]);
		}

		setSkip(newSkip);
	}	

	useEffect(() => {
		loadPage(0);

		const audio = audioRef.current;
		if (!audio) return;

		// Because the audio is muted, many browsers allow autoplay
		// but some (iOS Safari) may still block it until user gesture
		audio
			.play()
			.catch((err) => {
				console.warn("Audio could not autoplay on mount:", err);
			});

	}, []);

	function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
		if (!videos.length) return;
		
		if (e.deltaY > 0) {
			// Scrolling down -> next
			setActiveIndex((prev) => Math.min(prev + 1, videos.length - 1));
		} else {
			// Scrolling up -> previous
			setActiveIndex((prev) => Math.max(prev - 1, 0));
		}
	}

	useEffect(() => {
		if (activeIndex >= videos.length - 2) {
			loadPage(skip + take);
		}
	}, [activeIndex, videos.length, skip]);

	
	return (
		<div className="scroll-container" onWheel={handleWheel}>
			{
				videos.map((video, index) => {
					const offset = index - activeIndex;
					let transform = "translate(-50%, -50%) scale(0)";
					let opacity = 0;
					let zIndex = 0;
					console.log(offset);
					const shouldRender = offset === 0;

					if (offset === 0) {
						// Active
						transform = "translate(-50%, -50%) scale(1)";
						opacity = 1;
						zIndex = 2;
					} else if (offset === -1) {
						// Just above (previous)
						transform = "translate(-50%, -150%) scale(0.6)";
						opacity = 0.8;
						zIndex = 1;
					} else if (offset === 1) {
						// Just below (next)
						transform = "translate(-50%, 0%) scale(0.6)";
						opacity = 0.8;
						zIndex = 1;
					} else {
						// Far away -> hide it or push it off screen
						transform = `translate(-50%, ${offset * 100}%) scale(0.4)`;
						opacity = 0; 
						zIndex = 0;
					}
			
					return (
						<div
							key={video.id}
							className="slide-container"
							style={{
								transform,
								opacity,
								zIndex,
							}}
						>
							<DataWrapper
								muted={isMuted}
								video={video}
								setIsMuted={setIsMuted}
								audioRef={audioRef}
								render={shouldRender}
							/>
						</div>
					);			
				})
			}
		</div>
	);
}
