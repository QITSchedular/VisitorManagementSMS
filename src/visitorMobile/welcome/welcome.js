import React, { useEffect, useState } from "react";
import "./welcome.scss";
import { Button } from "devextreme-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { checkCompanyByQr } from "../../api/common";

export const Welcome = () => {
  // const { cmpId } = useParams();
  const navigate = useNavigate();
  const [QrCode, setQrCode] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const cmpId = queryParams.get("cmpId");

  useEffect(() => {
    if (cmpId) {
      const getCmpData = async () => {
        const data = await checkCompanyByQr(cmpId);
        const response = data.responseData;
        if (!data.hasError) setQrCode(response.Data);
      };
      getCmpData();
    }
  }, [cmpId]);
  const hanldeCheckIn = () => {
    navigate(`/welcomestep1?cmpId=${cmpId}`);
  };
  const handleCheckout = () => {
    navigate(`/checkout?cmpId=${cmpId}`);
  };
  const handleCheckStatus = () => {
    navigate(`/checkstatus?cmpId=${cmpId}`);
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
