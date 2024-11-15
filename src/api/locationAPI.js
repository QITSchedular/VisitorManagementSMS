import axios from "axios";
import { logToServer } from "./logger";
import { saveNotification } from "./notification";
const API_URL = process.env.REACT_APP_API;

export const saveLocation = async (payload) => {
  const storedSessionValue = JSON.parse(sessionStorage.getItem("authState"));
  var user = null;
  if (storedSessionValue) {
    user = storedSessionValue.user;
  }
  const responseBody = {
    responsedata: null,
    hasError: false,
    errorMessage: null,
  };

  try {
    const response = await axios.post(`${API_URL}VMS/Location/Save`, payload);
    responseBody.responsedata = response.data;
    saveNotification(
      "General Settings",
      user.e_mail,
      user.userrole,
      `${payload.loc_name} location has been added successfully.`,
      user.cmpid
    );
    if (response.data.Status === 400) {
      responseBody.hasError = true;
      responseBody.errorMessage = response.data.StatusMsg;
    }
    await logToServer(
      "User Settings",
      "loc_master",
      "SaveLocation",
      "S",
      `${payload.loc_name} location has been added successfully.`,
      JSON.stringify(payload),
      user.e_mail,
      user.cmpid,
      responseBody.responsedata?.APICode
    );
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage =
      error.response?.data?.StatusMsg ||
      error.response?.data?.errors ||
      error.message;
    await logToServer(
      "User Settings",
      "loc_master",
      "SaveLocation",
      "E",
      `Error while saving location : ${payload.loc_name}.`,
      JSON.stringify(payload),
      user.e_mail,
      user.cmpid,
      error.response?.data?.APICode
    );
    return responseBody;
  }
};

export async function GettingLocationdata(company_id) {
  const storedSessionValue = JSON.parse(sessionStorage.getItem("authState"));
  var user = null;
  if (storedSessionValue) {
    user = storedSessionValue.user;
  }
  const responsebody = {
    repsonseData: null,
    hasError: false,
    error: null,
  };

  try {
    const response = await axios.get(
      `${API_URL}VMS/Location/GetByCid/${company_id}`
    );
    responsebody.repsonseData = response.data;

    if (user?.cmpid) {
      await logToServer(
        "User Settings",
        "loc_master",
        "GetLocationByCid",
        "I",
        "SuccessFully get Location Data...",
        JSON.stringify(company_id),
        user.e_mail,
        user.cmpid,
        responsebody.repsonseData?.APICode
      );
    } else {
      await logToServer(
        "User Settings",
        "loc_master",
        "GetLocationByCid",
        "I",
        "SuccessFully get Location Data...",
        JSON.stringify(company_id),
        "",
        "",
        responsebody.repsonseData?.APICode
      );
    }

    return responsebody;
  } catch (error) {
    responsebody.hasError = false;
    responsebody.error =
      error.response?.data?.StatusMsg ||
      error.message ||
      error.response?.data?.errors;
    if (user?.cmpid) {
      await logToServer(
        "User Settings",
        "loc_master",
        "GetLocationByCid",
        "E",
        "Error while getting Location Data...",
        JSON.stringify(company_id),
        user.e_mail,
        user.cmpid,
        responsebody.repsonseData?.APICode
      );
    } else {
      await logToServer(
        "User Settings",
        "loc_master",
        "GetLocationByCid",
        "E",
        "Error while getting Location Data...",
        JSON.stringify(company_id),
        "",
        "",
        responsebody.repsonseData?.APICode
      );
    }
    return responsebody;
  }
}

export const updateLocation = async (payload) => {
  const responseBody = {
    responsedata: null,
    hasError: false,
    errorMessage: null,
  };
  const storedSessionValue = JSON.parse(sessionStorage.getItem("authState"));
  var user = null;
  if (storedSessionValue) {
    user = storedSessionValue.user;
  }
  try {
    const response = await axios.put(`${API_URL}VMS/Location/Update`, payload);
    responseBody.responsedata = response.data;
    saveNotification(
      "General Settings",
      payload.sender_email,
      payload.sender_role,
      `${payload.locationname} Location has been Updated Successfully`,
      payload.company_id
    );
    if (response.data.Status === 400) {
      responseBody.hasError = true;
      responseBody.errorMessage = response.data.StatusMsg;
    }
    await logToServer(
      "User Settings",
      "loc_master",
      "EditLocation",
      "S",
      "SuccessFully update Location Data...",
      JSON.stringify(payload),
      user.e_mail,
      user.cmpid,
      responseBody.responsedata?.APICode
    );
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage =
      error.response?.data?.StatusMsg ||
      error.response?.data?.errors ||
      error.message;
    await logToServer(
      "User Settings",
      "loc_master",
      "EditLocation",
      "E",
      "UnSuccessFully update Location Data...",
      JSON.stringify(payload),
      user.e_mail,
      user.cmpid,
      error.response?.data?.APICode
    );
    return responseBody;
  }
};

export const deleteLocation = async (
  LocID,
  compID,
  sender_email,
  sender_role,
  locationname
) => {
  const responseBody = {
    responsedata: null,
    hasError: false,
    errorMessage: null,
  };
  const storedSessionValue = JSON.parse(sessionStorage.getItem("authState"));
  var user = null;
  if (storedSessionValue) {
    user = storedSessionValue.user;
  }
  try {
    const response = await axios.delete(
      `${API_URL}VMS/Location/Delete/${LocID}/${compID}`
    );
    responseBody.responsedata = response.data;
    await saveNotification(
      "General Settings",
      sender_email,
      sender_role,
      `${locationname} Location has been deleted successfully`,
      compID
    );
    if (response.data.Status === 400) {
      responseBody.hasError = true;
      responseBody.errorMessage = response.data.StatusMsg;
    }
    await logToServer(
      "User Settings",
      "Loc_master",
      "DeleteLocation",
      "S",
      "SuccessFully delete Location Data...",
      JSON.stringify(LocID),
      user.e_mail,
      user.cmpid,
      responseBody.responsedata?.APICode
    );
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage =
      error.response?.data?.StatusMsg ||
      error.response?.data?.errors ||
      error.message;
    await logToServer(
      "User Settings",
      "Loc_master",
      "DeleteLocation",
      "E",
      "UnSuccessFully delete Location Data...",
      JSON.stringify(LocID),
      user.e_mail,
      user.cmpid,
      error.response?.data?.APICode
    );
    return responseBody;
  }
};
