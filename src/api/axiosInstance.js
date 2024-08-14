import axios from "axios";
const API_URL = process.env.REACT_APP_API;
// const storedSessionValue = JSON.parse(sessionStorage.getItem("authState"));
// const { access, user, userAuth } = storedSessionValue;
// const storedData = userAuth;
// const userData = user;
// const token = access;
// const header = {
//   Authorization: `Bearer ${token}`,
// };
const axiosInstance = axios.create({
  baseURL: `${API_URL}`, // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to refresh token
const refreshToken = async () => {
  const storedSessionValue = sessionStorage.getItem("authState");
  const { refresh, access } = storedSessionValue;
  const refreshToken = refresh;
  const response = await axios.post(`${API_URL}VMS/refreshToken`, {
    refresh_token: refreshToken,
  });
  const { access_token } = response.data;
  // Retrieve the authState object from session storage
  let authState = JSON.parse(sessionStorage.getItem("authState"));

  // Update the access value
  authState.access = access_token; // Replace with the new access token

  // Convert the object back to a JSON string
  const updatedAuthState = JSON.stringify(authState);

  // Store the updated object back in session storage
  sessionStorage.setItem("authState", updatedAuthState);
  return access_token;
};

// Request interceptor to add access token to request headers
axiosInstance.interceptors.request.use(
  async (config) => {
    const storedSessionValue = sessionStorage.getItem("authState");
    const { refresh, access } = storedSessionValue;
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshToken();
      axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;