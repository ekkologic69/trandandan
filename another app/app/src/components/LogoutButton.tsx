import React from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";


interface LogoutButtonProps {
  cookies: Cookies;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ cookies }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear the JWT token cookie
    // cookies.remove('jwtToken', { path: '/' });
    document.cookie = 'jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // removeCookie('cookie-name',{path:'/'});

    // Additional logout actions can be added here
    // ...

    // Optional: Redirect to the login page
    navigate('/login');
  };

  return (
    <LuLogOut
      onClick={handleLogout}
      className="text-white text-xl  transition-all duration-300  items-center flex rounded-lg  cursor-pointer last:absolute ml-3 bottom-14"
    />

  );
};

export default withCookies(LogoutButton);
