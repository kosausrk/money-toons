import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Finance Bro Brainrot",
	description: "Short form video optimized for the brains of gen z tech bros",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body className={`antialiased`}>
				{children}
			</body>
		</html>
	);
}
