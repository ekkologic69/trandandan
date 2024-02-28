import React, { useState } from 'react';
import { useUser } from "../hooks/useUser";
import LoadingSpinner from "./loading";
import { useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import ImageInput from './imageinput';
import axios from 'axios';

const Profile: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, error, isLoading, mutate } = useUser();

  const handleEditProfileClick = () => {
    onOpen();
    console.log(user.avatarUrl); // Open the modal when "edit profile" button is clicked
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error</div>;
  }

  mutate;

  const [avatar, setAvatar] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>('');
  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(false);

  const handleImageChange = (image: string) => {
    setAvatar(image);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    if (avatar) {
      formData.append('avatar', avatar);
      
    }
    formData.append('nickname', nickname);
    formData.append('twoFactorAuth', String(twoFactorAuth));

    try {
      
      const response = await axios.post('http://localhost:3080/user/uploadAvatar', formData, {
        withCredentials: true, // Include credentials in the request
      });
  
      if (response.status === 200) {
        console.log('Avatar uploaded successfully');
        onClose(); // Close the modal after successful submission
        // Handle success, e.g., show a success message to the user
      } else {
        console.error('Failed to upload avatar');
        // Handle failure, e.g., show an error message to the user
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      // Handle error, e.g., show an error message to the user
    }
  };

  return (
    <>
      <div className='w-screen flex md:w-screen font-poppins flex-col  gap-4 justify-center  items-center bg-[#2D097F]'>
        {user && (
          <div className='items-center font-bold text-white flex flex-col '>
            <img className="w-32 h-32 rounded-full" src={user.avatarUrl} alt="User Avatar" />
            <p>{user.name}</p>
            <p className='text-center text-violet-700 text-2xl font-bold font-Poppins'>{user.rank}</p>
            <button className='w-60 h-12 bg-violet-950 rounded-3xl' onClick={handleEditProfileClick}>Edit Profile</button>
          </div>
        )}

        {/* Modal Component */}
        
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
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay className="fixed inset-0  bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center" />
        <ModalContent bg={"violet-950"} width={"80vh"} height={"70dvh"} className=' bg-[#150142]  flex items-center justify-center'>
          <ModalHeader textColor={"white"}>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit} className="flex flex-col text-white text-1xl gap-3 font-poppins">
              <div className='flex items-center justify-center'>
                <ImageInput onImageChange={handleImageChange} />
              </div>
              <label htmlFor="nickname">Nickname</label>
              <input
                type="text"
                id="nickname" // Added id attribute
                name="nickname" // Added name attribute
                placeholder="Type here"
                className="input bg-[#2D097F] font-poppins text-white input-bordered w-full max-w-xs"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <label className="label cursor-pointer space-x-2">
                <input
                  type="checkbox"
                  id="twoFactorAuth" // Added id attribute
                  name="twoFactorAuth" // Added name attribute
                  className="toggle toggle-primary h-6"
                  checked={twoFactorAuth}
                  onChange={(e) => setTwoFactorAuth(e.target.checked)}
                />
                <span>Two-factor authentication</span>
              </label>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>Close</Button>
            {/* Change button type to submit */}
            <Button colorScheme="orange" variant="solid" type="submit" onClick={onClose}>Save Changes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Profile;

