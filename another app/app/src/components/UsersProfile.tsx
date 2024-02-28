import React, { useState } from 'react';
import { IoPersonAddOutline } from "react-icons/io5";
import { MdOutlineDownloadDone } from 'react-icons/md';
import { FaUserSlash } from "react-icons/fa";
import LoadingSpinner from "./loading";
import { useUser } from "../hooks/useUser";





const UserProfile : React.FC = () => {
  const { user, error, isLoading, mutate } = useUser();
  console.log(user);
  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  if (error) {
    return <div>Error:</div>;
  }
  mutate;

      const [isClicked, setIsClicked] = useState(false);
      const [isBlocked,setIsBlocked] = useState(false);
      const handleBlock =() => {
        setIsBlocked(!isBlocked);
      }
      const handleClick = () => {
        setIsClicked(!isClicked); // Change state to true when clicked
      };
    return(
        <>
        <div className='w-screen flex md:w-screen  flex-col  gap-4 justify-center font-poppins items-center bg-[#2D097F]'>
          {user && (
            <div className='items-center font-bold text-white gap-3 flex flex-col '>
              <img className="w-32 h-32 rounded-full" src={user.avatarUrl} alt="User Avatar" />
              <p>{user.name}</p>
              <p className='text-center text-violet-700  text-2xl font-bold font-Poppins'>{user.rank}</p>
              <div className='flex items-center gap-2'>

                    <div className='flex  gap-x-3 p-2 cursor-pointer rounded-xl bg-[#ff7e03] text-white font-poppins text-center  'onClick={handleClick}>
                      {isClicked  ? (
                        <>
                        <p>cancel</p>
                        <MdOutlineDownloadDone className="text-black h-6"  />
                        </>
                        ) :(
                          <>
                          <p>add friend</p>
                        <IoPersonAddOutline className ="text-black h-6" />
                          </>
                      )
                    }
                    </div>
                    <div className={`flex text-center gap-x-3  rounded-xl cursor-pointer p-3 font-poppins items-center  ${isBlocked ? ' bg-red-700 hover:bg-gray-700' :'bg-gray-700 hover:bg-red-700' } `} onClick={handleBlock}>
                      {isBlocked ? (
                        <>
                          <p>Unblock</p>
                          <FaUserSlash />
                        </>
                      ):(
                        <>
                          <p>Block</p>
                          <FaUserSlash />
                        </>
                      )
                    }

                    </div>
              </div>
            </div>
          )}
          <div className='flex '>
            <div className='flex flex-col items-center w-[63rem] h-80 bg-zinc-300 bg-opacity-0 rounded-lg border border-violet-700'>
              <div className='w-[60rem] m-8 h-12 bg-violet-950 rounded-3xl flex items-center justify-between space-x-4  flex-shrink-0'>
                <div className='flex space-x-4'>
                  <p className="text-white text-xl  font-bold font-poppins">{user?.name}</p>
                  <img className='rounded-full ' width={30} height={30} src={user?.avatarUrl} alt="User Avatar" />
                </div>
                <div className='flex space-x-4'>
                  <img className='rounded-full justify-end ' width={30} height={30} src='pdp1.png' alt="User Avatar" />
                  <p className="text-white text-xl  font-bold font-poppins">maboulho</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
};
export default UserProfile