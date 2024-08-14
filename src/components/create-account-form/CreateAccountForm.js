import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextBox, Button as TextBoxButton } from "devextreme-react/text-box";
import notify from "devextreme/ui/notify";
import { useAuth } from "../../contexts/auth";
import { Button, CheckBox } from "devextreme-react";
import { eyeopen, eyeclose } from "../../assets/icon";
import { Validator, RequiredRule } from "devextreme-react/validator";
import { LoginImage, LoginLogo } from "../../assets";
import { createAccount } from "../../api/auth";
import "./CreateAccountForm.scss";
import { useRegisterState } from "../../Atoms/customHook";
import { requestOtp } from "../../api/registorApi";
import { toast } from "react-toastify";
import { toastDisplayer } from "../toastDisplayer/toastdisplayer";
import CustomLoader from "../customerloader/CustomLoader";

export default function CreateAccountForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showpwd, setShowPwd] = useState(false);
  const [passwordMode, setPasswordMode] = useState("password");
  const [password, setpassword] = useState(null);
  const [myCheck, setMyCheck] = useState("");

  const [registerUser, setRegisterUser] = useRegisterState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMyCheck((prev) => ({
      ...prev,
      [name]: value,
    }));
    setRegisterUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    // event.preventDefault();
    if (!myCheck) {
      return toastDisplayer("error", "Both email and password are required.");
    }
    if (!myCheck.e_mail) {
      return toastDisplayer("error", "Email address is required.");
    }
    if (!myCheck.password) {
      return toastDisplayer("error", "Password is required.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(myCheck.e_mail)) {
      toastDisplayer("error", "Please enter a valid email address.");
      return null;
    }

    const userEmail = registerUser.e_mail;
    const role = "company";

    setLoading(true);

    const getOtp = await requestOtp(userEmail, role);

    setLoading(false);
    if (getOtp.hasError) {
      return toastDisplayer("error", `${getOtp.error}`);
    } else {
      toastDisplayer("success", `${getOtp.response?.StatusMsg}`);
      navigate("/otp-verification");
    }

    return navigate("/otp-verification");
  };

  useEffect(() => {}, [registerUser]);

  // Previous Button function
  const handlePreviousBtn = () => {
    navigate("/welcomevisitor");
  };

  return (
    <>
      {loading && (
        <div className="Myloader">
          <CustomLoader />
        </div>
      )}
      <div className="login-container">
        <div className="login-container-left">
          <div className="login-form">
            <form>
              <div className="header-image">
                <img src={LoginLogo} alt="logo" width={200} height={70} />
              </div>
              {/* <div className="backbtn">
              <i
                className="ri-arrow-left-line"
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                  marginBottom: "10px",
                }}
                onClick={handlePreviousBtn}
              ></i> */}
              <div className="step-text">Step 1\4</div>
              {/* </div> */}
              <div className="header-title">
                <div className="header-main-title">
                  <span>Create an account </span>
                </div>
                <div className="header-sub-title">
                  <div>
                    Already have an account?
                    <span className="create-account">
                      <Link to={"/login"}>Log in</Link>
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
                    onValueChanged={(e) =>
                      handleChange({
                        target: { name: "e_mail", value: e.value },
                      })
                    }
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
                    defaultValue={password ? password : ""}
                    mode={passwordMode}
                    labelMode="static"
                    stylingMode="outlined"
                    height={56}
                    onValueChanged={(e) =>
                      handleChange({
                        target: { name: "password", value: e.value },
                      })
                    }
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
              </div>

              <div className="login-container-right-footer">
                <Button
                  text="Continue"
                  width={"100%"}
                  height={"48px"}
                  // stylingMode="default"
                  onClick={handleSubmit}
                />
              </div>
              {/* <div className="or-text">or</div>
          <div className="login-with-google">
            <Button
              text="Continue with Google"
              width={"100%"}
              height={"48px"}
              stylingMode="outlined"
              className="google-button"
            />
          </div> */}

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
    </>
  );
}
