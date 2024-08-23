import { Button, Popup } from "devextreme-react";
import React, { useEffect, useRef, useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../typographyText/TypograghyText";
import { Link } from "react-router-dom";
import "./send-verification.scss";
import { VerifyOtp } from "../../api/registorApi";
import { toastDisplayer } from "../toastDisplayer/toastdisplayer";
import CustomLoader from "../customerloader/CustomLoader";
import success from "../../assets/images/otpVerified.svg";

const OtpPopup = ({
  isVisible,
  onHide,
  header,
  subHeader,
  email,
  role,
  isBtnVisible,
  setIsOTPVrified,
  GenerateOTP,
  refFocused,
  setLoading,
  isOTPVerified,
}) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isAutoFocus, setISAutoFocus] = useState();
  const length = 6;
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    const focusFirstInput = setTimeout(() => {
      if (refFocused) {
        inputRefs.current[0].focus();
      }
    }, 1500);

    return () => clearTimeout(focusFirstInput);
  }, [refFocused]);

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

  const verifyOTPFun = async (combinedOtp) => {
    setLoading(true);
    const verifyMyOtp = await VerifyOtp(email, combinedOtp, role);
    setLoading(false);
    if (verifyMyOtp.hasError === true) {
      return toastDisplayer("error", verifyMyOtp.errorMessage);
    } else {
      setIsOTPVrified(true);
      // setTimeout(() => {
      clearState();

      return toastDisplayer("success", "OTP has been successfully verified.");
      // }, 1000); // Delay for 1 second (1000 milliseconds)
      // clearState();
      // return toastDisplayer("success", "OTP verified successfully..!!");
    }
  };

  const handleVerifyOTP = async () => {
    const combinedOtp = otp.join("");
    verifyOTPFun(combinedOtp);
  };

  const onOtpSubmit = async (combinedOtp) => {
    if (!isBtnVisible) {
    }

    // Add your logic here after OTP submission
  };

  const handleResendOtp = () => {
    // Add your logic to resend OTP
    setTimer(60); // Reset timer
  };
  const handleRetryClick = () => {
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

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const clearState = () => {
    setOtp(Array(6).fill(""));
    onHide();
  };
  return (
    <>
      <Popup
        visible={isVisible}
        onHiding={clearState}
        width={375}
        height={"auto"}
        showCloseButton={false}
        dragEnabled={false}
        showTitle={false}
      >
        <div className="verification-popup-main">
          <PopupHeaderText text={header} />
          <div className="popup-subtext">
            <PopupSubText text={subHeader} />
          </div>

          <div className="popup-close-btn">
            <Button icon="close" onClick={clearState} />
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
                  disabled={isOTPVerified}
                />
              );
            })}
          </div>
        </div>
        {isBtnVisible && (
          <div className="continueBtn">
            <Button
              text="Continue"
              width={"100%"}
              height={44}
              className="button-with-margin"
              onClick={handleVerifyOTP}
            />
          </div>
        )}

        <div className="otp-terms">
          {isOTPVerified ? (
            <>
              <div
                className="otp-terms-condition"
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
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
                  <Link onClick={() => GenerateOTP(email, role)}>
                    Click here to resend{" "}
                  </Link>
                </span>
              )}
            </>
          )}
        </div>
      </Popup>
    </>
  );
};

export default OtpPopup;
