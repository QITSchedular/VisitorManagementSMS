import React, { useEffect, useState } from "react";
import "./welcome.scss";
import { Button } from "devextreme-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { checkCompanyByQr } from "../../api/common";
import { toastDisplayer } from "../../components/toastDisplayer/toastdisplayer";

export const Welcome = () => {
  // const { cmpId } = useParams();
  const navigate = useNavigate();
  const [QrCode, setQrCode] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const cmpId = queryParams.get("cmpId");

  const getCmpData = async () => {
    const data = await checkCompanyByQr(cmpId);
    const response = data.responseData;
    if (!data.hasError) setQrCode(response.Data);
  };

  useEffect(() => {
    if (cmpId && cmpId != "null") {
      localStorage.setItem("cmpId", cmpId);
      getCmpData();
    } else {
      const cmpIdL = localStorage.getItem("cmpId");
      console.log(cmpIdL);
      if (cmpIdL && cmpIdL != "null") {
        getCmpData();
      } else {
        toastDisplayer("error", "Please scan QR again.");
      }
    }
  }, [cmpId]);
  const hanldeCheckIn = () => {
    if (cmpId && cmpId != "null") navigate(`/welcomestep1?cmpId=${cmpId}`);
    else return toastDisplayer("error", `Please scan QR again.`);
  };
  const handleCheckout = () => {
    if (cmpId && cmpId != "null") navigate(`/checkout?cmpId=${cmpId}`);
    else return toastDisplayer("error", `Please scan QR again.`);
  };
  const handleCheckStatus = () => {
    if (cmpId && cmpId != "null") navigate(`/checkstatus?cmpId=${cmpId}`);
    else return toastDisplayer("error", `Please scan QR again.`);
  };
  return (
    <div className="outer-container">
      {/* <div className="upper-part"></div> */}
      <div className="lower-part">
        <div className="welcome-note">
          <div className="title">
            <span>Welcome Aawjo</span>
          </div>
          <div className="subtitle">
            <span>Heya! </span>
            <span>What do you want to do?</span>
          </div>
        </div>
        <div className="button-section">
          <Button
            text="Check In"
            className="checkInBtn"
            onClick={hanldeCheckIn}
          />
          <Button
            text="Check Out"
            className="CheckOutBtn"
            onClick={handleCheckout}
          />
          <div className="welcome-footer">
            <span>Already applied?</span>
            <span className="check-status" onClick={handleCheckStatus}>
              Check Status
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
