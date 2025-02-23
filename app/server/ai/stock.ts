"use server"

//Function to find stock info from Yahoo Finance & Stock News site 


// server/stock.ts
// server/stock.ts
import axios from 'axios';

type StockData = {
  symbol: string;
  name: string;
  currentPrice: number;
  dayHigh: number;
  dayLow: number;
  marketCap: number;
  previousClose: number;
  open: number;
};

export type StockCandle = {
	date: string;
	price: number;
}

const apiKey = process.env.POLYGON_KEY; // Ensure you have this in your environment variables,  process.env.POLYGON_KEY
const baseUrl = 'https://api.polygon.io';

// Fetch stock data from Polygon.io
async function fetchStockData(ticker: string): Promise<StockData> {
  try {
    const response = await axios.get(`${baseUrl}/v2/aggs/ticker/${ticker}/prev?apiKey=${apiKey}`);
    const data = response.data.results[0];

	return {
		symbol: ticker,
		name: ticker, // Polygon may not provide company names in this endpoint
		currentPrice: data.c,
		dayHigh: data.h,
		dayLow: data.l,
		marketCap: 0, // Market cap might require a separate API call
		previousClose: data.c,
		open: data.o,
	};
	} catch (error) {
		throw error;
	}
}

export async function fetchStockChartData(ticker: string) {
	try {
		const lastBusinessDay = ((d = new Date()) => (
			d.setDate(d.getDate() - [2, 3, 1, 1, 1, 1, 1][d.getDay()]), 
			d.toISOString().slice(0, 10)
		))();
	
		const mondayBeforeLast = ((d = new Date()) => (
			d.setDate(d.getDate() - ((d.getDay() + 6) % 7) - 7),
			d.toISOString().slice(0, 10)
		))();
		const response = await axios.get(`${baseUrl}/v2/aggs/ticker/${ticker}/range/1/day/${mondayBeforeLast}/${lastBusinessDay}?adjusted=true&sort=asc&apiKey=${apiKey}`);
	
		const results = response.data?.results ?? [];
	
		// Transform data into the shape: { name: string, value: number }
		const stockData: { name: string, value: number }[] = results.map((item: { t: number, c: number}) => {
		  const dateString = new Date(item.t).toISOString().slice(0, 10);
		  return {
			name: dateString, 
			value: item.c, // "c" is the closing price
		  };
		});
	
		// Return your new array
		return stockData;
	} catch {
		return null;
	}
}
  

// Fetch news articles related to the stock
export async function fetchNewsArticles(ticker: string) {
  try {
	  console.log(`${baseUrl}/v2/reference/news?ticker=${ticker}&apiKey=${apiKey}`)
    const response = await axios.get(`${baseUrl}/v2/reference/news?ticker=${ticker}&apiKey=${apiKey}`);
    return response.data.results || [];
  } catch (error) {
    console.error(`Error fetching news articles: ${error}`);
    throw error;
  }
}

// Generate prompt for AI model
export async function generateAIPrompt(ticker: string): Promise<string> {
	try {
		const stockData = await fetchStockData(ticker);
		const newsArticles = await fetchNewsArticles(ticker);

    // Create prompt
		const prompt = `
Stock Analysis for ${stockData.name} (${stockData.symbol}):
- Current Price: $${stockData.currentPrice}
- Day High: $${stockData.dayHigh}
- Day Low: $${stockData.dayLow}
- Market Cap: ${stockData.marketCap || 'N/A'}
Recent News:
${newsArticles.map((article: { title: string; }) => `- ${article.title}`).join('\n')}`;

		return prompt;
	} catch {
		return "";
	}
}

const tickers = [
	"AAPL",
	"MSFT",
	"AMZN",
	"NVDA",
	"RYAAY",
	"RBLX",
	"LCID",
	"C",
	"GOOGL",
	"WFC",
	"AMD",
	"NU",
	"TSLA",
	"BAC",
	"INTC",
	"META",
	"SMCI",
	"RIVN",
	"SBUX",
	"T",
	"BABA",
	"ALTM",
	"JBLU",
	"AAL",
	"JPM",
	"DAL",
	"LMT",
	"RTX",
	"DELL",
	"PLTR",
]

export async function getTickers() {
	return tickers;
}