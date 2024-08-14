import axios from "axios";
import { logToServer } from "./logger";
import { saveNotification } from "./notification";
const API_URL = process.env.REACT_APP_API;

export const saveDepartment = async (payload) => {
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
    const response = await axios.post(`${API_URL}VMS/Department/Save`, payload);
    responseBody.responsedata = response.data;
    saveNotification(
      "General Settings",
      user.e_mail,
      user.userrole,
      `${payload.dept_name} department has been added successfully.`,
      user.cmpid
    );
    if (response.data.Status === 400) {
      responseBody.hasError = true;
      responseBody.errorMessage = response.data.StatusMsg;
    }
    await logToServer(
      "User Settings",
      "dept_master",
      "SaveDepartment",
      "S",
      `${payload.dept_name} department has been added successfully.`,
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
      "dept_master",
      "SaveDepartment",
      "E",
      `Error while saving department : ${payload.dept_name}.`,
      JSON.stringify(payload),
      user.e_mail,
      user.cmpid,
      error.response?.data?.APICode
    );
    return responseBody;
  }
};

export const updateDepartment = async (payload) => {
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
    const response = await axios.put(
      `${API_URL}VMS/Department/Update`,
      payload
    );
    responseBody.responsedata = response.data;
    saveNotification(
      "General Settings",
      payload.sender_email,
      payload.sender_role,
      `${payload.deptname} department has been Updated Successfully`,
      payload.company_id
    );
    if (response.data.Status === 400) {
      responseBody.hasError = true;
      responseBody.errorMessage = response.data.StatusMsg;
    }
    await logToServer(
      "User Settings",
      "dept_master",
      "EditDepartment",
      "S",
      "SuccessFully update department Data...",
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
      "dept_master",
      "EditDepartment",
      "E",
      "UnSuccessFully update department Data...",
      JSON.stringify(payload),
      user.e_mail,
      user.cmpid,
      error.response?.data?.APICode
    );
    return responseBody;
  }
};

export const deleteDepartment = async (
  deptID,
  compID,
  sender_email,
  sender_role,
  deptName
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
      `${API_URL}VMS/Department/Delete/${deptID}/${compID}`
    );
    responseBody.responsedata = response.data;
    await saveNotification(
      "General Settings",
      sender_email,
      sender_role,
      `${deptName} Department has been deleted successfully`,
      compID
    );
    if (response.data.Status === 400) {
      responseBody.hasError = true;
      responseBody.errorMessage = response.data.StatusMsg;
    }
    await logToServer(
      "User Settings",
      "dept_master",
      "DeleteDepartment",
      "S",
      "SuccessFully delete department Data...",
      JSON.stringify(deptID),
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
      "dept_master",
      "DeleteDepartment",
      "E",
      "UnSuccessFully delete department Data...",
      JSON.stringify(deptID),
      user.e_mail,
      user.cmpid,
      error.response?.data?.APICode
    );
    return responseBody;
  }
};

export async function GettingDepratmentdata(company_id) {
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
      `${API_URL}VMS/Department/GetByCid/${company_id}`
    );
    responsebody.repsonseData = response.data;

    if (user?.cmpid) {
      await logToServer(
        "User Settings",
        "dept_master",
        "GetDepartmentByCid",
        "I",
        "SuccessFully get department Data...",
        JSON.stringify(company_id),
        user.e_mail,
        user.cmpid,
        responsebody.repsonseData?.APICode
      );
    } else {
      await logToServer(
        "User Settings",
        "dept_master",
        "GetDepartmentByCid",
        "I",
        "SuccessFully get department Data...",
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
        "dept_master",
        "GetDepartmentByCid",
        "E",
        "Error while getting department Data...",
        JSON.stringify(company_id),
        user.e_mail,
        user.cmpid,
        responsebody.repsonseData?.APICode
      );
    } else {
      await logToServer(
        "User Settings",
        "dept_master",
        "GetDepartmentByCid",
        "E",
        "Error while getting department Data...",
        JSON.stringify(company_id),
        "",
        "",
        responsebody.repsonseData?.APICode
      );
    }
    return responsebody;
  }
}
