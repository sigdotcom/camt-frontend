import axios from "axios";
import { Auth } from "aws-amplify";
import { useQuery, useMutation } from "react-query";
import { useCallback } from "react";
import { transformDynamoDbItem } from "./utils";

const fetchCurrentUser = async () => {
  const user = await Auth.currentAuthenticatedUser();
  const userSession = user.signInUserSession;

  return userSession;
};

export const useCurrentUser = (options = {}) => {
  return useQuery("users", fetchCurrentUser, options);
};

const fetchUsers = async () => {
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;

  const { data } = await axios.get(
    process.env.REACT_APP_API_URL + "/users/list",
    {
      headers: {
        Authorization: token,
      },
    }
  );

  const transformedData = data.map(transformDynamoDbItem);

  return transformedData;
};

export const useListUsers = (options = {}) => {
  return useQuery("users", fetchUsers, options);
};

const fetchUser = async (payload: { userId: string }) => {
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;

  const { data } = await axios.get(
    process.env.REACT_APP_API_URL + `users/get?userId=${payload.userId}`,

    {
      headers: {
        Authorization: token,
      },
    }
  );

  const transformedData = transformDynamoDbItem(data);

  return transformedData;
};

export const useGetUser = (userId: string, options = {}) => {
  // This callback function checks if userId is provided before fetching
  const fetchData = useCallback(async () => {
    if (!userId) return null;
    return fetchUser({ userId });
  }, [userId]);

  return useQuery(["user", userId], fetchData, options);
};
const updatePermission = async (payload: {
  userId: string;
  userRole: string;
  userPoolId: string;
  identityId: string;
}) => {
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;

  const response = await axios.post(
    process.env.REACT_APP_API_URL + "users/permissions",
    payload,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.data;
};

export const useUpdatePermission = () => {
  return useMutation(updatePermission);
};

const requestAccount = async (payload: { userId: string }) => {
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;

  const response = await axios.post(
    process.env.REACT_APP_API_URL + "users/account/request",
    payload,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.data;
};

export const useRequestAccount = () => {
  return useMutation(requestAccount);
};

const createAccount = async (payload: {
  email: string;
  userId: string;
  role: string;
  firstName: string;
  lastName: string;
}) => {
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;

  const response = await axios.post(
    process.env.REACT_APP_API_URL + "users/account/create",
    payload,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.data;
};

export const useCreateAccount = () => {
  return useMutation(createAccount);
};

const deleteAccount = async (payload: {
  userId: string;
  identityId: string;
}) => {
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;

  const response = await axios.post(
    process.env.REACT_APP_API_URL + "users/account/delete",
    payload,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.data;
};

export const useDeleteAccount = () => {
  return useMutation(deleteAccount);
};
