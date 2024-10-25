import React, { useEffect, useRef, useState } from "react";
import CustomLoader from "../../components/customerloader/CustomLoader";
import {
  FormText,
  HeaderText,
} from "../../components/typographyText/TypograghyText";
import { Button, TextBox } from "devextreme-react";
import Breadcrumbs from "../../components/breadcrumbs/BreadCrumbs";
import { useLocation, useNavigate } from "react-router-dom";
import AddAPhotoOutlinedIcon from "@mui/icons-material/Download";
import qrcode from "qrcode";
import "./company-details.scss";
import ChangeCmpStatus from "../../components/popups/changeCmpStatus";
import { toastDisplayer } from "../../components/toastDisplayer/toastdisplayer";
import { changeCmpStatus } from "../../api/masterAdmin";

function CompanyDeails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [cmpData, setCmpData] = useState(null);
  const [activePopUp, setActivePopUp] = useState(false);
  const [inactivePopUp, setInactivePopUp] = useState(false);
  const [reasonInput, setReasonInput] = useState("");
  const canvasRef = useRef(null);
  useEffect(() => {
    if (location.state) {
      setCmpData(location.state);
    } else {
      navigate("/Company");
    }
  }, [location.state]);
  useEffect(() => {
    setLoading(true);
    if (canvasRef.current) {
      if (cmpData) {
        qrcode.toCanvas(
          canvasRef.current,
          process.env.REACT_APP_URL +
            "#/welcomevisitor/?cmpId=" +
            cmpData.qrstring,
          (error) => {
            if (error) {
              // console.error("Error while genratting  QR code:", error);
            }
          }
        );
      }
    }
    setLoading(false);
  }, [cmpData]);

  const getStatusColors = (status) => {
    const statusColors = {
      Active: "#0D4D8B",
      Inactive: "#AD1820",
    };

    return statusColors[status];
  };
  const getStatusBackgrounds = (status) => {
    const statusColors = {
      Active: "rgba(6, 84, 139, 0.06)",
      Inactive: "rgba(173, 24, 32, 0.06)",
    };
    return statusColors[status] || "#fff";
  };

  const handleActivePopUp = () => {
    setActivePopUp(true);
  };

  const handleCloseActivePopUp = () => {
    setActivePopUp(false);
    setReasonInput("");
  };

  const handleInactivePopUp = () => {
    setInactivePopUp(true);
  };

  const handleCloseInactivePopUp = () => {
    setInactivePopUp(false);
    setReasonInput("");
  };

  const handleReasonInput = (e) => {
    setReasonInput(e.value);
  };

  const handleActivateSave = async () => {
    if (reasonInput == "" || reasonInput == null) {
      return toastDisplayer("error", "Reason is required.");
    }
    handleStatusChange("I");
  };
  const handleInactivateSave = async () => {
    handleStatusChange("A");
  };

  const handleStatusChange = async (status) => {
    setLoading(true);
    const reqPayload = {
      cmpid: cmpData.transid,
      status: status,
      reason: reasonInput,
    };
    var response = await changeCmpStatus(reqPayload);
    setLoading(false);
    if (response.hasError) {
      return toastDisplayer("error", response.error);
    } else {
      if (status == "A") {
        toastDisplayer("success", "Company activated successfully.");
      } else {
        toastDisplayer("success", "Company deactivated successfully.");
      }
      navigate("/Company");
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const imageUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = cmpData?.bname;
    link.click();
  };

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
            <HeaderText text="Detail of Company" />
          </div>
          <div className="title-section-btn">
            {cmpData && (
              <>
                {cmpData?.status == "A" && (
                  <>
                    <Button
                      text={"Inactive"}
                      width={140}
                      height={44}
                      className="button-with-margin"
                      onClick={handleActivePopUp}
                      stylingMode="outlined"
                    />
                  </>
                )}
                {cmpData?.status == "I" && (
                  <>
                    <Button
                      text={"Active"}
                      width={140}
                      height={44}
                      className="button-with-margin"
                      onClick={handleInactivePopUp}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Breadcrumbs />
      <div className="cmpProfile">
        <div className="content-block dx-card">
          <div className="upper-section">
            <div className="title-section" style={{ marginLeft: "4px" }}>
              <span
                className="header-state"
                style={{
                  backgroundColor: getStatusBackgrounds(
                    cmpData?.status == "A" ? "Active" : "Inactive"
                  ),
                }}
              >
                <span
                  className="status-circle"
                  style={{
                    backgroundColor: getStatusColors(
                      cmpData?.status == "A" ? "Active" : "Inactive"
                    ),
                  }}
                />
                <span
                  data-type={cmpData?.status == "A" ? "Active" : "Inactive"}
                >
                  {cmpData?.status == "A" ? "Active" : "Inactive"}
                </span>
              </span>
            </div>

            <div className="cmpHeader">
              <div className={"form-avatar"}>
                {/* <img alt={"Profile"} src={"ProfileQr"} /> */}
                <canvas ref={canvasRef}></canvas>
                <div className="download-overlay" onClick={handleDownload}>
                  <span className="download-text">
                    <AddAPhotoOutlinedIcon />
                  </span>
                </div>
              </div>
              <div className="about-profile">
                <span className="portal-name">Admin Portal</span>
                <div className="name-address">
                  <span className="bname">{cmpData?.bname}</span>

                  <span>|</span>
                  <span className="cityTxt">{cmpData?.blocation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-block dx-card">
          <div className="edit-profile-section">
            <div className="">
              <span>Reason</span>
            </div>
            <TextBox
              //   label="User Name"
              labelMode="static"
              stylingMode="outlined"
              //   className="step-textbox"
              height={"56px"}
              width={"304px"}
              value={cmpData?.reason}
              readOnly={true}
            />
          </div>
        </div>
        <div className="content-block dx-card">
          <div className="edit-profile-section">
            <div className="profile-section-header">
              <FormText text="Companies Details" />
            </div>
            <div className="profile-section-editor">
              <TextBox
                label="Name of the Company"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                value={cmpData?.bname}
                readOnly={true}
              />
              <TextBox
                label="Mobile Number"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                value={cmpData?.phone1}
                readOnly={true}
              />
            </div>
            <div className="profile-section-editor">
              <TextBox
                label="Phone"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                value={cmpData?.phone2}
                readOnly={true}
              />

              <TextBox
                label="Email Address"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                readOnly={true}
                value={cmpData?.e_mail}
              />
            </div>
            <div className="profile-section-editor">
              <TextBox
                label="Website Link "
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                value={cmpData?.websitelink}
                readOnly={true}
              />
            </div>
          </div>
        </div>
        <div className="content-block dx-card">
          <div className="edit-profile-section">
            <div className="profile-section-header">
              <FormText text="Registered Address" />
            </div>
            <div className="profile-section-editor">
              <TextBox
                label="Company Address"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                value={cmpData?.blocation}
                readOnly={true}
              />

              <TextBox
                label="City"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                value={cmpData?.city}
                readOnly={true}
              />
            </div>
            <div className="profile-section-editor">
              <TextBox
                label="Pincode"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                value={cmpData?.zipcode}
                readOnly={true}
              />
              <TextBox
                label="State"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                value={cmpData?.state}
                readOnly={true}
              />
            </div>
            <div className="profile-section-editor">
              <TextBox
                label="Country"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                value={cmpData?.country}
                readOnly={true}
              />
            </div>
          </div>
        </div>
        <div className="content-block dx-card">
          <div className="edit-profile-section">
            <div className="profile-section-header">
              <FormText text="Subscription Details" />
            </div>
            <div className="profile-section-editor">
              <TextBox
                label="Plan"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                // value={formData.bname}
                // onValueChanged={(e) => handleInputChange("bname", e.value)}
                // readOnly={!isCmp}
              />
              <TextBox
                label="Number of users"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                // value={formData.phone1}
                // onValueChanged={(e) => handleInputChange("phone1", e.value)}
                // readOnly={!isCmp}
              />
            </div>
            <div className="profile-section-editor">
              <TextBox
                label="Status"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                // value={formData.phone2}
                // onValueChanged={(e) => handleInputChange("phone2", e.value)}
                // readOnly={!isCmp}
              />

              <TextBox
                label="Valid Till"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                // readOnly={true}
                // value={companyData.e_mail}
              />
            </div>
          </div>
        </div>
      </div>

      {activePopUp && (
        <>
          <ChangeCmpStatus
            header={"Make it Inactive"}
            subHeader={"Mention Reasons"}
            btnTxt={"Deactivate"}
            isVisible={activePopUp}
            closePopUpHandle={handleCloseActivePopUp}
            isActive={false}
            handleReasonInput={handleReasonInput}
            handleSubmit={handleActivateSave}
            loading={loading}
          />
        </>
      )}
      {inactivePopUp && (
        <>
          <ChangeCmpStatus
            header={"Make it Active"}
            subHeader={"Mention Reasons"}
            btnTxt={"Activate"}
            isVisible={inactivePopUp}
            closePopUpHandle={handleCloseInactivePopUp}
            isActive={true}
            handleReasonInput={handleReasonInput}
            handleSubmit={handleInactivateSave}
            loading={loading}
          />
        </>
      )}
    </>
  );
}

export default CompanyDeails;
