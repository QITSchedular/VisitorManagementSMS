import "devextreme/dist/css/dx.common.css";
import "./themes/generated/theme.base.css";
import "./themes/generated/theme.additional.css";
import React, { useEffect } from "react";
import { HashRouter as Router } from "react-router-dom";
import "./dx-styles.scss";
import LoadPanel from "devextreme-react/load-panel";
import { NavigationProvider } from "./contexts/navigation";
import { AuthProvider, useAuth } from "./contexts/auth";
import { useScreenSizeClass } from "./utils/media-query";
import Content from "./Content";
import UnauthenticatedContent from "./UnauthenticatedContent";
import { RecoilRoot } from "recoil";
import { WebSocketProvider } from "./contexts/websocket";
import axiosInstance from "./api/axiosInstance";
import { ToastContainer } from "react-toastify";
function App() {
  const { user, loading, authRuleContext } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("VMS/secure");

        // setData(response.data);
      } catch (err) {
        // setError(err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadPanel visible={true} />;
  }

  if (user) {
    return <Content />;
  }

  return <UnauthenticatedContent />;
}

export default function Root() {
  const screenSizeClass = useScreenSizeClass();

  return (
    <Router>
      <ToastContainer />
      <RecoilRoot>
        <AuthProvider>
          <WebSocketProvider>
            <NavigationProvider>
              <div className={`app ${screenSizeClass}`}>
                <App />
              </div>
            </NavigationProvider>
          </WebSocketProvider>
        </AuthProvider>
      </RecoilRoot>
    </Router>
  );
}
