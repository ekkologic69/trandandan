import React from 'react';


const Signin:React.FC = () => {

    return(
        <>
        <div className='bg-[#150142] h-screen'>
            <div>
                <img src="Pongo-logo 1.png"/>
            </div>
            <div className='flex  gap-9 items-center justify-center   flex-col '>
            <div className='text-4xl text-white m-8 font-poppins'>
                <span> Welcome </span>
            </div>
            <div>
                <img className='rounded-full'  src="pdp1.png"/>
            </div>
            <form className=''>
                <label className='text-white text-1xl font-poppins'>Nickname</label><br/>
                <input type="text" placeholder="Type here" className="input bg-[#2D097F] font-poppins text-white input-bordered w-full max-w-xs" />
                    <label className="label cursor-pointer">
                    <input type="checkbox" className="toggle toggle-primary h-6 " defaultChecked={false} /><br/>
                    <label className='text-white text-1xl font-poppins'>Two-factor authentication</label>  
                    </label>
            </form>
            </div>
         
        <div className='flex left-full justify-end w-full'>
            <img src='login2.png' />
            </div>
        </div>
        </>
    )
}
export default Signin