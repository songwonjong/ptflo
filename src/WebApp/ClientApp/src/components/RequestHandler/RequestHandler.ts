import axios, { AxiosResponse } from "axios";

export type HttpMethod = "get" | "put" | "post" | "delete";

export type Dictionary = {
  [key: string]: any;
};

export const AxiosGet = async (url: string, params: {}) => {
  const { data, statusText } = await axios({
    url,
    method: "GET",
    params,
  });
  if (statusText === "OK") {
    return data;
  } else {
    return "error";
  }
};

export const post: (url: string, param: {}) => any = async (url, param) => {
  const result = await requestHandler<AxiosResponse<any>>("post", url, param);
  return result && result.data ? result.data : null;
};

export const put: (url: string, param: {}) => any = async (url, param) => {
  const result = await requestHandler<AxiosResponse<any>>("put", url, param);
  return result && result.data ? result.data : null;
};

export const get: (url: string, param?: {}) => any = async (url, param?) => {
  const result = await requestHandler<AxiosResponse<any>>(
    "get",
    url,
    param || {}
  );
  return result && result.data ? result.data : null;
};

const requestHandler: <T>(
  method: HttpMethod,
  url: string,
  params: {} | []
) => Promise<T> = (method, url, params) => {
  if (!url.startsWith("/api"))
    url = `/api${!url.startsWith("/") ? "/" + url : url}`;

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
  };

  switch (method) {
    case "get":
      return axios.get(url, { params, headers: headers });
    case "put":
      return axios.put(url, params, { headers: headers });
    case "post":
      return axios.post(url, params, { headers: headers });
    case "delete":
      return axios.post(url, params, { headers: headers });
  }
};
export default requestHandler;