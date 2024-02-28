import React, { useState } from 'react';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { FaUserSlash } from "react-icons/fa";
import ChatIcon from '@mui/icons-material/Chat';
import { FaTableTennisPaddleBall } from "react-icons/fa6";


const Friends: React.FC = () => {
  const [activeTab, setActiveTab] = useState(1 );
  const [isBlocked,setIsBlocked] = useState(false);
  const handleBlock =() => {
    setIsBlocked(!isBlocked);
  }


  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return ( 
    <>
    <div className="  w-screen p-8 font-poppins">
    <div className='justify-center gap-2 flex flex-row border-b'>
  <div className={`text-3xl font-poppins text-white inline-block p-4 border-x-4 border-transparent rounded-t-lg cursor-pointer hover:bg-[#693DCE] hover:text-[#2D097F] ${activeTab === 1 ? 'bg-[#693DCE] text-white' : ''}`} onClick={() => handleTabClick(1)}>friends</div>
  <div className={`text-white text-3xl font-poppins inline-block p-4 border-x-4 border-transparent rounded-t-lg cursor-pointer hover:bg-[#693DCE] hover:text-[#2D097F] ${activeTab === 2 ? 'bg-[#693DCE] text-white' : ''}`} onClick={() => handleTabClick(2)}>blocked</div>
</div>

            <div className={activeTab === 1 ? "flex flex-col text-white text-3xl ": "hidden"}>
                    <div className='   h-[53rem] lg:h-[33rem]  '>
                      <div className='grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
                          <div className=' flex flex-col rounded-lg   '>
                            <div className=' w-16 h-16  self-center  '>
                              <img className='fixed border rounded-full mt-[35px]' width={70} height={70} src="https://cdn.intra.42.fr/users/ee249056257c97aaabf8036f36591fc0/ylarhris.JPG" alt="" />
                            </div>
                            <div className='bg-[#150142] gap-6 flex flex-col rounded-lg h-36 '>
                              <div className=' flex flex-row  justify-between h-[80%]  text-center items-center text-2xl text-white'>
                                  <p className='text-white'>maboulho</p>
                                  <p className='text-white'>#1</p>
                              </div>
                            <div className=' flex flex-row justify-center gap-7'>
                                <ChatIcon sx={{ fontSize: 30 }} className='text-[#150142] w-8 h-8 rounded-full bg-[#693DCE] '/>
                                <FaTableTennisPaddleBall className='w-8 h-8 text-[#150142] rounded-full bg-[#693DCE]'/>
                                <PersonRemoveIcon sx={{ fontSize: 30 }} className='text-[#150142] w-8 h-8 rounded-full bg-[#693DCE]'/>
                                <FaUserSlash className='text-[#150142] rounded-full w-8 h-8 bg-[#693DCE]'/>
                              </div>
                            </div>
                          </div>
                      </div>
                    </div>
            </div>
            <div className={activeTab === 2 ? "flex flex-col text-white text-3xl": "hidden"}>
               <div className='h-[53rem] lg:h-[33rem]'>
                      <div className='grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
                      {/* Repeat this div for each item */}
                          <div className='flex flex-col rounded-lg'>
                            <div className='w-16 h-16 self-center'>
                              <img className='fixed border rounded-full mt-[35px]' width={70} height={70} src="https://cdn.intra.42.fr/users/ee249056257c97aaabf8036f36591fc0/ylarhris.JPG" alt="" />
                            </div>
                            <div className='bg-[#150142]  flex flex-col  rounded-lg h-36'>
                              <div className='flex flex-row  justify-between h-[80%]  text-center items-center text-2xl text-white'>
                                <p className='text-white text-start'>maboulho</p>
                                <p></p>
                              </div>
                                  <div className={`flex text-center  justify-center rounded-xl cursor-pointer p-3 font-poppins items-center  ${isBlocked ? ' bg-red-700 hover:bg-gray-700' :'bg-gray-700 hover:bg-red-700' } `} onClick={handleBlock}>
                                      {isBlocked ? (
                                        <>
                                          <p>Block</p>
                                          <FaUserSlash />
                                        </>
                                      ):(
                                        <>
                                          <p>Unblock</p>
                                          <FaUserSlash />
                                        </>
                                      )
                                    }

                                  </div>
                            </div>
                          </div>
                          {/* Repeat this div for each item */}
                        </div>
                   </div>
            </div>
    </div>
    </>
  );
};

export default Friends;
