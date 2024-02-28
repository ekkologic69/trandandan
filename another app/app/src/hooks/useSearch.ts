import useSWR from "swr";
import { UseProfiles } from "../types/useUserType";
import { Profile } from "../types/profile";

export const useUser = (name: string): UseProfiles => {
  const { data, error, isLoading, mutate } = useSWR("user/search/" + name);

  return {
    users: data as Profile[],
    isLoading,
    error,
    mutate,
  };
};
 