import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import {
  GetConfigData,
  getUser,
  signIn as sendSignInRequest,
} from "../api/auth";
import { useRecoilState } from "recoil";
import { configAtom } from "./atom";

function AuthProvider(props) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [authRuleContext, setAuthRuleContext] = useState([]);
  const [configState, setConfigState] = useRecoilState(configAtom);

  const GetConfigDataFunc = async (cid) => {
    const result = await GetConfigData(cid);
    if (!result.hasError) {
      setConfigState(result.responseData?.data);
    }
  };

  // useEffect(() => {
  //   const objectToAdd = {
  //     text: "Log Report",
  //   path: "/log-report1",
  //   icon: "ri-line-chart-line",
  //     hasAccess: true,
  //   };

  //   authRuleContext.push(objectToAdd);
  // }, [authRuleContext]);

  useEffect(() => {
    (async function () {
      const result = await getUser();
      if (result.isOK) {
        setUser(result.data.userData);
        const authAPIData = result.data.userAuth;
        const correctedString = authAPIData
          .replace(/'/g, '"')
          .replace(/True/g, "true")
          .replace(/False/g, "false");
        const userAuthJSON = JSON.parse(correctedString);
        const filteredData = userAuthJSON.filter(
          (section) => section.hasAccess == true
        );
        setAuthRuleContext(filteredData);
        const storedSessionValue = JSON.parse(
          sessionStorage.getItem("authState")
        );
        const { user } = storedSessionValue;
        if(result.data.userData.userrole != "MA"){
          GetConfigDataFunc(user.cmpid);
        }

        // call config API here
        // setConfigState({
        //   approvalTime: "1D",
        //   OtpVerification: false,
        // });
      }

      setLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (email, password) => {
    const result = await sendSignInRequest(email, password);
    if (result.isOk) {
      setUser(result.data.user);
      const authAPIData = result.data.userAuth;
      const correctedString = authAPIData
        .replace(/'/g, '"')
        .replace(/True/g, "true")
        .replace(/False/g, "false");
      const userAuthJSON = JSON.parse(correctedString);
      const filteredData = userAuthJSON.filter(
        (section) => section.hasAccess == true
      );
      setAuthRuleContext(filteredData);
      const { user, userAuth, refresh, access } = result.data;
      const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
      const authData = {
        user,
        userAuth,
        refresh,
        access,
        expirationTime,
      };
      sessionStorage.setItem("authState", JSON.stringify(authData));
      // call config API here
      if(result.data.userData?.userrole != "MA"){
        GetConfigDataFunc(user.cmpid);
      }
      GetConfigDataFunc(user.cmpid);
      // setConfigState({
      //   approvalTime: "1D",
      //   OtpVerification: false,
      // });
    }
    return result;
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem("authState");
    sessionStorage.removeItem("prevPath");
    setUser(undefined);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, loading, authRuleContext, setUser }}
      {...props}
    />
  );
}

const AuthContext = createContext({ loading: false });
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
