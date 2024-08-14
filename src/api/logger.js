import axios from "axios";
const API_URL = process.env.REACT_APP_API;

export const logToServer = async (
  Module,
  ControllerName,
  MethodName,
  LogLevel,
  LogMessage,
  jsonPayload,
  loginUser,
  Company_Id,
  form_id
) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  const user = loginUser ? loginUser : "";

  const requestBody = {
    Module,
    ControllerName,
    MethodName,
    LogLevel,
    LogMessage,
    jsonPayload,
    LoginUser: user,
    Company_Id,
    form_id,
  };
  try {
    const response = await axios.post(`${API_URL}VMS/SaveAPILog`, requestBody);
    responseBody.responseData = response.data[0];
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    return responseBody;
  }
};
export const logAPI = async (
  cid,
  Module,
  loglevel,
  userlog,
  LoginUser,
  fdate,
  tdate
) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };

  const requestBody = {
    cid,
    Module,
    viewname: "",
    methodname: "",
    loglevel,
    userlog,
    LoginUser,
    fdate,
    tdate,
  };
  try {
    const response = await axios.post(`${API_URL}VMS/GetAPILog`, requestBody);
    responseBody.responseData = response.data;
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.StatusMsg || error.response?.data?.errors;
    return responseBody;
  }
};
