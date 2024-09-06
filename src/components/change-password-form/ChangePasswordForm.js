import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TextBox, Button as TextBoxButton } from "devextreme-react/text-box";
import { Button, CheckBox } from "devextreme-react";
import { eyeopen, eyeclose } from "../../assets/icon";
import {
  Validator,
  RequiredRule,
  PatternRule,
} from "devextreme-react/validator";
import { LoginImage, LoginLogo } from "../../assets";
import { GenerateNewPassword } from "../../api/common";
import { toastDisplayer } from "../toastDisplayer/toastdisplayer";

export default function ChangePasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [loading, setLoading] = useState(false);
  const [showpwd, setShowPwd] = useState(false);
  const [passwordMode, setPasswordMode] = useState("password");
  const [cpassword, setcpassword] = useState(null);
  const [password, setpassword] = useState(null);
  const [email, setEmail] = useState(false);

  useEffect(() => {
    if (state != null) {
      setEmail(state.Email);
    }
  }, []);

  const handleConfirmPassword = (e) => {
    return setcpassword(e.value);
  };
  const handlePassword = (e) => {
    return setpassword(e.value);
  };
  const handleSubmit = async () => {
    try {
      const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      if (!passwordPattern.test(password)) {
        return toastDisplayer(
          "error",
          "Password must be 6+ chars, with 1 uppercase, 1 number, and 1 special character."
        );
      }
      if (password == cpassword) {
        var apiRes = await GenerateNewPassword(email, password);
        if (!apiRes.hasError) {
          const data = apiRes.responseData;

          toastDisplayer(
            "success",
            "Your password has been reset successfully."
          );
          return navigate("/login");
        }
      } else {
        return toastDisplayer("error", "The passwords don't match.");
      }
    } catch (error) {}
    // navigate("/change-password");
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
              <span>Reset Password</span>
            </div>
            <div className="header-sub-title">
              <div>Please enter the new password</div>
            </div>
          </div>
          <div className="login-container-right-body">
            <div className="inputField">
              <TextBox
                label="New Password"
                placeholder="Input text"
                labelMode="static"
                stylingMode="outlined"
                height={56}
                valueChangeEvent="keyup"
                onValueChanged={handlePassword}
              >
                <Validator className="custom-validator">
                  <RequiredRule message="Password is required." />
                  <PatternRule
                    pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}"
                    message="Password must be minimum 6 chars, with 1 uppercase, 1 number, and 1 special character."
                  />
                </Validator>
              </TextBox>
            </div>
            <div className="inputField">
              <TextBox
                label="Confirm New Password"
                placeholder="Input text"
                value={cpassword ? cpassword : ""}
                mode={passwordMode}
                labelMode="static"
                stylingMode="outlined"
                height={56}
                valueChangeEvent="keyup"
                onValueChanged={handleConfirmPassword}
              >
                <TextBoxButton
                  name="password"
                  location="after"
                  options={{
                    icon: `${showpwd ? eyeopen : eyeclose}`,
                    stylingMode: "text",
                    onClick: () => {
                      setShowPwd(!showpwd);
                      setPasswordMode((prevPasswordMode) =>
                        prevPasswordMode === "text" ? "password" : "text"
                      );
                    },
                  }}
                />
                <Validator>
                  <RequiredRule message="Confirm Password is required." />
                </Validator>
              </TextBox>
            </div>
          </div>

          <div className="login-container-right-footer">
            <Button
              text="Continue"
              width={"100%"}
              height={"48px"}
              // stylingMode="default"
              useSubmitBehavior={true}
              onClick={handleSubmit}
            />
          </div>
          <div className="terms-condition">
            <div>
              I agree with your{" "}
              <span className="terms-service">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
      <div className="login-container-right">
        <img src={LoginImage} alt="Login" />
      </div>
    </div>
  );
}
