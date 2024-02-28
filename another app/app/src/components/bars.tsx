import Sidebar from './Sidebar'
import { Outlet, useNavigate } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";
import { useUser } from "../hooks/useUser";
import LoadingSpinner from './loading';
import { useState,useEffect } from 'react';
import axios from 'axios';





const Bars : React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  useEffect(() => {
  const handleSearchSubmit = async () => {
    try {
      const response = await axios.get(`http://localhost:3080/user/search/${searchInput}`,{withCredentials: true});
      setSearchResults(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };
  handleSearchSubmit()
},[searchInput])
  const navigate = useNavigate()
  const { user, error, isLoading, mutate } = useUser();
  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  if (error) {
    return <div>Error:</div>;
  }
  mutate;
  return (
    <div className='bg-[#2D097F] h-screen  w-screen'>
     <div className=" md:min-w-0 mr-10 items-center flex flex-col justify-center p-4 h-20 w-[80%]  md:flex">
              <div className=' w-30 items-center flex-col gap-20 left-52 absolute bg-[#693DCE] border  rounded-full border-[#693DCE] '>
                  <input
                      id="desktop-search"
                      type="search"
                      value={searchInput}
                      onChange={handleSearchInputChange}
                      placeholder="Search"
                      className="block w-30 h-10 relative z-10 rounded-full border-none outline-0 placeholder-[#150142] bg-[#693DCE] font-poppins text-white"
                    />
                      <div className='absolute pt-16 -top-3 flex flex-col gap-2 bg-[#693DCE] rounded-lg '>
                        {searchInput && searchResults.length === 0 ? (
                          <div className='bg-[#693DCE] text-white font-poppins justify-center items-center text-xl rounded-lg h-16 flex gap-3 w-[17vw]'>
                            No results found
                          </div>
                        ) : (
                          searchResults.map((user) => (
                            <div className='bg-[#693DCE] flex gap-3 w-[17vw]' key={user.id}>
                              <img className='rounded-full' width={40} height={40} src={user.avatarUrl} alt='' />
                              <div className='text-white font-poppins text-lg'>{user.name}</div>
                            </div>
                          ))
                        )}
                      </div>
              </div>
        </div>
        <div className='fixed top-0 right-0 h-full flex flex-col gap-y-5 w-[15%] text-white p-4 '>
            <div className='flex ms-[5.5rem]  gap-x-2 text-xl items-center font-poppins  cursor-pointer' onClick={() => navigate("/profile")} >
              <p>{user?.name}</p>
              <img className='rounded-full' width={40} height={40} src={user?.avatarUrl} alt="" />
            </div>
              <div className="bg-glass h-[70%] w-[5rem] transition-all relative border  border-solid rounded-full border-glass ms-[8.5rem] flex flex-col items-center">
                <div className=''>
                  <img className='rounded-full' width={45} height={45} src="https://cdn.intra.42.fr/users/ee249056257c97aaabf8036f36591fc0/ylarhris.JPG" alt=""  />
                </div>
               </div>
        </div>
    <div className='  h-[85%] w-[85%] object-cover flex items-center'>
        
        <Sidebar/>
        
        <Outlet/>
    </div>
    
    </div>
  )
}

export default Bars
