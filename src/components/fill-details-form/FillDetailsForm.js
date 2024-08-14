import React, { useEffect, useState } from "react";
import { Button, CheckBox } from "devextreme-react";
import { Validator, RequiredRule } from "devextreme-react/validator";
import { LoginImage, LoginLogo } from "../../assets";
import { useNavigate, Link } from "react-router-dom";
import { TextBox } from "devextreme-react/text-box";
import { useRegisterState } from "../../Atoms/customHook";
import { registerUserApi } from "../../api/registorApi";
import { toastDisplayer } from "../toastDisplayer/toastdisplayer";

const FillDetails = () => {
  const navigate = useNavigate();
  const [registerUser, setRegisterUser] = useRegisterState();
  const [myCheck, setMyCheck] = useState("");

  // 8d2c2f98e4d98ba6a9b06c6a97ece92120cf8693816e0e831105cd8044f3dc0f
  const handleSubmit = async () => {
    if (!myCheck) {
      return null;
    }
    if (!myCheck.blocation) {
      return null;
    }
    if (!myCheck.bname) {
      return null;
    }

    console.log(registerUser);
    const getUserRegistered = await registerUserApi(registerUser);
    if (getUserRegistered.hasError === true) {
      return toastDisplayer("error", `${getUserRegistered.error}`);
    }

    sessionStorage.clear();
    sessionStorage.setItem(
      "qr-string",
      getUserRegistered.response.encodedString
    );
    navigate("/qr-code", {
      state: { qrString: getUserRegistered.response.encodedString },
    });
    // setRegisterUser("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMyCheck((prev) => ({
      ...prev,
      [name]: value,
    }));
    setRegisterUser((prev) => ({
      ...prev,
      [name]: value,
      createdby: null,
    }));
  };

  // Previous Button function
  const handlePreviousBtn = () => {
    navigate("/otp-verification");
  };

  return (
    <div className="login-container">
      <div className="login-container-left">
        <div className="login-form">
          <div className="header-image">
            <img src={LoginLogo} alt="logo" width={200} height={70} />
          </div>
          <div className="backbtn">
            <i
              className="ri-arrow-left-line"
              style={{
                fontSize: "20px",
                cursor: "pointer",
                marginBottom: "10px",
              }}
              onClick={handlePreviousBtn}
            ></i>
            <div className="step-text">Step 3\4</div>
          </div>
          {/* <div className="step-text">Step 3\4</div> */}
          <div className="header-title">
            <div className="header-main-title">
              <span>Fill in details </span>
            </div>
            <div className="header-sub-title">
              <div>What should we call you?</div>
            </div>
          </div>
          <div className="login-container-right-body">
            <div className="inputField">
              <TextBox
                label="Name of the comapny"
                placeholder="Input text"
                labelMode="static"
                stylingMode="outlined"
                height={56}
                value={registerUser.bname}
                onValueChanged={(e) =>
                  handleChange({ target: { name: "bname", value: e.value } })
                }
              >
                <Validator className="custom-validator">
                  <RequiredRule message="Company Name is required" />
                </Validator>
              </TextBox>
            </div>
            <div className="inputField">
              <TextBox
                label="Company Address"
                placeholder="Input text"
                labelMode="static"
                height={56}
                stylingMode="outlined"
                value={registerUser.blocation}
                onValueChanged={(e) =>
                  handleChange({
                    target: { name: "blocation", value: e.value },
                  })
                }
              >
                <Validator>
                  <RequiredRule message="Company Location is required" />
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
              onClick={() => handleSubmit()}
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
};

export default FillDetails;
