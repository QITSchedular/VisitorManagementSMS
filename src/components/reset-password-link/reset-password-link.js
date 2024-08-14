import React, { useEffect, useRef, useState } from "react";
import { LoginImage, LoginLogo } from "../../assets";
import { Button } from "devextreme-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toastDisplayer } from "../toastDisplayer/toastdisplayer";
import { forgetPasswordRequestLink } from "../../api/common";

const ResetLinkPassword = () => {
  const location = useLocation();
  const { state } = location;
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [email, setEmail] = useState(false);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    if (state != null && state.From === "ResetPassword") {
      setReset(true);
      setEmail(state.Email);
    }
  }, []);
  const handleSubmit = async () => {
    const getOtp = await forgetPasswordRequestLink(email);
    if (getOtp.hasError) {
      return toastDisplayer("error", getOtp.errorMessage);
    } else {
      toastDisplayer(
        "success",
        `Your password reset has been successfully requested.`
      );
      return navigate("/login");
    }
  };
  return (
    <div className="login-container">
      <div className="login-container-left">
        <div className="login-form">
          <div className="header-image">
            <img src={LoginLogo} alt="logo" width={200} height={70} />
          </div>
          <div className="header-title">
            <div className="header-main-title">
              <span>Request Send </span>
            </div>
            <div className="header-sub-title">
              <div>Send request to admin to change the password</div>
            </div>
          </div>
          <div className="login-container-right-footer">
            <Button
              text="Send Request Password Change"
              width={"100%"}
              height={"48px"}
              useSubmitBehavior={true}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
      <div className="login-container-right">
        <img src={LoginImage} alt="Login" />
      </div>
    </div>
  );
};

export default ResetLinkPassword;
