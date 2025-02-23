// file: global.d.ts or types/parse-srt.d.ts

declare module "parse-srt" {
	interface SRTCue {
	  id?: string;
	  start: number; // in seconds
	  end: number;   // in seconds
	  text: string;
	}
  
	export default function parseSRT(data: string): SRTCue[];
  }
  