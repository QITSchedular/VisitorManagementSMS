import axios from "axios";
import { logToServer } from "./logger";
import { saveNotification } from "./notification";
const API_URL = process.env.REACT_APP_API;

export async function forgetPasswordChk(email) {
  let responseBody = {
    hasError: true,
    responseData: null,
    errorMessage: null,
  };
  const payload = {
    e_mail: email,
  };
  try {
    var apiRes = await axios.post(`${API_URL}VMS/ForgetPasswordOTP`, payload);
    if (apiRes.status == 200) {
      responseBody.hasError = false;
      responseBody.responseData = apiRes.data;
      await logToServer(
        "ForgotPassword",
        "common",
        "ForgetPasswordOTP",
        "I",
        "forgot password...",
        JSON.stringify(payload),
        email,
        0
      );
      return responseBody;
    } else {
      responseBody.errorMessage = "Not Save Data";
    }
  } catch (error) {
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    await logToServer(
      "ForgotPassword",
      "common",
      "ForgetPasswordOTP",
      "E",
      "UnSuccessFully forgot password...",
      JSON.stringify(payload),
      email,
      0
    );
    return responseBody;
  }
}

export async function forgetPasswordRequestLink(email, uname) {
  const storedSessionValue = JSON.parse(sessionStorage.getItem("authState"));
  var user = null;
  if (storedSessionValue) {
    user = storedSessionValue.user;
  }
  let responseBody = {
    hasError: true,
    responseData: null,
    errorMessage: null,
  };
  const payload = {
    e_mail: email,
  };
  try {
    var apiRes = await axios.post(
      `${API_URL}VMS/ForgetPasswordRequest`,
      payload
    );
    if (apiRes.status == 200) {
      responseBody.hasError = false;
      responseBody.responseData = apiRes.data;

      saveNotification(
        "User Settings",
        user.e_mail,
        user.userrole,
        `Password change request received from ${uname}`,
        user.cmpid
      );
      // saveNotification(
      //   "User Settings",
      //   payload.sender_email,
      //   payload.sender_role,
      //   `For ${payload.useremail} notification rule added successfully`,
      //   payload.company_id
      // );
      await logToServer(
        "ForgotPassword",
        "common",
        "ForgetPasswordRequest",
        "I",
        "forgot password request link...",
        JSON.stringify(payload),
        email,
        0
      );
      return responseBody;
    } else {
      responseBody.errorMessage = "Not Save Data";
    }
  } catch (error) {
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    await logToServer(
      "ForgotPassword",
      "common",
      "ForgetPasswordRequest",
      "E",
      "UnSuccessFully forgot password request link...",
      JSON.stringify(payload),
      email,
      0
    );
    return responseBody;
  }
}

export async function GenerateNewPassword(email, password) {
  let responseBody = {
    hasError: true,
    responseData: null,
    errorMessage: null,
  };
  const payload = {
    e_mail: email,
    password: password,
  };
  try {
    var apiRes = await axios.post(`${API_URL}VMS/GenerateNewPassword`, payload);
    if (apiRes.status == 200) {
      responseBody.hasError = false;
      responseBody.responseData = apiRes.data;
      await logToServer(
        "GenerateNewPassword",
        "common",
        "GenerateNewPassword",
        "S",
        "SuccessFully Generate New Password...",
        JSON.stringify(payload),
        email,
        0
      );
      return responseBody;
    } else {
      responseBody.errorMessage = "Not Save Data";
      await logToServer(
        "GenerateNewPassword",
        "common",
        "GenerateNewPassword",
        "I",
        "Something wrong...",
        JSON.stringify(payload),
        email,
        0
      );
    }
  } catch (error) {
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    await logToServer(
      "GenerateNewPassword",
      "common",
      "GenerateNewPassword",
      "E",
      "UnSuccessFully Generate New Password...",
      JSON.stringify(payload),
      email,
      0
    );
    return responseBody;
  }
}

export async function checkUserStatus(email, company_id) {
  const responseBody = {
    responseData: null,
    hasError: false,
    error: null,
  };
  const payload = {
    e_mail: email,
    company_id: company_id,
  };
  try {
    const response = await axios.post(
      `${API_URL}VMS/Visitor/CheckStatus`,
      payload
    );
    responseBody.responseData = response.data;
    await logToServer(
      "Visitor",
      "visitor_master",
      "CheckStatus",
      "S",
      "Status checked...",
      JSON.stringify(payload),
      email,
      "",
      responseBody.responseData?.APICode
    );
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;

    responseBody.error = error.response.data.StatusMsg;
    await logToServer(
      "Visitor",
      "visitor_master",
      "CheckStatus",
      "E",
      "Status checked wrong...",
      JSON.stringify(payload),
      email,
      "",
      error.response?.data?.APICode
    );
    return responseBody;
  }
}

export async function checkCompanyByQr(QrCode) {
  const responseBody = {
    responseData: null,
    hasError: false,
    error: null,
  };
  try {
    const response = await axios.get(`${API_URL}VMS/GetComapnyData/${QrCode}`);
    responseBody.responseData = response.data;
    await logToServer(
      "Visitor",
      "company_master",
      "GetComapnyData",
      "S",
      "Status checked...",
      JSON.stringify(QrCode),
      "",
      "",
      responseBody.responseData?.APICode
    );
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    await logToServer(
      "Visitor",
      "company_master",
      "GetComapnyData",
      "E",
      "Status checked...",
      JSON.stringify(QrCode),
      "",
      "",
      error.response?.data?.APICode
    );
    return responseBody;
  }
}

export async function getErrorInfo() {
  const responseBody = {
    responseData: null,
    hasError: false,
    error: null,
  };
  try {
    const response = await axios.get(`${API_URL}VMS/getAllErrorCode`);
    responseBody.responseData = response.data;
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    return responseBody;
  }
}

// VMS/User/Get/All/38
// Get All User API
export async function getUserData(type, cmpid) {
  // const token = localStorage.getItem("token");
  const storedSessionValue = JSON.parse(sessionStorage.getItem("authState"));

  const { access, refresh, user, userAuth, expirationTime } =
    storedSessionValue;
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  try {
    const response = await axios.get(`${API_URL}VMS/User/Get/${type}/${cmpid}`);

    responseBody.responseData = response.data;
    await logToServer(
      "User Settings",
      "user_master",
      "get_user",
      "I",
      "SuccessFully get user data...",
      JSON.stringify(type),
      user.e_mail,
      cmpid,
      responseBody.responseData.APICode
    );
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    await logToServer(
      "User Settings",
      "user_master",
      "get_user",
      "E",
      "UnSuccessFully get user data...",
      JSON.stringify(type),
      user.e_mail,
      cmpid,
      error.response?.data?.APICode
    );
    return responseBody;
  }
  // } else {

  //   responseBody.hasError = true;
  //   responseBody.errorMessage = "something wrong";
  //   return responseBody;
  // }
}

// Get auth rule by user
export const getUserAuthRole = async (email, role, cmpid) => {
  // const myCookieValue = localStorage.getItem("token");
  // const userData = localStorage.getItem("User");
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  const payload = {
    useremail: email,
    userrole: role,
    cmptransid: cmpid,
  };
  try {
    // if (myCookieValue != null && userData != null) {
    // const headers = {
    //   Authorization: `Bearer ${myCookieValue}`,
    // };
    // const response = await axios.post(
    //   `${API_URL}/AuthUser/GetAuthRule`,
    //   reqObj,
    //   {
    //     headers: headers,
    //   }
    // );
    const response = await axios.post(`${API_URL}VMS/AuthUser/GET`, payload);

    responseBody.responseData = response.data;
    await logToServer(
      "Authorize User",
      "authorization_master",
      "GetAuthRule",
      "I",
      "SuccessFully get user authrule...",
      JSON.stringify(payload),
      email,
      cmpid,
      responseBody.responseData?.APICode
    );
    return responseBody;
    // }
    // else {

    //   responseBody.hasError = true;
    //   responseBody.errorMessage = "UnAuthorise for add user";
    //   return responseBody;
    // }
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage =
      error.response?.data?.errorMessage || error.response?.data?.errors;
    await logToServer(
      "Authorize User",
      "authorization_master",
      "GetAuthRule",
      "E",
      "UnSuccessFully get user authrule...",
      JSON.stringify(payload),
      email,
      cmpid,
      error.response?.data?.APICode
    );
    return responseBody;
  }
};

// Add auth rule
export async function postAuthenticationRule(payload) {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  const storedSessionValue = JSON.parse(sessionStorage.getItem("authState"));

  const { access, refresh, user, userAuth, expirationTime } =
    storedSessionValue;
  try {
    const response = await axios.post(`${API_URL}VMS/AuthUser/Save`, payload);
    responseBody.responseData = response.data;

    await logToServer(
      "Authorize User",
      "authorization_master",
      "SaveAuthRule",
      "S",
      "SuccessFully save user authrule...",
      JSON.stringify(payload),
      user.e_mail,
      user.cmpid,
      responseBody.responseData.APICode
    );
    saveNotification(
      "User Settings",
      payload.sender_email,
      payload.sender_role,
      payload.notText,
      payload.company_id
    );
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    await logToServer(
      "Authorize User",
      "authorization_master",
      "SaveAuthRule",
      "E",
      "UnSuccessFully save user authrule...",
      JSON.stringify(payload),
      user.e_mail,
      user.cmpid,
      error.response?.data?.APICode
    );
    return responseBody;
  }
  // } else {
  //   responseBody.hasError = true;
  //   responseBody.errorMessage = "something wrong";
  //   return responseBody;
  // }
}

// Get Notification auth rule by user
export const getUserNotificationRule = async (email, role, cmpid) => {
  // const myCookieValue = localStorage.getItem("token");
  // const userData = localStorage.getItem("User");
  const storedSessionValue = JSON.parse(sessionStorage.getItem("authState"));

  const { access, refresh, user, userAuth, expirationTime } =
    storedSessionValue;
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  const payload = {
    useremail: email,
    userrole: role,
    cmptransid: cmpid,
  };
  try {
    // if (myCookieValue != null && userData != null) {
    // const headers = {
    //   Authorization: `Bearer ${myCookieValue}`,
    // };
    // const response = await axios.post(
    //   `${API_URL}/AuthUser/GetAuthRule`,
    //   reqObj,
    //   {
    //     headers: headers,
    //   }
    // );
    const response = await axios.post(
      `${API_URL}VMS/NotificationAuthUser/GET`,
      payload
    );

    responseBody.responseData = response.data;
    await logToServer(
      "Notification Authorise",
      "notification_master",
      "getNotificationAuthUser",
      "I",
      "SuccessFully get notification authrule...",
      JSON.stringify(payload),
      user.e_mail,
      user.cmpid,
      responseBody.responseData?.APICode
    );
    return responseBody;
    // }
    // else {

    //   responseBody.hasError = true;
    //   responseBody.errorMessage = "UnAuthorise for add user";
    //   return responseBody;
    // }
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage =
      error.response?.data?.errorMessage || error.response?.data?.errors;
    await logToServer(
      "Notification Authorise",
      "notification_master",
      "getNotificationAuthUser",
      "E",
      "UnSuccessFully get notification authrule...",
      JSON.stringify(payload),
      user.e_mail,
      user.cmpid,
      error.response?.data?.APICode
    );
    return responseBody;
  }
};

// Add Notification auth rule
export async function postNotificationRule(payload) {
  const storedSessionValue = JSON.parse(sessionStorage.getItem("authState"));

  const { access, refresh, user, userAuth, expirationTime } =
    storedSessionValue;
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };

  try {
    const response = await axios.post(
      `${API_URL}VMS/NotificationAuthUser/Save`,
      payload
    );
    responseBody.responseData = response.data;
    await logToServer(
      "Notification Authorise",
      "notification_master",
      "SaveNotificationAuthUser",
      "S",
      "SuccessFully save notification authrule...",
      JSON.stringify(payload),
      user.e_mail,
      user.cmpid,
      responseBody.responseData.APICode
    );

    saveNotification(
      "User Settings",
      payload.sender_email,
      payload.sender_role,
      payload.notText,
      payload.company_id
    );
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    await logToServer(
      "Notification Authorise",
      "notification_master",
      "SaveNotificationAuthUser",
      "E",
      "UnSuccessFully save notification authrule...",
      JSON.stringify(payload),
      user.e_mail,
      user.cmpid,
      error.response?.data?.APICode
    );
    return responseBody;
  }
}

// Read Notification API
export const updateNotificationStatus = async (type,nid, email, cmpid) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  try {
    const response = await axios.post(`${API_URL}VMS/Notification/${type}Read`, {
      transid: nid,
      email: email,
      cmptransid: cmpid,
    });

    responseBody.responseData = response.data;
    await logToServer(
      "Notification Authorise",
      "notification_master",
      "updateNotificationStatus",
      "S",
      "SuccessFully read notification...",
      JSON.stringify(nid),
      email,
      cmpid
    );
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    // responseBody.errorMessage =
    //   error.response?.data?.errorMessage || error.response?.data?.errors;
    responseBody.errorMessage = responseBody.errorMessage =
      error.message ||
      error.response?.data?.statusMsg ||
      error.response?.data?.errors;
    await logToServer(
      "Notification Authorise",
      "notification_master",
      "updateNotificationStatus",
      "E",
      "UnSuccessFully read notification...",
      JSON.stringify(nid),
      email,
      cmpid
    );
    return responseBody;
  }
};

// Get Notification auth rule by user
export const getAllNotification = async (type,email, cmpid) => {
  // const myCookieValue = localStorage.getItem("token");
  // const userData = localStorage.getItem("User");
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  const payload = {
    email: email,
    cmptransid: cmpid,
  };
  try {
    // if (myCookieValue != null && userData != null) {
    // const headers = {
    //   Authorization: `Bearer ${myCookieValue}`,
    // };
    // const response = await axios.post(
    //   `${API_URL}/AuthUser/GetAuthRule`,
    //   reqObj,
    //   {
    //     headers: headers,
    //   }
    // );

    const response = await axios.post(
      `${API_URL}VMS/Notification/${type}GET`,
      payload
    );
    await logToServer(
      "Notification Authorise",
      "notification_master",
      "getAllNotificationStatus",
      "I",
      "SuccessFully get all notification...",
      JSON.stringify(payload),
      email,
      cmpid
    );
    responseBody.responseData = response.data;
    return responseBody;
    // }
    // else {

    //   responseBody.hasError = true;
    //   responseBody.errorMessage = "UnAuthorise for add user";
    //   return responseBody;
    // }
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage =
      error.response?.data?.errorMessage || error.response?.data?.errors;
    await logToServer(
      "Notification Authorise",
      "notification_master",
      "getAllNotificationStatus",
      "E",
      "UnSuccessFully get all notification...",
      JSON.stringify(payload),
      email,
      cmpid
    );
    return responseBody;
  }
};

export const getAllUserData = async (cmpid) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  try {
    const response = await axios.get(`${API_URL}VMS/User/GET/${cmpid}`);
    responseBody.responseData = response.data.Data;
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage =
      error.response?.data?.errorMessage || error.response?.data?.errors;

    return responseBody;
  }
};
