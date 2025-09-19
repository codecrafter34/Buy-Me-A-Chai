"use client"
import React ,{useState} from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'
const Navbar = () => {
  const { data: session } = useSession()
  // if(session)console.log(session);
  const [showdropdown, setshowdropdown] = useState(false)
  // console.log(session.user.name)
  return (
  <nav className='bg-gray-950 flex justify-between items-center px-6 h-14 pt-2 text-white sticky top-0 z-30 '>



      <Link href={"/"} className=' text-lime-400'>Get Me a Chai !</Link>
      <div className='relative'>
        {session&& <><button onClick={()=>setshowdropdown(!showdropdown)}  onBlur={()=>{setTimeout(()=>{setshowdropdown(false)},1000);}} id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className=" border border-lime-400 text-lime-400 mx-4   font-medium  text-sm px-4 py-2 text-center inline-flex items-center hover:bg-lime-400 hover:text-black rounded-full transition  " type="button">Welcome, {session.user?.name|| session.user?.email?.split('@')[0] } <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
</svg>
</button>

<div id="dropdown" className={`z-10 ${showdropdown?"":"hidden"} absolute left-[70px] bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700`}>
    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
      <li>
        <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</Link>
      </li>
      <li>
        <Link href={`/${session.user.name}`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Your Page</Link>
      </li>
      
      <li>
        <Link onClick={()=>signOut()} href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</Link>
      </li>
    </ul>
</div></>
}
     
      {!session&&
      <Link href={"/login"}>
      <button type="button" className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "> Login</button>
      </Link>}
    </div></nav>

  )
}

export default Navbar
