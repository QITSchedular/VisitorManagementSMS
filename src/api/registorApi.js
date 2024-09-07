import axios from "axios";
import { logToServer } from "./logger";
const REACT_APP_API = process.env.REACT_APP_API;

export const registerUserApi = async (payload) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    error: null,
  };
  //return null;
  try {
    const response = await axios.post(`${REACT_APP_API}VMS/Register`, payload);
    responseBody.response = response.data;
    await logToServer(
      "CreateCompany",
      "company_master",
      "CreateCompany",
      "S",
      "SuccessFully register company Data...",
      JSON.stringify(payload.e_mail),
      "",
      "",
      responseBody.responseData?.APICode
    );
    return responseBody;
  } catch (error) {
    responseBody.error =
      error.response?.data?.StatusMsg ||
      error.message ||
      error.response?.data?.errors;
    responseBody.hasError = true;
    await logToServer(
      "CreateCompany",
      "company_master",
      "CreateCompany",
      "E",
      "UnSuccessFully register company Data...",
      JSON.stringify(payload.e_mail),
      "",
      "",
      error.response?.data?.APICode
    );
    return responseBody;
  }
};

export const requestOtp = async (email, role,mobile) => {
  var payload = {
      e_mail: email,
      role: role
    }
    if(role.toUpperCase() != "COMPANY"){
      payload = {
      e_mail: email,
      role: role,
      mobile:mobile
    }
  }
  // const payload = {
  //   e_mail: email,
  //   role: role,
  // };
  const responseBody = {
    responseData: null,
    hasError: false,
    error: null,
  };
  try {
    const response = await axios.post(
      `${REACT_APP_API}VMS/GenerateOTP`,
      payload
    );
    responseBody.response = response.data;

    await logToServer(
      "GenerateOTP",
      "common",
      "GenerateOTP",
      "S",
      "SuccessFully generate OTP...",
      JSON.stringify(payload),
      email,
      "",
      responseBody.response?.APICode
    );
    return responseBody;
  } catch (error) {
    responseBody.error =
      error.response?.data?.StatusMsg ||
      error.message ||
      error.response?.data?.errors;
    responseBody.hasError = true;
    await logToServer(
      "GenerateOTP",
      "common",
      "GenerateOTP",
      "E",
      "UnSuccessFully generate OTP...",
      JSON.stringify(payload),
      email,
      "",
      responseBody.responseData?.APICode
    );
    return responseBody;
  }
};

export const VerifyOtp = async (email, otp, role) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };

  const payload = {
    e_mail: email,
    VerifyOTP: otp,
    role: role,
  };

  try {
    const response = await axios.post(`${REACT_APP_API}VMS/VerifyOTP`, payload);
    responseBody.responseData = response.data;

    if (response.data.Status === 400) {
      responseBody.hasError = true;
      responseBody.errorMessage = response.data.StatusMsg;
    }

    await logToServer(
      "VerifyOTP",
      "common",
      "VerifyOTP",
      "S",
      "Successfully verified OTP...",
      JSON.stringify(payload),
      email,
      "",
      responseBody.responseData?.APICode
    );

    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage =
      error.response?.data?.StatusMsg ||
      error.response?.data?.errors ||
      error.message;
    await logToServer(
      "VerifyOTP",
      "common",
      "VerifyOTP",
      "E",
      "Failed to verify OTP...",
      JSON.stringify(payload),
      email,
      "",
      error.response?.data?.APICode
    );
    return responseBody;
  }
};
