"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const Explore = () => {
    const [creators, setCreators] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCreators = async () => {
            try {
                const res = await fetch('/api/explore')
                const data = await res.json()
                if (data.success) {
                    setCreators(data.creators)
                }
            } catch (error) {
                console.error("Failed to fetch creators", error)
            } finally {
                setLoading(false)
            }
        }
        fetchCreators()
    }, [])

    return (
        <div className="container mx-auto px-4 py-10 min-h-screen text-white">
            <h1 className="text-4xl font-bold text-center mb-10 text-lime-400">Explore Creators</h1>
            
            {loading ? (
                <div className="text-center text-xl text-gray-400">Loading creators...</div>
            ) : creators.length === 0 ? (
                <div className="text-center text-xl text-gray-400">No creators found yet.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {creators.map((creator, index) => (
                        <Link href={`/${creator.username}`} key={creator._id}>
                            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-lime-400 transition-all shadow-lg hover:shadow-lime-500/20 relative group">
                                
                                {/* Popular Badge for the top creator */}
                                {index === 0 && (
                                    <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                                        🔥 Popular
                                    </div>
                                )}

                                {/* Cover Photo */}
                                <div className="h-32 w-full bg-gray-800 overflow-hidden relative">
                                    <img 
                                        src={creator.coverpic || "/das.png"} 
                                        alt="Cover" 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                
                                {/* Profile Info */}
                                <div className="px-4 pb-5 relative">
                                    {/* Profile Pic overlapping cover */}
                                    <div className="w-20 h-20 rounded-full border-4 border-gray-900 overflow-hidden absolute -top-10 left-4 bg-gray-800">
                                        <img 
                                            src={creator.profilepic || "/das.png"} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    
                                    <div className="pt-12">
                                        <h2 className="text-xl font-bold truncate">{creator.name || creator.username}</h2>
                                        <p className="text-gray-400 text-sm mb-3">@{creator.username}</p>
                                        
                                        <div className="flex items-center gap-2 mt-4">
                                            <span className="bg-lime-400 text-black text-xs font-bold px-3 py-1.5 rounded-md">
                                                ₹{creator.totalRaised || 0} Raised
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Explore
