import React from 'react';


const Leaderboard: React.FC= () => {
  
  return (
    <div className="w-screen flex md:w-screen h-screen flex-col font-poppins gap-4 justify-center mt-[-328px] items-center bg-[#2D097F]">
        <div className=' flex flex-row items-end'>
            <div className=" w-60 h-[8rem] flex flex-col " >
                <div className='h-[20%] text-center text-white '>
                    <div className='h-[20%] flex items-center justify-center space-x-4 '>
                        <img className='rounded-full ' width={30} height={30}  src='pdp1.png'></img>
                        <p className='text-center text-white'>maboulho</p>
                    </div>
                </div>
                <div className='h-[80%] bg-violet-900 text-center items-center text-2xl text-white'>
                   #2 455
                </div>
            </div>
            <div className="w-[241.032px] h-[13rem] flex flex-col ">
                    <div className='h-[20%] flex items-center justify-center space-x-4 '>
                        <img className='rounded-full ' width={30} height={30}  src='pdp1.png'></img>
                        <p className='text-center text-white'>maboulho</p>
                    </div>
                <div className='h-[85%] bg-violet-950 text-center items-center text-2xl text-white'>
                    #1 2442
                </div>
            </div>
            <div className=" w-60 h-[6rem] flex flex-col" >
                <div className='h-[30%] flex items-center justify-center space-x-4 '>
                <img className='rounded-full ' width={30} height={30}  src='pdp1.png'></img>
                <p className='text-center text-white'>maboulho</p>
                </div>
                <div className='h-[70%] bg-violet-700 text-center  flex justify-center text-2xl text-white'>
                    #3 100
                </div>
            </div>
        </div>
        <div className=' h-12 flex  items-center justify-between bg-violet-950 rounded-xl w-[43rem]'>
            <div className=' flex items-center justify-start space-x-4  flex-shrink-0'>
                <img className='rounded-full ' width={30} height={30}  src='pdp1.png'></img>
                <p className=" text-white text-xl  font-bold font-poppins">maboulho</p>
            </div>
            <div className='text-white justify-end flex space-x-4 '>
                <p className=''>4555555555555555555</p>
                <p className='font-bold text-violet-700 font-poppins' >   #4</p>
            </div>
        </div>
        </div>
  );
};

export default Leaderboard