import React from 'react';


const Signin:React.FC = () => {

    return(
        <>
        <div className='bg-[#150142] h-screen'>
            <div>
                <img src="Pongo-logo 1.png"/>
            </div>
            <div className='flex  gap-9 items-center  flex-col '>
            <div className='text-4xl text-white m-8 font-poppins'>
                <span> Welcome Salma</span>
            </div>
            <div>
                <img className='rounded-full'  src="pdp1.png"/>
            </div>
            <form>
                <label className='text-white text-1xl font-poppins'>Nickname</label><br/>
                <input className='rounded-lg border-2 bg-[#2D097F] px-10 py-2 text-white  font-poppins' type="text" required ></input><br/>
                <label className='text-white text-1xl font-poppins'>Two-factor authentication</label>
            </form>
            </div>
        </div>
        </>
    )
}
export default Signin