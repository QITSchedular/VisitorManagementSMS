import React, { useEffect, useRef, useState } from "react";
import { Button, CheckBox } from "devextreme-react";
import { LoginImage, LoginLogo, QRCodeImage } from "../../assets";
import { useNavigate, Link, useLocation } from "react-router-dom";
import QRCode from "react-qr-code";
import "./QRCodeForm.scss";
import { toPng } from "html-to-image";
import { QrCode } from "@mui/icons-material";
import { useRegisterState } from "../../Atoms/customHook";
import { toastDisplayer } from "../toastDisplayer/toastdisplayer";
import { useAuth } from "../../contexts/auth";
// import { signIn } from "../../api/auth";

const QRCodeForm = () => {
  const [loading, setLoading] = useState(false);
  const [registerUser, setRegisterUser] = useRegisterState("Empty");
  const [qrString, setQrString] = useState(null);
  const [QrCode, setQrCode] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (state != null || state != "") {
      setQrCode(state.qrString);
    }
  }, []);

  const qrRef = useRef();
  const handleSubmit = () => {
    navigate("/qr-code");
  };

  const handleDownload = () => {
    if (qrRef.current) {
      toPng(qrRef.current)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "qr-code.png";
          link.click();
        })
        .catch((err) => {
          // console.error("Failed to download QR code", err);
        });
    }
  };

  const handleContinue = async () => {
    if (!registerUser.e_mail || !registerUser.password) {
      if (!registerUser.e_mail) {
        navigate("/login");
      }
      if (!registerUser.password) {
        navigate("/login");
      }
    }
    setLoading(true);
    try {
      const response = await signIn(registerUser.e_mail, registerUser.password);
      if (response.isOk) {
        toastDisplayer("success", "Heya, you’re now logged in.");
        navigate("/visitors");
      } else {
        toastDisplayer(
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

  //const qrString = "vooo";
  // useEffect(() => {
  //   setQrString(sessionStorage.getItem("qr-string"));
  // }, []);
  useEffect(() => {
    const storedQrString = sessionStorage.getItem("qr-string");
    if (!storedQrString) {
      navigate(-1); // Navigate to the previous page if qr-string is not present
    } else {
      setQrString(storedQrString);
    }
  }, [navigate]);

  return (
    <div className="login-container">
      <div className="login-container-left">
        <div className="login-form">
          <div className="header-image">
            <img src={LoginLogo} alt="logo" width={200} height={70} />
          </div>
          <div className="step-text">Step 4\4</div>
          <div className="header-title">
            <div className="header-main-title">
              <span>Download QR Code</span>
            </div>
            <div className="header-sub-title">
              <div>Print the QR code and paste it at the entrance.</div>
            </div>
          </div>
          <div className="login-container-right-body">
            <div className="qr-code" ref={qrRef}>
              {/* <QrCode
                className="qr-image"
                value="hellvsdjvmnmnfbafsd,dmnf,dbfnbsd,fbnsdfbjsdvajo"
              /> */}
              <QRCode
                value={
                  process.env.REACT_APP_URL + "#/welcomevisitor/" + qrString
                }
                className="qr-image"
              />
              {/* <img src={QRCodeImage} alt="qr-code" /> */}
            </div>
          </div>
          <div className="login-container-right-footer">
            <Button
              text="Download"
              width={"100%"}
              height={"48px"}
              stylingMode="outlined"
              onClick={handleDownload}
            />
          </div>
          <div className="login-container-right-footer">
            <Button
              text="Continue"
              width={"100%"}
              height={"48px"}
              onClick={handleContinue}
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

export default QRCodeForm;
