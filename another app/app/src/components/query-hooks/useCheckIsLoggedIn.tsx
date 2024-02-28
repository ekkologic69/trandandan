import axios from "axios";
import { useQuery, UseQueryResult } from "react-query";
import { apiUrl, User } from "../interface";

const fetchUser = () => {
  return axios
    .get<User>(`${apiUrl}user/me`, {
      withCredentials: true,
    })
    .then((response) => response.data)
    .catch();
};

function useCheckIsLoggedIn(): UseQueryResult<User> {
  return useQuery("checkIsLoggedIn", fetchUser);
}

export default useCheckIsLoggedIn;
