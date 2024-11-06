import { Inter } from "next/font/google";
import "./globals.css";
import Navic from "@/app/Navic/page";
// Uncomment if you intend to use session management
// import { SessionProvider } from "next-auth/react"; 
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Animoon - Watch free Anime Online English Sub/Dub",
  description: `Animoon is the best site to watch Anime SUB online, or you can even watch Anime DUB in HD quality. You can also find UnderRated anime on Animoon website.`,
  verification: {
    google: "x0aiWAODNGU-1UA2FXyORfyme9uWJir7mIMu8AMmLm4",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="x0aiWAODNGU-1UA2FXyORfyme9uWJir7mIMu8AMmLm4"
        />
      </head>
      <body className={inter.className}>
        {/* Google Analytics Tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y81ZRXNW2N"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Y81ZRXNW2N');
            `,
          }}
        />

        {/* Wrap children with SessionProvider if needed */}
        {/* <SessionProvider session={session}> */}
          <Navic>{children}</Navic>
        {/* </SessionProvider> */}
      </body>
    </html>
  );
}
