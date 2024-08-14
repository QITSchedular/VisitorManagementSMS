import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextBox, Button as TextBoxButton } from "devextreme-react/text-box";
import notify from "devextreme/ui/notify";
import { useAuth } from "../../contexts/auth";
import { Button } from "devextreme-react";
import { eyeopen, eyeclose } from "../../assets/icon";
import { Validator, RequiredRule } from "devextreme-react/validator";
import "./LoginForm.scss";
import { LoginImage, LoginLogo } from "../../assets";
import { toastDisplayer } from "../toastDisplayer/toastdisplayer";

export default function LoginForm() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showpwd, setShowPwd] = useState(false);
  const [passwordMode, setPasswordMode] = useState("password");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [email, setEmail] = useState("");

  const handlePWDChange = (e) => {
    setPassword(e.value);
    setPasswordError(false);
  };

  const handleUserLogin = async () => {
    try {
      if (!email || !password) {
        if (!email) {
          return toastDisplayer("error", "Enter your email address.");
        }
        if (!password) {
          return toastDisplayer("error", "Enter your password.");
        }
      }
      setLoading(true);
      const response = await signIn(email, password);
      if (response.isOk) {
        toastDisplayer("success", "Heya, you’re now logged in.");
        if (response.data.user.userrole == "MA") {
          return navigate("/Company");
        } else {
          return navigate("/visitors");
        }
      } else {
        if (
          response?.message?.response?.data?.detail == "Company is inactive."
        ) {
          return toastDisplayer("error", "Company is inactive.");
        }
        return toastDisplayer(
          "error",
          "We couldn’t find the user. Please check the credentials and try again."
        );
      }
    } catch (error) {
      var err =
        error.response?.data?.StatusMsg ||
        error.message ||
        error.response?.data?.errors;
      toastDisplayer(
        "error",
        err ||
          "We couldn’t find the user. Please check the credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = (event) => {
    setEmail(event.value);
  };

  const handlePassword = (event) => {
    setPassword(event.value);
  };

  const onCreateAccountClick = useCallback(() => {
    navigate("/create-account");
  }, [navigate]);

  return (
    <div className="login-container">
      <div className="login-container-left">
        <div className="login-form">
          <form
            method="post"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleUserLogin();
              }
            }}
          >
            <div className="header-image">
              <img src={LoginLogo} alt="logo" width={200} height={70} />
            </div>
            <div className="header-title">
              <div className="header-main-title">
                <span>Login into an account </span>
              </div>
              <div className="header-sub-title">
                <div>
                  Don’t have an account?
                  <span
                    className="create-account"
                    onClick={onCreateAccountClick}
                  >
                    Create an account
                  </span>
                </div>
              </div>
            </div>
            <div className="login-container-right-body">
              <div className="inputField">
                <TextBox
                  label="Email Address"
                  placeholder="Input text"
                  labelMode="static"
                  stylingMode="outlined"
                  height={56}
                  valueChangeEvent="keyup"
                  onValueChanged={handleEmail}
                >
                  <Validator className="custom-validator">
                    <RequiredRule message="Email Address is required" />
                  </Validator>
                </TextBox>
              </div>
              <div className="inputField">
                <TextBox
                  label="Password"
                  placeholder="Input text"
                  value={password}
                  mode={passwordMode}
                  labelMode="static"
                  height={56}
                  stylingMode="outlined"
                  onValueChanged={handlePassword}
                  valueChangeEvent="keyup"
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
                    <RequiredRule message="Password is required." />
                  </Validator>
                </TextBox>
              </div>
              <div className="forget-pwd">
                <Link to={"/reset-password"}>Forgot Password?</Link>
              </div>
            </div>

            <div className="login-container-right-footer">
              <Button
                text="Continue"
                width={"100%"}
                height={"48px"}
                // useSubmitBehavior={true}
                onClick={handleUserLogin}
                disabled={loading}
              />
            </div>
            <div className="terms-condition">
              <div>
                I agree with your{" "}
                <span className="terms-service">Terms of Service</span>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="login-container-right">
        <img src={LoginImage} alt="Login" />
      </div>
    </div>
  );
}
