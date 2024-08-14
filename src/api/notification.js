import axios from "axios";
const API_URL = process.env.REACT_APP_API;
export const saveNotification = async (
  module,
  sender_email,
  sender_role,
  notification_text,
  cmptransid
) => {
  const responseBody = {
    responseData: null,
    hasError: false,
    errorMessage: null,
  };
  //   const user = loginUser ? loginUser : "";

  const requestBody = {
    module,
    sender_email,
    sender_role,
    notification_text,
    cmptransid,
  };
  try {
    const response = await axios.post(
      `${API_URL}VMS/Notification/Save`,
      requestBody
    );
    responseBody.responseData = response.data[0];
    return responseBody;
  } catch (error) {
    responseBody.hasError = true;
    responseBody.errorMessage = responseBody.errorMessage =
      error.response?.data?.statusMsg || error.response?.data?.errors;
    return responseBody;
  }
};
