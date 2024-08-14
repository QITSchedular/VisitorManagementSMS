import axios from "axios";
import { logToServer } from "./logger";
const API_URL = process.env.REACT_APP_API;

// get company profile data
export const GetSuperAdminDetail = async (cid) => {
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
      const response = await axios.get(`${API_URL}VMS/SuperAdmin/Get/${cid}`);
      responseBody.responseData = response.data;
    //   await logToServer(
    //     "Profile",
    //     "company_master",
    //     "GetComapnyDataById",
    //     "I",
    //     "SuccessFully Get Data...",
    //     JSON.stringify(cid),
    //     user.e_mail,
    //     user.cmpid,
    //     responseBody.responseData?.APICode
    //   );
      return responseBody;
    } catch (error) {
      responseBody.errorMessage = responseBody.errorMessage =
        error.response?.data?.StatusMsg ||
        error.message ||
        error.response?.data?.errors;
      responseBody.hasError = true;
    //   await logToServer(
    //     "Profile",
    //     "company_master",
    //     "GetComapnyDataById",
    //     "E",
    //     "UnSuccessFully Get Data...",
    //     JSON.stringify(cid),
    //     user.e_mail,
    //     user.cmpid,
    //     error.response?.data?.APICode
    //   );
      return responseBody;
    }
  };

  export const UpdateSuperAdminData = async (reqPayload) => {
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
      const response = await axios.put(`${API_URL}VMS/SuperAdmin/Edit`, reqPayload);
      responseBody.responseData = response.data;
    //   saveNotification(
    //     "Profile",
    //     reqPayload.sender_email,
    //     reqPayload.sender_role,
    //     `${reqPayload.bname} profile has been updated`,
    //     reqPayload.company_id
    //   );
    //   await logToServer(
    //     "Profile",
    //     "company_master",
    //     "EditComapnyDataById",
    //     "S",
    //     "SuccessFully Edit Data...",
    //     JSON.stringify(reqPayload),
    //     user.e_mail,
    //     user.cmpid,
    //     responseBody.responseData?.APICode
    //   );
      return responseBody;
    } catch (error) {
      responseBody.errorMessage = responseBody.errorMessage =
        error.response?.data?.StatusMsg ||
        error.message ||
        error.response?.data?.errors;
      responseBody.hasError = true;
    //   await logToServer(
    //     "Profile",
    //     "company_master",
    //     "EditComapnyDataById",
    //     "E",
    //     "UnSuccessFully Edit Data...",
    //     JSON.stringify(reqPayload),
    //     user.e_mail,
    //     user.cmpid,
    //     error.response?.data?.APICode
    //   );
      return responseBody;
    }
  };

  export const getAllCompnies = async () => {
    const storedSessionValue = JSON.parse(sessionStorage.getItem("authState"));
   
    const { access, refresh, user, userAuth, expirationTime } =
      storedSessionValue;
    const responseBody = {
      responseData: null,
      hasError: false,
      error: null,
    };
    try {
      const response = await axios.get(`${API_URL}VMS/SuperAdmin/GetCompanies`);
      responseBody.responseData = response.data.data;
      // await logToServer(
      //   "Visitors",
      //   "visitor_master",
      //   "GetAllVisitor",
      //   "I",
      //   "SuccessFully get all visitors Data...",
      //   JSON.stringify(company_id),
      //   user.e_mail,
      //   user.cmpid,
      //   response.data?.APICode
      // );
      return responseBody;
    } catch (error) {
      responseBody.hasError = true;
      responseBody.error = responseBody.errorMessage =
        error.response?.data?.StatusMsg || error.response?.data?.errors;
      // await logToServer(
      //   "Visitors",
      //   "visitor_master",
      //   "GetAllVisitor",
      //   "E",
      //   "UnSuccessFully get all visitors Data...",
      //   JSON.stringify(company_id),
      //   user.e_mail,
      //   user.cmpid,
      //   error.response?.data?.APICode
      // );
      return responseBody;
    }
  };

export const changeCmpStatus = async (reqPayload) => {
  const storedSessionValue = JSON.parse(sessionStorage.getItem("authState"));

  const { access, refresh, user, userAuth, expirationTime } =
    storedSessionValue;
  const responseBody = {
    responseData: null,
    hasError: false,
    error: null,
  };
  try {
    const response = await axios.post(
      `${API_URL}VMS/SuperAdmin/ChangeCmpStatus`,
      reqPayload
    );
    responseBody.responseData = response.data.data;
    // await logToServer(
    //   "Visitors",
    //   "visitor_master",
    //   "GetAllVisitor",
    //   "I",
    //   "SuccessFully get all visitors Data...",
    //   JSON.stringify(company_id),
    //   user.e_mail,
    //   user.cmpid,
    //   response.data?.APICode
    // );
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.error = responseBody.errorMessage =
      error.response?.data?.StatusMsg || error.response?.data?.errors;
    // await logToServer(
    //   "Visitors",
    //   "visitor_master",
    //   "GetAllVisitor",
    //   "E",
    //   "UnSuccessFully get all visitors Data...",
    //   JSON.stringify(company_id),
    //   user.e_mail,
    //   user.cmpid,
    //   error.response?.data?.APICode
    // );
    return responseBody;
  }
};