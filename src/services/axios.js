import axios from "axios";
import ToastComp from "../components/toast/ToastComp";
import { useSelector } from "react-redux";

const client = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export const request = async ({ token = true, ...options }, notify = true, auth_token ="") => {

  const headers = {
    Accept: "application/json",
  };

  if (token && auth_token) {
    headers.Authorization = `${auth_token}`;
  }
  const updatedOptions = {
    ...options,
    headers: {
      ...headers,
      ...options.headers, 
    },
  };

  const onSuccess = (response) => {
    if (notify) {
      const message = response.data.message || {
        delete: "Removed Successfully",
        put: "Updated Successfully",
        post: "Already Added",
        patch: "Updated Successfully",
      }[options.method] || "Added Successfully";

      ToastComp({
        variant: response.status === 200 ? "success" : "info",
        message,
      });
    }
    return response;
  };

  const onError = (error) => {
    console.log("Error In Axios interceptor: ", error);
    if (notify) {
      ToastComp({
        variant: "error",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Error! Try Again Later",
      });
    }
    return Promise.reject(error);
  };

  return client(updatedOptions).then(onSuccess).catch(onError);
};
