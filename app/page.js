// ynha jo content likha hai vo layout.js me jayega children bnk vhi jake webserver me chalega
// ynha jo alag alag file bnayi hai isi ko router boltehai 
// isi ko file based routing bolte hai alag alag file hai hai routing
 


import Image from "next/image";
import tea from "../app/tea.gif"
export default function Home() {
  return (
<>
  <div className="flex justify-center text-white flex-col gap-4  items-center h-[30vh]">
    <div className="font-bold text-5xl flex  "> 
      <span className="flex items-end">Buy Me a Chai</span> 
      <Image src={tea}  alt="Description of the image" width={100} />
    </div>
    <p>A crowdfunding platform for creators. Get funded by your fans and followers. Start now!</p>
    <div className="flex gap-2 ">
    <button type="button" class="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Start Here</button>
    <button type="button" class="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Read More</button>
    </div>
  </div>
  {/* ek div done */}
    <div className="bg-white h-1 opacity-10 mt-10"></div>

    <div  className="text-white container mx-auto"><h1 className="text-2xl font-bold text-center my-14">Your Fans can buy you a Chai</h1>
    <div className="flex gap-5 justify-around">
      <div className="item space-y-3 flex flex-col items-center">
        <img src="/man.gif" className="bg-slate-400 rounded-full p-2 text-black" width={88} alt="" />
        <p className="font-bold">Fans want to help</p>
      </div>
      <div className="item spaca-y-3 flex flex-col items-center ">
        <img src="/bank.webp" className="bg-slate-400 rounded-full p-2 text-black" width={88} alt="" />
        <p className="font-bold text-center">Fans want to Collabrate</p>
      </div>
      <div className="item spaca-y-3 flex flex-col items-center">
        <img src="/coin.webp" className="bg-slate-400 rounded-full p-2 text-black" width={88} alt="" />
        <p className="font-bold">Fund Yourself</p>
      </div>
     </div>
     {/* second div done */}
    <div className="bg-white h-1 opacity-10 mt-10"></div>
    </div>

<div className="text-white container mx-auto pb-32 pt-14 flex flex-col items-center justify-center">
  <h2 className="text-3xl font-bold text-center mb-14">Learn more about us</h2>
  <p className="mx-20">Get Me A Chai is a simple platform where creators can share their work and supporters can encourage them by buying a “chai.” ☕ It’s built to empower developers, artists, and changemakers with an easy, secure way to receive support, stay motivated, and keep creating without worrying about monetization</p>
</div>

  </>
  );
}

      