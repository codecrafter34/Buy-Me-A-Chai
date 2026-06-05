"use client"
// ynha jo content likha hai vo layout.js me jayega children bnk vhi jake webserver me chalega
// ynha jo alag alag file bnayi hai isi ko router boltehai 
// isi ko file based routing bolte hai alag alag file hai hai routing
 

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import tea from "../app/tea.gif"

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0, totalAmount: 0, totalDonors: 0 });
  const { data: session } = useSession();

  useEffect(() => {
    // Fetch global stats
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.success) {
          setStats({ totalUsers: data.totalUsers, totalAmount: data.totalAmount, totalDonors: data.totalDonors });
        }
      } catch (error) {
        console.error("Failed to fetch stats");
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/creators?query=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        if (res.ok && data?.success) {
          setResults(data.creators || []);
        } else {
          setResults([]);
        }
      } catch (error) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
<>
  {/* HERO SECTION */}
  <div className="flex flex-col justify-center items-center text-center text-white min-h-[50vh] gap-6 px-4 pt-14">
    <div className="font-extrabold text-5xl md:text-6xl flex items-center gap-3">
      <span>Buy Me a Chai</span>
      <Image src={tea} alt="Tea Logo" width={80} />
    </div>
    <p className="text-gray-300 max-w-2xl text-lg md:text-xl">
      A platform where creators can share content, receive support, and earn from their audience.
    </p>
    <div className="flex gap-4 mt-4">
      <Link href="/login">
        <button type="button" className="bg-lime-400 text-black font-semibold rounded-lg px-6 py-3 hover:bg-lime-500 transition shadow-lg shadow-lime-400/20">
          Become a Creator
        </button>
      </Link>
      <Link href="/explore">
        <button type="button" className="bg-transparent border-2 border-gray-700 text-white font-semibold rounded-lg px-6 py-3 hover:border-lime-400 hover:text-lime-400 transition">
          Explore Creators
        </button>
      </Link>
    </div>
  </div>
  {/* SEARCH SECTION */}
  <div className="w-full max-w-2xl mx-auto mt-8 mb-20 px-4 relative">
    <div className="relative group">
      {/* Search Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-lime-400 transition-colors z-10 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search creators by username"
        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-900/80 backdrop-blur-sm text-white border border-gray-700 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 shadow-xl transition-all text-lg"
      />
    </div>

    {/* Search Results Dropdown */}
    <div className="absolute left-0 right-0 mt-2 mx-4 z-50">
      {loading && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center text-sm text-gray-400 shadow-2xl">
          Searching...
        </div>
      )}
      {!loading && query.trim() && results.length === 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center text-sm text-gray-400 shadow-2xl">
          No creators found
        </div>
      )}
      {results.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
          {results.map((creator) => (
            <Link
              key={creator._id}
              href={`/${creator.username}`}
              className="flex items-center gap-4 p-4 hover:bg-gray-800 border-b border-gray-800 last:border-0 transition-colors"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-700">
                {creator.profilepic ? (
                  <img src={creator.profilepic} alt="" className="w-full h-full object-cover" />
                ) : (
                  <img src="/das.png" alt="" className="w-full h-full object-cover opacity-50" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-lg">{creator.name || creator.username}</div>
                <div className="text-sm text-lime-400">@{creator.username}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  </div>
    {/* FEATURE SECTION */}
    <div className="bg-white h-px opacity-10 w-full mt-20"></div>

    <div className="text-white container mx-auto">
      <h1 className="text-2xl font-bold text-center my-14">Your Fans can buy you a Chai</h1>
      <div className="flex gap-5 justify-around">
        <div className="item space-y-3 flex flex-col items-center">
          <img src="/man.gif" className="bg-slate-400 rounded-full p-2 text-black" width={88} alt="" />
          <p className="font-bold">{stats.totalUsers} Users joined</p>
        </div>
        <div className="item spaca-y-3 flex flex-col items-center ">
          <img src="/bank.webp" className="bg-slate-400 rounded-full p-2 text-black" width={88} alt="" />
          <p className="font-bold text-center">{stats.totalDonors} Supporters</p>
        </div>
        <div className="item spaca-y-3 flex flex-col items-center">
          <img src="/coin.webp" className="bg-slate-400 rounded-full p-2 text-black" width={88} alt="" />
          <p className="font-bold">₹{stats.totalAmount} Raised globally</p>
        </div>
      </div>
    </div>

    <div className="bg-white h-px opacity-10 w-full mt-10"></div>

<div className="text-white container mx-auto pb-32 pt-14 flex flex-col items-center justify-center">
  <h2 className="text-3xl font-bold text-center mb-14">Learn more about us</h2>
  <p className="mx-20">Get Me A Chai is a simple platform where creators can share their work and supporters can encourage them by buying a “chai.” ☕ It’s built to empower developers, artists, and changemakers with an easy, secure way to receive support, stay motivated, and keep creating without worrying about monetization</p>
</div>

  </>
  );
}

      
