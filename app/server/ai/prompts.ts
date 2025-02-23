//From the generated prompt, make a call to Gemini to make audi transcript (Peter Griffin )


//sample test 
//sample output 
/**
 * Okay, here's a transcript and a description of a potential video output of Peter Griffin talking about AAPL stock, incorporating his usual humor and personality.

Audio Transcript:

(Sound of Peter slurping a beer, followed by a dramatic fanfare)

Peter: Alright, alright, settle down, you magnificent bastards! It's your ol' pal Peter Griffin here, ready to dive headfirst into the thrilling world of... checks notes ...AAPL? Is that an acronym for Apple Pie or something? Because if it is, I'm IN.

(Sound of Peter crunching on something loudly)

Peter: Okay, so apparently this AAPL, ahem, "stock" thingy is trading at... holy crap, two hundred and forty-five dollars and fifty-five cents?! For one apple? Lois, we could sell the kids! Wait, that's probably not legal... or is it? Eh, nevermind.

(Sound of awkward cough)

Peter: Anyway, it seems like the apple... I mean, AAPL... reached a high of two hundred and forty-eight dollars and sixty-nine cents today! High? Like when I accidentally ate those brownies Aunt Carol made? Good times... blurry times. And the low... two forty-five and twenty-two cents. So basically, it's bounced around like Joe Swanson after a few too many martinis.

(Sound of Joe Swanson impression - "Giggity giggity! Whoa! I'm fallin'!")

Peter: And get this! The Market Cap is... N/A? N/A?!? Does that mean they ran out of apples? Because if they did, I've got a tree in my backyard that produces apples so sour they could make Brian cry... which, let's be honest, is a weekly occurrence.

(Sound of Brian whimpering)

Peter: Now, the "news"! Apparently, Warren Buffett's got something to do with this. Warren Buffett! He's like the Gandalf of finance! Except instead of a beard of wisdom, he's got... well, a beard of money, I guess. He's got a "No-Brainer Stock to Buy" that’s supposedly not AAPL. Betrayal!!

Peter: And then there's something about Roku? Setting you up for life? Is this how I finally get to buy that solid gold recliner I've always wanted? Probably not. And AI stuff, and Generative AI, and risks… zzzz.

(Sound of Peter snoring loudly, then abruptly waking up)

Peter: Oh! Sorry, dozed off there. AI makes my brain hurt. Even more than Meg does. Ha! Burn. They’re talking about Broadcom, Microsoft, Metaverse, Warren Buffett selling investments… Oh, for the love of…

(Sound of Peter ripping up paper)

Peter: Look, I'm not a financial advisor! I'm just a fat guy with a beer and a questionable understanding of the stock market. Should you buy AAPL? I don't know! Should I buy AAPL? Probably not, I still need to pay the electric bill. Is Beem going to choose Crypto over VC for growth? What the heck is a Beem?!

(Sound of Peter sighing heavily)

Peter: My advice? Buy beer. Beer never crashes. Unless you drink too much, then you crash. But hey, at least you had a good time! That’s Peter Griffin’s Financial Hour. I’ll be here next week when I’m forced to do this again.

(Outro music - a jaunty, slightly off-key rendition of a financial news jingle)


 * 
 * 
 */

import axios from 'axios';
import * as fs from 'fs';


const geminiApiKey = ''; // Use your Gemini API key here
const geminiApiUrl = 'https://api.gemini.com/v1/text-to-speech'; // Endpoint to generate TTS

// Sample prompt (Replace this with your actual generated prompt from your application)
const prompt = `
    Stock Analysis for AAPL (AAPL):
    - Current Price: $245.55
    - Day High: $248.69
    - Day Low: $245.22
    - Market Cap: N/A

    Recent News:
    - 1 No-Brainer Warren Buffett Stock to Buy Right Now
    - Could Buying Roku Stock Today Set You Up for Life?
    - If I Could Only Buy 1 Warren Buffett Artificial Intelligence (AI) Stock, This Would Be It (Hint: It's Not Apple)
    - This Tech Giant Is Making Big Moves With Generative AI, but Here Are 3 Risks Investors Need to Know About
    - Billionaire Investor Stanley Druckenmiller Just Sold Broadcom and Microsoft and Piled Into These "Magnificent Seven" Stocks Instead
    - Why Did Warren Buffett Just Sell Investments He's Recommended Millions of Others Buy?
    - Is the Fidelity Yield Enhanced Equity ETF's Promise Too Good to Ignore? Understanding the Risks of This Fidelity Options Income ETF
    - 60% of Warren Buffett's $299 Billion Portfolio at Berkshire Hathaway Is Invested in These 4 Magnificent Stocks
    - 1 Supercharged Growth ETF I'm Buying Hand Over Fist Right Now
    - Beem Becomes the First Venture-Backed Metaverse Startup to Choose Crypto Over VC for Growth
`;

// Function to generate audio file using Gemini API
async function generateAudioFromPrompt(prompt: string) {
  try {
    const response = await axios.post(
      geminiApiUrl,
      {
        text: prompt,
        voice: 'peter_griffin', // Specifying the "Peter Griffin" voice
        format: 'mp3',          // Audio format (mp3)
        api_key: geminiApiKey   // Gemini API Key
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Assuming the response contains the audio file as binary data (in MP3 format)
    const audioBuffer = response.data; // Audio content from the Gemini API response

    // Save the audio data to an MP3 file
    fs.writeFileSync('output_peter_griffin.mp3', audioBuffer);
    console.log("Audio file generated and saved as 'output_peter_griffin.mp3'");

  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Call the function with the prompt
generateAudioFromPrompt(prompt);
