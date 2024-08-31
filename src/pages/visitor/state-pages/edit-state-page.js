import { Button, SelectBox, TextBox } from "devextreme-react";
import React, { useState } from "react";
import {
  FormText,
  HeaderText,
} from "../../../components/typographyText/TypograghyText";
import Breadcrumbs from "../../../components/breadcrumbs/BreadCrumbs";
import SendVerification from "../../../components/popups/send-verification";
import { useRecoilState } from "recoil";
import { stateAtom } from "../../../contexts/atom";

const getStatusColor = (state) => {
  const statusColors = {
    Approved: "#124d22",
    Pending: "#934908",
    Rejected: "#AD1820",
  };

  return statusColors[state];
};
const getStatusBackground = (state) => {
  const statusColors = {
    Approved: "rgba(18, 77, 34, 0.06)",
    Pending: "rgba(233, 115, 12, 0.06)",
    Rejected: "rgba(173, 24, 32, 0.06)",
  };
  return statusColors[state] || "#000";
};

const EditVisitorDetail = () => {
  const [state] = useRecoilState(stateAtom);
  const [loading, setLoading] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupVisible(true);
  };
  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };
  return (
    <>
      <div className="content-block">
        <div className="navigation-header">
          <div className="title-section">
            <HeaderText text="Visitors" />
          </div>
          <div className="title-section-btn">
            <Button
              text="Send for Verify"
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
          <span
            className="header-state"
            style={{ backgroundColor: getStatusBackground(state) }}
          >
            <span
              className="status-circle"
              style={{ backgroundColor: getStatusColor(state) }}
            />
            <span data-type={state}>{state}</span>
          </span>
        </div>
        <div className="visitor-personal-detail">
          <div className="visitor-personal-data">
            <div className="visitor-header">Name</div>
            <div className="visitor-sub-header">Input</div>
          </div>
        </div>
      </div>
      <div className="content-block dx-card">
        <div className="title-section">
          <FormText text="Personal Details" />
        </div>
        <div className="personal-detail-form">
          <div className="form-input">
            <TextBox
              label="Name"
              placeholder="Input"
              labelMode="static"
              stylingMode="outlined"
            />
          </div>
          <div className="form-input popup-textbox">
            <TextBox
              label="Mobile Number"
              placeholder="Input"
              labelMode="static"
              stylingMode="outlined"
            />
          </div>
        </div>
        <div className="personal-detail-form">
          <div className="form-input">
            <TextBox
              label="Company"
              placeholder="Input"
              labelMode="static"
              stylingMode="outlined"
            />
          </div>
          <div className="form-input">
            <TextBox
              label="Location"
              placeholder="Input"
              labelMode="static"
              stylingMode="outlined"
            />
          </div>
        </div>
      </div>
      <div className="content-block dx-card">
        <div className="title-section">
          <FormText text="Other Details" />
        </div>
        <div className="personal-detail-form">
          <div className="form-input">
            <TextBox
              label="Person you want to meet"
              placeholder="Input"
              labelMode="static"
              stylingMode="outlined"
            />
          </div>
          <div className="form-input">
            <SelectBox
              label="Select Department"
              placeholder="Input"
              labelMode="static"
              stylingMode="outlined"
            />
          </div>
        </div>
        <div className="personal-detail-form">
          <div className="form-input">
            <TextBox
              label="Time Slot"
              placeholder="Input"
              labelMode="static"
              stylingMode="outlined"
            />
          </div>
          <div className="form-input">
            <TextBox
              label="Any Hardware"
              placeholder="Input"
              labelMode="static"
              stylingMode="outlined"
            />
          </div>
        </div>
        <div className="personal-detail-form">
          <div className="form-input full-width">
            <TextBox
              label="Purpose of Visit"
              placeholder="Input"
              labelMode="static"
              stylingMode="outlined"
            />
          </div>
        </div>
      </div>
      <SendVerification
        header="Send for Verification"
        subHeader="Are you sure you want to send for approval?"
        approval="Send for Verification"
        discard="Discard"
        // saveFunction={handleSaveFunction}
        isVisible={isPopupVisible}
        onHide={handleClosePopup}
        loading={loading}
      />
    </>
  );
};

export default EditVisitorDetail;
