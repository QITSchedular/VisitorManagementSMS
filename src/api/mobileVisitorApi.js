import axios from "axios";
import { logToServer } from "./logger";
import { saveNotification } from "./notification";
const API_URL = process.env.REACT_APP_API;

export const registerVisitorApi = async (payload) => {
  const responseBody = {
    responsedata: null,
    hasError: false,
    error: null,
  };

  try {
    const response = await axios.post(`${API_URL}VMS/Visitor/Save`, payload);
    responseBody.responsedata = response.data;

    if (payload?.createdby) {
      const storedSessionValue = JSON.parse(
        sessionStorage.getItem("authState")
      );

      const { access, refresh, user, userAuth, expirationTime } =
        storedSessionValue;
      await logToServer(
        "Visitors",
        "visitor_master",
        "Save_Visitor",
        "S",
        "SuccessFully save visitor Data...",
        JSON.stringify(payload),
        user.e_mail,
        user.cmpid,
        responseBody.responsedata?.APICode
      );
    } else {
      await logToServer(
        "Visitors",
        "visitor_master",
        "Save_Visitor",
        "S",
        "SuccessFully save visitor Data...",
        JSON.stringify(payload),
        "",
        "",
        responseBody.responsedata?.APICode
      );
    }
    return responseBody;
  } catch (error) {
    responseBody.error = responseBody.error =
      error.response?.data?.StatusMsg ||
      error.message ||
      error.response?.data?.errors;

    responseBody.hasError = true;
    await logToServer(
      "Visitors",
      "visitor_master",
      "Save_Visitor",
      "E",
      "Visitor Data not saved...",
      JSON.stringify(payload),
      "",
      "",
      error.response?.data?.APICode
    );
    return responseBody;
  }
};

export const checkOutVisitorApi = async (payload) => {
  const responseBody = {
    responsedata: null,
    hasError: false,
    error: null,
  };

  try {
    const response = await axios.post(
      `${API_URL}VMS/Visitor/CheckOut`,
      payload
    );
    responseBody.responsedata = response.data;
    saveNotification(
      "Visitors",
      payload.sender_email,
      payload.sender_role,
      `${payload.e_mail} has been checked out`,
      payload.company_id
    );
    await logToServer(
      "Visitors",
      "visitor_master",
      "checkoutVisitor",
      "S",
      "SuccessFully checkout visitor Data...",
      JSON.stringify(payload),
      payload.e_mail,
      payload.company_id,
      responseBody.responsedata?.APICode
    );
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.error = error.response.data.StatusMsg;
    await logToServer(
      "Visitors",
      "visitor_master",
      "checkoutVisitor",
      "E",
      "UnSuccessFully checkout visitor Data...",
      JSON.stringify(payload),
      payload.e_mail,
      payload.company_id,
      error.response.data?.APICode
    );
    return responseBody;
  }
};

export const checkInVisitorApi = async (payload) => {
  const responseBody = {
    responsedata: null,
    hasError: false,
    error: null,
  };

  try {
    const response = await axios.post(`${API_URL}VMS/Visitor/CheckIn`, payload);
    responseBody.responsedata = response.data;
    saveNotification(
      "Visitors",
      payload.sender_email,
      payload.sender_role,
      `${payload.e_mail} has been checked in.`,
      payload.company_id
    );
    await logToServer(
      "Visitors",
      "visitor_master",
      "checkoutVisitor",
      "S",
      "SuccessFully checkout visitor Data...",
      JSON.stringify(payload),
      payload.e_mail,
      payload.company_id,
      responseBody.responsedata?.APICode
    );
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.error = error.response.data.StatusMsg;
    await logToServer(
      "Visitors",
      "visitor_master",
      "checkoutVisitor",
      "E",
      "UnSuccessFully checkout visitor Data...",
      JSON.stringify(payload),
      payload.e_mail,
      payload.company_id,
      error.response.data?.APICode
    );
    return responseBody;
  }
};
