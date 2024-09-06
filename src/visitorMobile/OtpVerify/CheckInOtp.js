import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./checkinotp.scss";
import { useRegisterVisitor } from "../../Atoms/customHook";
import { VerifyOtp, requestOtp } from "../../api/registorApi";
import { toast } from "react-toastify";
import { toastDisplayer } from "../../components/toastDisplayer/toastdisplayer";

export const CheckInOtp = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const length = 6;
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const cmpId = queryParams.get("cmpId");
  const [registerVisitor, setRegisterVisitor] = useRegisterVisitor();

  const email = registerVisitor.e_mail;
  const mobile = registerVisitor.phone1;

  useEffect(() => {
    const path = localStorage.getItem("previousPath");
    if (path == "/step3") {
      localStorage.setItem("previousPath", "/step2");
      navigate(`/welcomestep1?cpmId=${cmpId}`);
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
    // return navigate(`/welcomestep3?cmpId=${cmpId}`);
    try {
      const role = "visitor";
      const checkOtp = await VerifyOtp(email, combinedOtp, role);
      if (checkOtp.hasError === true) {
        return toastDisplayer("error", `${checkOtp.errorMessage}`);
      }

      return navigate(`/welcomestep3?cmpId=${cmpId}`);
    } catch (error) {
      return toastDisplayer("error", `${error}`);
    }
  };

  const handleRetryClick = async () => {
    const userType = "visitor";
    const otpRequest = await requestOtp(email, userType, mobile);
    if (otpRequest.hasError === true) {
      return toastDisplayer("error", `${otpRequest.error}`);
    }

    toastDisplayer("success", "Successfully sent OTP .");
    setTimer(60);
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

  const handlePreviousBtn = () => {
    navigate(`/welcomestep1?cpmId=${cmpId}`);
  };

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <>
      <div className="login-container main-form-container">
        <div className="backbtn">
          <i
            className="ri-arrow-left-line"
            style={{ fontSize: "20px" }}
            onClick={handlePreviousBtn}
          ></i>
        </div>
        <div className="login-container-left form-conatiner">
          <div className="login-form ">
            <div className="step-text">Step 2\4</div>
            <div className="header-title">
              <div className="header-main-title">
                <span>OTP Verification </span>
              </div>
              <div className="header-sub-title">
                <div>Sent to {email}</div>
              </div>
            </div>
            <div className="main-container">
              <div className="otp-main">
                {otp.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    ref={(input) => (inputRefs.current[index] = input)}
                    value={value}
                    onChange={(e) => handleChange(index, e)}
                    onClick={() => handleClick(index)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="otp-input-box"
                    inputMode="numeric" // Optional: Suggest numeric input mode for better compatibility
                    pattern="[0-9]*" // Optional: Ensure only numeric input is accepted
                  />
                ))}
              </div>
            </div>
            <div className="otp-terms">
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
                  <span to="/fill-details" onClick={handleRetryClick}>
                    Click here to resend
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
