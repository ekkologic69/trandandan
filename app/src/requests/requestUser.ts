import instance from "../api/axios";
import { User } from "../types/user";
import { UpdateEmail, UpdateUsername } from "../types/Update";

export const requestAcceptRequest = async (
  id: string,
): Promise<User | null> => {
  const response = await instance.patch(
    "/user/acceptRequest/" + id,
    {},
    { withCredentials: true },
  );
  return response.data;
};

export const requestBlock = async (id: string): Promise<User | null> => {
  const response = await instance.patch(
    "/user/block/" + id,
    {},
    { withCredentials: true },
  );
  return response.data;
};

export const requestRejectRequest = async (
  id: string,
): Promise<User | null> => {
  const response = await instance.patch(
    "/user/rejectRequest/" + id,
    {},
    { withCredentials: true },
  );
  return response.data;
};

export const requestRemoveFriend = async (id: string): Promise<User | null> => {
  const response = await instance.patch(
    "/user/removeFriend/" + id,
    {},
    { withCredentials: true },
  );
  return response.data;
};

export const requestSendRequest = async (id: string): Promise<User | null> => {
  const response = await instance.patch(
    "/user/sendRequest/" + id,
    {},
    { withCredentials: true },
  );
  return response.data;
};

export const requestUnblock = async (id: string): Promise<User | null> => {
  const response = await instance.patch(
    "/user/unblock/" + id,
    {},
    { withCredentials: true },
  );
  return response.data;
};

export const requestUpdateUserEmail = async (
  data: UpdateEmail,
): Promise<User | null> => {
  const response = await instance.patch("/user/update/email", data, {
    withCredentials: true,
  });
  return response.data;
};

export const requestUpdateUserName = async (
  data: UpdateUsername,
): Promise<User | null> => {
  const response = await instance.patch("/user/update/username", data, {
    withCredentials: true,
  });
  return response.data;
};
