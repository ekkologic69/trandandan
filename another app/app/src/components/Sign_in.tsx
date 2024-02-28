import React from 'react';
import ImageInput from './imageinput';

const Signin: React.FC = () => {
  const handleImageChange = (image: string) => {
    // Handle the image change here (e.g., save to state, send to server, etc.)
    console.log('Image changed:', image);
  };

  return (
    <>
      <div className="bg-[#150142] h-screen grid font-poppins grid-cols">
        <div className="md:col-span-1 md:order-1">
          <div className="flex p-4">
            <img src="Pongo-logo 1.png" alt="Logo" />
          </div>
        </div>
        <div className="md:col-span-1 md:order-2">
          <div className="flex flex-col items-center p-8 mt-[-151.5px] justify-center h-full">
            <div className="text-4xl text-white p-8 font-poppins">
              <span> Welcome </span>
            </div>
            <form action='' method='post' className="flex flex-col  text-white text-1xl  gap-3 font-poppins">
            <div className='flex items-center justify-center'>
              <ImageInput onImageChange={handleImageChange} />
            </div>
              <label className="text-left" >Nickname</label>
              <input
                type="text"
                placeholder="Type here"
                className="input bg-[#2D097F] font-poppins text-white input-bordered w-full max-w-xs"
              />
              <label className="label cursor-pointer space-x-2">
                <input
                  type="checkbox"
                  className="toggle toggle-primary h-6 "
                  defaultChecked={false}
                />     
               <span > Two-factor authentication</span>
              </label>
            <button type="submit" name='sign-in submit' className='rounded-xl bg-orange-500 '>save</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
