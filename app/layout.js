// yhi chamak rha hai as a webserver page pr isi page me sari file add kr rhe hai
//  page.js file se jo aayega vo children me jayega vhi children vnha open hoga 
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; 
import Footer from "@/components/Footer"; 
import SessionWrapper from "@/components/SessionWrapper"; 
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Get me a Chai -Fund your Projects with chai",
  description: "This website is a crowdfunding platform for creators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className=" bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <SessionWrapper>
        <Navbar/>

        <div className= " min-h-screen   bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0)) text-white ]">
        {children}
        </div>
        <Footer/>
        </SessionWrapper>
      </body>

    </html>
  );
}
