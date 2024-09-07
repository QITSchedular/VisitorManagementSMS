import React, { useEffect, useRef, useState } from "react";
import "./OtpVerificationForm.scss";
import { Button } from "devextreme-react";
import { LoginImage, LoginLogo } from "../../assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { VerifyOtp, requestOtp } from "../../api/registorApi";
import { useRegisterState } from "../../Atoms/customHook";
import { toastDisplayer } from "../toastDisplayer/toastdisplayer";
import success from "../../assets/images/otpVerified.svg";

const OtpVerificationForm = () => {
  const [isOTPVerified, setIsOTPVrified] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { state } = location;
  const [otp, setOtp] = useState(Array(6).fill(""));
  const length = 6;
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [email, setEmail] = useState(false);
  const [reset, setReset] = useState(false);
  const [registerUser] = useRegisterState();

  useEffect(() => {
    const focusFirstInput = setTimeout(() => {
      if (inputRefs) {
        inputRefs.current[0].focus();
      }
    }, 500);

    return () => clearTimeout(focusFirstInput);
  }, [inputRefs]);

  useEffect(() => {
    if (state != null && state.From === "ResetPassword") {
      setReset(true);
      setEmail(state.Email);
    }
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) onOtpSubmit(combinedOtp);

    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1);

    if (index > 0 && !otp[index - 1]) {
      inputRefs.current[otp.indexOf("")].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  const onOtpSubmit = async (combinedOtp) => {
    var email = "";
    if (reset) {
      email = state.Email;
    } else {
      email = registerUser.e_mail;
    }
    const role = "company";
    // Add your logic here after OTP submission
    setLoading(true);
    const verifyMyOtp = await VerifyOtp(email, combinedOtp, role, null);
    setLoading(false);
    if (verifyMyOtp.hasError === true) {
      return toastDisplayer("error", `${verifyMyOtp.errorMessage}`);
    }
    if (verifyMyOtp.responseData.Status === 200) {
      setIsOTPVrified(true);
      setTimeout(() => {
        if (reset) {
          return navigate("/change-password", {
            state: { Email: email },
          });
        }
        return navigate("/fill-details");
      }, 1000); // Delay for 1 second (1000 milliseconds)
      return toastDisplayer("success", "OTP has been successfully verified.");
    }
    return navigate("/fill-details");
  };

  const handleResendOtp = () => {
    // Add your logic to resend OTP
    setTimer(60); // Reset timer
  };
  const handleRetryClick = async () => {
    const userType = "company";
    const email = registerUser.e_mail;
    const otpRequest = await requestOtp(email, userType);
    if (otpRequest.hasError === true) {
      return toastDisplayer("error", `${otpRequest.error}`);
    }

    toastDisplayer("success", "OTP has been sent.");
    setTimer(10);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTimer) => prevTimer - 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  // Previous Button function
  const handlePreviousBtn = () => {
    if (reset) {
      return navigate("/reset-password", {
        state: { Email: email, From: "OTPVerify" },
      });
    }
    navigate("/create-account", {
      state: { Email: email, From: "OTPVerify" },
    });
  };
  return (
    <>
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
              <div className="step-text">Step 2\4</div>
            </div>
            {/* <div className="step-text">Step 2\4</div> */}
            <div className="header-title">
              <div className="header-main-title">
                <span>OTP Verification </span>
              </div>
              <div className="header-sub-title">
                <div>Sent to {reset ? email : registerUser.e_mail}</div>
              </div>
            </div>
            <div className="main-container">
              <div className="otp-main">
                {otp.map((value, index) => {
                  return (
                    <input
                      key={index}
                      type="text"
                      ref={(input) => (inputRefs.current[index] = input)}
                      value={value}
                      onChange={(e) => handleChange(index, e)}
                      onClick={() => handleClick(index)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="otp-input-box"
                      inputMode="numeric"
                    />
                  );
                })}
              </div>
            </div>
            <div className="otp-terms">
              {isOTPVerified ? (
                <>
                  <div
                    className="otp-terms-condition"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img src={success} alt="success" height={20} width={20} />
                    <span>OTP has been successfully verified.</span>
                  </div>
                </>
              ) : (
                <>
                  <span className="otp-terms-condition">
                    {timer > 0
                      ? `Didn’t get a OTP ? Retry in ${minutes
                          .toString()
                          .padStart(2, "0")} : ${seconds
                          .toString()
                          .padStart(2, "0")}`
                      : "Didn’t get a OTP ? "}
                  </span>
                  {timer === 0 && (
                    <span className="resend-link">
                      <span onClick={handleRetryClick}>
                        Click here to resend{" "}
                      </span>
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="login-container-right">
          <img src={LoginImage} alt="Login" />
        </div>
      </div>
    </>
  );
};

export default OtpVerificationForm;
