import axios from "axios";
const API_URL = process.env.REACT_APP_API;

export async function getReportData(cid, fdate, tdate) {
  const responsebody = {
    repsonseData: null,
    hasError: false,
    error: null,
  };

  const requestBody = {
    cid: cid,
    fdate: fdate,
    tdate: tdate,
  };

  try {
    const response = await axios.post(
      `${API_URL}VMS/Report/VisitorReport`,
      requestBody
    );
    responsebody.repsonseData = response.data;
  } catch (error) {
    responsebody.hasError = true;
    if (error.response) {
      responsebody.error = error.response.data.StatusMsg || error.message;
    } else if (error.request) {
      responsebody.error = "No response from server";
    } else {
      responsebody.error = error.message;
    }
  }

  return responsebody;
}
