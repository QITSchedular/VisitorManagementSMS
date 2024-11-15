import React, { useEffect, useState } from "react";
import "./checkout.scss";
import { Button, TextBox } from "devextreme-react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkOutVisitorApi } from "../../api/mobileVisitorApi";
import { toastDisplayer } from "../../components/toastDisplayer/toastdisplayer";
import { useAuth } from "../../contexts/auth";
import { checkCompanyByQr } from "../../api/common";
export const CheckOut = () => {
  const [email, setEmail] = useState();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [QrCode, setQrCode] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  // const cmpId = queryParams.get("cmpId");

  const [cmpId, setcmpId] = useState(
    localStorage.getItem("cmpId") || queryParams.get("cmpId")
  );

  useEffect(() => {
    if (cmpId && cmpId != "null") {
      localStorage.setItem("cmpId", cmpId);
      const getCmpData = async () => {
        const data = await checkCompanyByQr(cmpId);
        const response = data.responseData;
        if (!data.hasError) setQrCode(response.Data[0]);
      };
      getCmpData();
    } else {
      navigate("/welcomevisitor?cmpId=");
    }
  }, [cmpId]);

  const handlePreviousBtn = () => {
    if (cmpId && cmpId != "null") navigate(`/welcomevisitor?cmpId=${cmpId}`);
    else navigate("/welcomevisitor?cmpId=");
  };
  const handleCheckInNavigate = () => {
    if (cmpId && cmpId != "null") navigate(`/welcomestep1?cmpId=${cmpId}`);
    else navigate("/welcomevisitor?cmpId=");
  };

  const handleInputChange = (e) => {
    setEmail(e);
  };
  const handleVisitorCheckOut = async () => {
    if (!email || email === "") {
      return toastDisplayer("error", "Please enter the mail");
    }
    if (cmpId === "null") {
      return toastDisplayer("error", "No company QR has been scanned");
    }
    const payload = {
      company_id: QrCode.transid,
      e_mail: email,
      sender_email: email,
      sender_role: "visitor",
    };
    const checkOut = await checkOutVisitorApi(payload);
    if (checkOut.hasError === true) {
      return toastDisplayer("error", `${checkOut.error}`);
    }
    toastDisplayer("success", "Checked Out");
    return navigate(`/Success?cmpId=${cmpId}`, {
      state: { Message: "Checkout Successfully" },
    });
    // navigate(`/welcomevisitor?cmpId=${cmpId}`);
    // return toastDisplayer("success", "Checked Out");
  };
  return (
    <div className="Checkout">
      <div className="backbtn">
        <i
          className="ri-arrow-left-line"
          style={{ fontSize: "20px" }}
          onClick={handlePreviousBtn}
        ></i>
      </div>
      <div className="welcome-text">
        <span>Come Soon!</span> <span>Fill in the details</span>
      </div>
      <div className="input-text">
        <TextBox
          label="Email Address"
          onKeyDown={true}
          valueChangeEvent="keyup"
          labelMode="static"
          stylingMode="outlined"
          height={"56px"}
          className="step-textbox"
          onValueChange={handleInputChange}
        />
      </div>
      <div className="btn-section">
        <Button
          text="Continue"
          width={"100%"}
          height={"44px"}
          onClick={handleVisitorCheckOut}
        />
      </div>
      <div className="already-text">
        <span>New Visitor ?</span>
        <span onClick={handleCheckInNavigate}>Check In</span>
      </div>
    </div>
  );
};
