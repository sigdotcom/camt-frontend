import axios from "axios";
import { Auth } from "aws-amplify";
import { useMutation, useQuery } from "react-query";
import { useCallback } from "react";
import { transformDynamoDbItem } from "./utils";

const fetchDevices = async () => {
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;

  const { data } = await axios.get(
    process.env.REACT_APP_API_URL + "/devices/list",
    {
      headers: {
        Authorization: token,
      },
    }
  );

  const transformedData = data.map(transformDynamoDbItem);

  return transformedData;
};

export const useListDevices = (options = {}) => {
  return useQuery("listDevices", fetchDevices, options);
};

const fetchDevice = async (payload: { deviceId: string }) => {
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;

  const { data } = await axios.get(
    process.env.REACT_APP_API_URL + `devices/get?deviceId=${payload.deviceId}`,

    {
      headers: {
        Authorization: token,
      },
    }
  );

  const transformedData = transformDynamoDbItem(data);

  return transformedData;
};

export const useGetDevice = (deviceId: string, options = {}) => {
  // This callback function checks if userId is provided before fetching
  const fetchData = useCallback(async () => {
    if (!deviceId) return null;
    return fetchDevice({ deviceId });
  }, [deviceId]);

  return useQuery(["useGetDevice", deviceId], fetchData, options);
};

const createDevice = async (payload: { deviceId: string }) => {
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;

  const response = await axios.post(
    process.env.REACT_APP_API_URL + "devices/create",
    payload,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.data;
};

export const useCreateDevice = () => {
  return useMutation(createDevice);
};

const createDeviceStream = async (payload: {
  deviceId: string;
  streamId: string;
}) => {
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;

  const response = await axios.post(
    process.env.REACT_APP_API_URL + "devices/stream/create",
    payload,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.data;
};

export const useCreateDeviceStream = () => {
  return useMutation(createDeviceStream);
};
