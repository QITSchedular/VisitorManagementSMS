import axios from "axios";
import { logToServer } from "./logger";
import { saveNotification } from "./notification";
const API_URL = process.env.REACT_APP_API;

export const requestAddressFromPin = async (pinCode) => {
  try {
    const response = await axios.get(
      `https://api.postalpincode.in/pincode/${pinCode}`
    );

    const responseData = response.data;
    return responseData;
  } catch (error) {
    console.log(error);
  }
};

// get department data
export const GetCmpDept = async (cid) => {
  const storedSessionValue = JSON.parse(sessionStorage.getItem("authState"));

  const { access, refresh, user, userAuth, expirationTime } =
    storedSessionValue;
  const responseBody = {
    responseData: null,
    hasError: false,
    error: null,
  };
  //return null;
  try {
    const response = await axios.get(
      `${API_URL}VMS/Department/GetByCid/${cid}`
    );
    responseBody.responseData = response.data;
    await logToServer(
      "User Settings",
      "dept_master",
      "GetAllDeptByCId",
      "I",
      "SuccessFully get department Data...",
      JSON.stringify(cid),
      user.e_mail,
      user.cmpid,
      responseBody.responseData.APICode
    );
    return responseBody;
  } catch (error) {
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.StatusMsg ||
      error.message ||
      error.response?.data?.errors;
    responseBody.hasError = true;
    await logToServer(
      "User Settings",
      "dept_master",
      "GetAllDeptByCId",
      "E",
      "UnSuccessFully get department Data...",
      JSON.stringify(cid),
      user.e_mail,
      user.cmpid,
      error.response?.data?.APICode
    );
    return responseBody;
  }
};

// save user data
export const SaveUserData = async (reqPayload) => {
  const storedSessionValue = JSON.parse(sessionStorage.getItem("authState"));

  const { access, refresh, user, userAuth, expirationTime } =
    storedSessionValue;
  const responseBody = {
    responseData: null,
    hasError: false,
    error: null,
  };
  //return null;
  try {
    const response = await axios.post(`${API_URL}VMS/User/Save`, reqPayload);
    responseBody.responseData = response.data;
    saveNotification(
      "User Settings",
      reqPayload.sender_email,
      reqPayload.sender_role,
      `${reqPayload.username} profile has been successfully created in the ${reqPayload.deptName} department`,
      reqPayload.company_id
    );
    await logToServer(
      "User Settings",
      "user_master",
      "save_user",
      "S",
      "SuccessFully save user Data...",
      JSON.stringify(reqPayload),
      user.e_mail,
      user.cmpid,
      responseBody.responseData.APICode
    );
    return responseBody;
  } catch (error) {
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.StatusMsg ||
      error.message ||
      error.response?.data?.errors;
    responseBody.hasError = true;
    await logToServer(
      "User Settings",
      "user_master",
      "save_user",
      "E",
      "UnSuccessFully save user Data...",
      JSON.stringify(reqPayload),
      user.e_mail,
      user.cmpid,
      error.response?.data?.APICode
    );
    return responseBody;
  }
};

// get user data
export const GetAllUser = async (cid) => {
  const storedSessionValue = JSON.parse(sessionStorage.getItem("authState"));

  const { access, refresh, user, userAuth, expirationTime } =
    storedSessionValue;
  const responseBody = {
    responseData: null,
    hasError: false,
    error: null,
  };
  //return null;
  try {
    const response = await axios.get(`${API_URL}VMS/User/Get/ALL/${cid}`);
    responseBody.responseData = response.data;
    await logToServer(
      "User Settings",
      "user_master",
      "get_user",
      "I",
      "SuccessFully Get user Data...",
      JSON.stringify(cid),
      user.e_mail,
      user.cmpid,
      responseBody.responseData.APICode
    );
    return responseBody;
  } catch (error) {
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.StatusMsg ||
      error.message ||
      error.response?.data?.errors;
    responseBody.hasError = true;
    await logToServer(
      "User Settings",
      "user_master",
      "get_user",
      "E",
      "UnSuccessFully Get user Data...",
      JSON.stringify(cid),
      user.e_mail,
      user.cmpid,
      error.response?.data?.APICode
    );
    return responseBody;
  }
};

// Update user data
export const EditUser = async (reqBody) => {
  const storedSessionValue = JSON.parse(sessionStorage.getItem("authState"));
  const { access, refresh, user, userAuth, expirationTime } =
    storedSessionValue;
  const responseBody = {
    responseData: null,
    hasError: false,
    error: null,
  };
  //return null;
  try {
    const response = await axios.put(`${API_URL}VMS/User/Update`, reqBody);

    responseBody.responseData = response.data;
    saveNotification(
      "User Settings",
      reqBody.sender_email,
      reqBody.sender_role,
      `Password successfully updated for ${reqBody.username}`,
      reqBody.company_id
    );
    await logToServer(
      "User Settings",
      "user_master",
      "update_user",
      "S",
      "SuccessFully Edit Data...",
      JSON.stringify(reqBody),
      user.e_mail,
      user.cmpid,
      responseBody.responseData.APICode
    );
    return responseBody;
  } catch (error) {
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.StatusMsg ||
      error.message ||
      error.response?.data?.errors;
    responseBody.hasError = true;
    await logToServer(
      "User Settings",
      "user_master",
      "update_user",
      "E",
      "UnSuccessFully Edit Data...",
      JSON.stringify(reqBody),
      user.e_mail,
      user.cmpid,
      error.response?.data?.APICode
    );
    return responseBody;
  }
};

// get company profile data
export const GetCmpDetail = async (cid) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    error: null,
  };
  //return null;
  const storedSessionValue = JSON.parse(sessionStorage.getItem("authState"));

  const { access, refresh, user, userAuth, expirationTime } =
    storedSessionValue;
  try {
    const response = await axios.get(`${API_URL}VMS/GetComapnyDataById/${cid}`);
    responseBody.responseData = response.data;
    await logToServer(
      "Profile",
      "company_master",
      "GetComapnyDataById",
      "I",
      "SuccessFully Get Data...",
      JSON.stringify(cid),
      user.e_mail,
      user.cmpid,
      responseBody.responseData?.APICode
    );
    return responseBody;
  } catch (error) {
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.StatusMsg ||
      error.message ||
      error.response?.data?.errors;
    responseBody.hasError = true;
    await logToServer(
      "Profile",
      "company_master",
      "GetComapnyDataById",
      "E",
      "UnSuccessFully Get Data...",
      JSON.stringify(cid),
      user.e_mail,
      user.cmpid,
      error.response?.data?.APICode
    );
    return responseBody;
  }
};

export const UpdateCmpData = async (reqPayload) => {
  const storedSessionValue = JSON.parse(sessionStorage.getItem("authState"));

  const { access, refresh, user, userAuth, expirationTime } =
    storedSessionValue;
  const responseBody = {
    responseData: null,
    hasError: false,
    error: null,
  };
  //return null;
  try {
    const response = await axios.put(`${API_URL}VMS/Company/Edit`, reqPayload);
    responseBody.responseData = response.data;
    saveNotification(
      "Profile",
      reqPayload.sender_email,
      reqPayload.sender_role,
      `${reqPayload.bname} profile has been updated`,
      reqPayload.company_id
    );
    await logToServer(
      "Profile",
      "company_master",
      "EditComapnyDataById",
      "S",
      "SuccessFully Edit Data...",
      JSON.stringify(reqPayload),
      user.e_mail,
      user.cmpid,
      responseBody.responseData?.APICode
    );
    return responseBody;
  } catch (error) {
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.StatusMsg ||
      error.message ||
      error.response?.data?.errors;
    responseBody.hasError = true;
    await logToServer(
      "Profile",
      "company_master",
      "EditComapnyDataById",
      "E",
      "UnSuccessFully Edit Data...",
      JSON.stringify(reqPayload),
      user.e_mail,
      user.cmpid,
      error.response?.data?.APICode
    );
    return responseBody;
  }
};

// get company profile data
export const GetUserDetail = async (cid, uid) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    error: null,
  };
  //return null;
  try {
    const response = await axios.get(
      `${API_URL}VMS/User/GetById/${cid}/${uid}`
    );
    responseBody.responseData = response.data;
    return responseBody;
  } catch (error) {
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.StatusMsg ||
      error.message ||
      error.response?.data?.errors;
    responseBody.hasError = true;
    return responseBody;
  }
};

export const UpdateUserData = async (reqPayload) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    error: null,
  };
  //return null;
  try {
    const response = await axios.put(
      `${API_URL}VMS/User/UpdateProfile`,
      reqPayload
    );
    responseBody.responseData = response.data;
    saveNotification(
      "Profile",
      reqPayload.sender_email,
      reqPayload.sender_role,
      `${reqPayload.username} profile has been updated`,
      reqPayload.company_id
    );
    return responseBody;
  } catch (error) {
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.StatusMsg ||
      error.message ||
      error.response?.data?.errors;
    responseBody.hasError = true;
    return responseBody;
  }
};
