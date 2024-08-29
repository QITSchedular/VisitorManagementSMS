import React, { useEffect, useState } from "react";
import {
  FormText,
  HeaderText,
} from "../../components/typographyText/TypograghyText";
import { Button, TextBox } from "devextreme-react";
import Breadcrumbs from "../../components/breadcrumbs/BreadCrumbs";
import AllowEntryPopup from "../../components/popups/allow-entry";
import RejectEntryPopup from "../../components/popups/reject-entry";
import { useLocation, useParams } from "react-router-dom";
import {
  getVisiotrCompanyWise,
  getVisitorDetailsApi,
} from "../../api/visitorApi";
import CustomLoader from "../../components/customerloader/CustomLoader";
import { useAuth } from "../../contexts/auth";

const VistorsDetails = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPopupRejectVisible, setIsPopupRejectVisible] = useState(false);
  const [singleVisitor, setSingleVisitor] = useState([]);
  const [allVisitor, setAllVisitor] = useState([]);
  const [verifyData, setVerifyData] = useState(null);
  const location = useLocation();
  const [refresh, setRefresh] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const visitorId = queryParams.get("visitorId");
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const handleCloseRejectPopup = () => {
    setIsPopupRejectVisible(false);
  };
  const handleOpenRejectPopup = () => {
    setIsPopupRejectVisible(true);
    const authState = JSON.parse(sessionStorage.getItem("authState"));
    const company_id = authState.user.cmpid;
    setVerifyData((prevData) => ({
      ...prevData,
      company_id: company_id,
      visitor_id: visitorId,
      reason: "",
      status: "R",
      sender_email: user.e_mail,
      sender_role: user.userrole,
    }));
  };
  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };
  const handleOpenPopup = () => {
    setIsPopupVisible(true);
    const authState = JSON.parse(sessionStorage.getItem("authState"));
    const cmp_id = authState.user.cmpid;

    setVerifyData({
      company_id: cmp_id,
      visitor_id: visitorId,
      reason: "",
      status: "A",
      sender_email: user.e_mail,
      sender_role: user.userrole,
    });
  };
  const detailedVisitor = async () => {
    setLoading(true);
    const authState = JSON.parse(sessionStorage.getItem("authState"));
    const cmp_id = authState.user.cmpid;
    const getData = await getVisitorDetailsApi(cmp_id, visitorId);
    setAllVisitor(getData.responseData.Data);
    const myallVisitor = getData.responseData.Data;
    setVerifyData((prevData) => ({
      ...prevData,
      visitor_name: myallVisitor.vName,
    }));
    setSingleVisitor(myallVisitor);
    setLoading(false);
  };
  useEffect(() => {
    setTimeout(() => {
      sessionStorage.setItem(
        "prevPath",
        `/Verify-Visitors/Details-of-Visitor?visitorId=${visitorId}`
      );
    }, 1000);
    detailedVisitor();
  }, []);
  useEffect(() => {}, [singleVisitor]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = String(hours).padStart(2, "0");
    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
  }

  return (
    <>
      {loading && (
        <div className="Myloader">
          <CustomLoader />
        </div>
      )}
      <div className="content-block">
        <div className="navigation-header-main">
          <div className="title-section">
            <HeaderText text="Add Visitors" />
          </div>
          <div className="title-section-btn">
            <Button
              text="Reject Entry"
              stylingMode="outlined"
              width="auto"
              height={44}
              onClick={handleOpenRejectPopup}
            />
            <Button
              text="Allow Entry"
              width={140}
              height={44}
              className="button-with-margin"
              onClick={handleOpenPopup}
            />
          </div>
        </div>
      </div>
      <Breadcrumbs />
      <div className="content-block dx-card">
        <div className="title-section">
          <FormText text="Personal Details" />
        </div>
        <div className="visitor-personal-detail">
          <div className="visitor-personal-data">
            <div className="visitor-header">Name</div>
            <div className="visitor-sub-header">{singleVisitor.vName}</div>
          </div>
          <div className="visitor-personal-data">
            <div className="visitor-header">Mobile Number</div>
            <div className="visitor-sub-header">{singleVisitor.vPhone1}</div>
          </div>
        </div>
        <div className="visitor-personal-detail">
          <div className="visitor-personal-data">
            <div className="visitor-header">Company</div>
            <div className="visitor-sub-header">{singleVisitor.vCmpname}</div>
          </div>
          <div className="visitor-personal-data">
            <div className="visitor-header">Location</div>
            <div className="visitor-sub-header">{singleVisitor.vLocation}</div>
          </div>
        </div>
      </div>
      <div className="content-block dx-card">
        <div className="title-section">
          <FormText text="Other Details" />
        </div>
        <div className="visitor-personal-detail">
          <div className="visitor-personal-data">
            <div className="visitor-header">Person you want to meet</div>
            <div className="visitor-sub-header">{singleVisitor.cnctperson}</div>
          </div>
          <div className="visitor-personal-data">
            <div className="visitor-header">Select Department</div>
            <div className="visitor-sub-header">{singleVisitor.deptName}</div>
          </div>
        </div>
        <div className="visitor-personal-detail">
          <div className="visitor-personal-data">
            <div className="visitor-header">Purpose of Visit</div>
            <div className="visitor-sub-header">
              {singleVisitor.purposeofvisit}
            </div>
          </div>
          <div className="visitor-personal-data">
            <div className="visitor-header">Time Slot</div>
            <div className="visitor-sub-header">
              {formatDate(singleVisitor.timeslot)}
            </div>
          </div>
        </div>
        <div className="visitor-personal-detail">
          <div className="visitor-personal-data">
            <div className="visitor-header">Carrying hardware</div>
            <div className="visitor-sub-header">
              {singleVisitor.anyhardware}
            </div>
          </div>
          <div className="visitor-personal-data">
            <div className="visitor-header">Email</div>
            <div className="visitor-sub-header">{singleVisitor.vEmail}</div>
          </div>
        </div>
      </div>
      <AllowEntryPopup
        header="Allow Entry"
        subHeader="Do you anything to add as a reasons? "
        allowEntry="Allow Entry"
        // saveFunction={handleSaveFunction}
        refresh={refresh}
        verifyData={verifyData}
        setVerifyData={setVerifyData}
        isVisible={isPopupVisible}
        onHide={handleClosePopup}
      />
      <RejectEntryPopup
        header="Reject Entry"
        subHeader="Do you anything to add as a reasons? "
        rejectEntry="Reject Entry"
        // saveFunction={handleSaveFunction}
        refresh={refresh}
        verifyData={verifyData}
        setVerifyData={setVerifyData}
        isVisible={isPopupRejectVisible}
        onHide={handleCloseRejectPopup}
      />
    </>
  );
};

export default VistorsDetails;
