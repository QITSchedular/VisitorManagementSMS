import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "devextreme-react";
import "./visitor-card.scss";
import { useNavigate, useParams } from "react-router-dom";
import AllowEntryPopup from "../../../components/popups/allow-entry";
import RejectEntryPopup from "../../../components/popups/reject-entry";
import Visitor from "../../../assets/images/visitor.png";
import { useAuth } from "../../../contexts/auth";

const VisitorCard = ({
  visitor,
  isExpanded,
  onToggleExpand,
  getAllVisitor,
  index,
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPopupRejectVisible, setIsPopupRejectVisible] = useState(false);
  const [verifyData, setVerifyData] = useState(null);
  const [color, setColor] = useState("");
  const [refresh, setRefresh] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const Opacity = "0.8";

  const colors = ["#17A2B8", "#DC3545"];

  useEffect(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setColor(randomColor);
  }, []);

  const handleClick = () => {
    const visitorId = visitor.id;
    navigate(`/Verify-Visitors/Details-of-Visitor?visitorId=${visitorId}`);
  };

  const handleCloseRejectPopup = () => {
    setIsPopupRejectVisible(false);
  };

  const handleOpenRejectPopup = () => {
    setIsPopupRejectVisible(true);
    const authState = JSON.parse(sessionStorage.getItem("authState"));

    const company_id = authState.user.cmpid;

    setVerifyData({
      visitor_name: visitor.vName,
      company_id: company_id,
      visitor_id: visitor.id,
      reason: "",
      status: "R",
      sender_email: user.e_mail,
      sender_role: user.userrole,
      cnctperson: visitor.cnctperson,
    });
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const handleOpenPopup = () => {
    setIsPopupVisible(true);
    const authState = JSON.parse(sessionStorage.getItem("authState"));

    const company_id = authState.user.cmpid;
    setVerifyData({
      visitor_name: visitor.vName,
      company_id: company_id,
      visitor_id: visitor.id,
      reason: "",
      status: "A",
      sender_email: user.e_mail,
      sender_role: user.userrole,
      cnctperson: visitor.cnctperson,
    });
  };

  const handleGetDetailUser = () => {};

  function convertISOToReadableDate(isoString) {
    const date = new Date(isoString);

    // Convert to UTC time parts
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth(); // Note: getUTCMonth() returns month index (0-11)
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();

    // Create a new date object in UTC
    const utcDate = new Date(Date.UTC(year, month, day, hour, minute));

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "UTC", // Ensure the output is in UTC
    };

    const mydata = utcDate.toLocaleString("en-GB", options);

    return mydata;
  }

  // Example usage
  const isoString = "2024-07-15T19:00:00Z";

  return (
    <div className="visitor-card">
      <div className="visitor-header-main">
        {visitor.vavatar !== "" &&
        visitor.vavatar !== "null" &&
        visitor.vavatar !== null ? (
          <img src={visitor.vavatar} alt="visitor-profile" />
        ) : (
          <div className="visitor-initial" style={{ backgroundColor: color }}>
            {visitor.vName.charAt(0)}
          </div>
        )}
        <div className="visitor-deatils">
          <div className="visitor-company">{visitor.vCmpname}</div>
          <div className="visitor-name">{visitor.vName}</div>
          <div className="visitor-address">{visitor.vLocation}</div>
        </div>
        <div className="visitor-icon" onClick={handleClick}>
          <i className="ri-arrow-right-up-line"></i>
        </div>
      </div>
      <div className="visitor-meet-main">
        <div className="visitor-meet">
          <div className="visitor-meeting">
            <span className="meeting-with">Will be Meeting to</span>
            {visitor.cnctperson}
          </div>
          <div className="visitor-time">
            {convertISOToReadableDate(visitor.timeslot)}
          </div>
        </div>
        <div className="visitor-meet-icon">
          <i
            className={`ri-arrow-${isExpanded ? "up" : "down"}-s-line`}
            onClick={onToggleExpand}
            style={{ cursor: "pointer" }}
          ></i>
        </div>
      </div>
      {isExpanded && (
        <>
          <div className="visitor-info-main">
            <div className="visitor-info">
              Purpose - {visitor.purposeofvisit}
            </div>
          </div>
          <div className="visitor-footer">
            <Button
              text={"Reject Entry"}
              height={44}
              stylingMode="outlined"
              onClick={handleOpenRejectPopup}
            />

            <Button
              text={"Allow Entry"}
              height={44}
              onClick={handleOpenPopup}
            />
          </div>
          <AllowEntryPopup
            header="Allow Entry"
            subHeader="Do you anything to add as a reasons? "
            allowEntry="Allow Entry"
            getAllVisitor={getAllVisitor}
            // saveFunction={handleSaveFunction}
            onToggleExpand={onToggleExpand}
            index={index}
            refresh={refresh}
            setVerifyData={setVerifyData}
            verifyData={verifyData}
            dessionStatus={"A"}
            isVisible={isPopupVisible}
            onHide={handleClosePopup}
          />
          <RejectEntryPopup
            header="Reject Entry"
            getAllVisitor={getAllVisitor}
            subHeader="Do you anything to add as a reasons? "
            rejectEntry="Reject Entry"
            // saveFunction={handleSaveFunction}.
            onToggleExpand={onToggleExpand}
            index={index}
            refresh={refresh}
            setVerifyData={setVerifyData}
            verifyData={verifyData}
            isVisible={isPopupRejectVisible}
            onHide={handleCloseRejectPopup}
          />
        </>
      )}
    </div>
  );
};

VisitorCard.propTypes = {
  visitor: PropTypes.shape({
    vName: PropTypes.string.isRequired,
    vCmpname: PropTypes.string.isRequired,
    vavatar: PropTypes.string,
    vLocation: PropTypes.string.isRequired,
    cnctperson: PropTypes.string.isRequired,
    timeslot: PropTypes.string.isRequired,
    purposeofvisit: PropTypes.string.isRequired,
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
};

export default VisitorCard;
