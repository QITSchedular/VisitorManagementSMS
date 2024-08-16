import { Button, SelectBox, TextBox } from "devextreme-react";
import React, { useEffect, useState } from "react";
import { HeaderText } from "../../../components/typographyText/TypograghyText";
import "./add-user.scss";
import { Button as TextBoxButton } from "devextreme-react/text-box";
import { PopUpIcon } from "../../../assets";
import OtpPopup from "../../../components/popups/otp-popup";
import {
  RequiredRule,
  EmailRule,
  Validator,
  PatternRule,
} from "devextreme-react/validator";
import { requestOtp } from "../../../api/registorApi";
import { useAuth } from "./../../../contexts/auth";
import { GetCmpDept, SaveUserData } from "../../../api/userAPI";
import { toastDisplayer } from "../../../components/toastDisplayer/toastdisplayer";
import CustomLoader from "../../../components/customerloader/CustomLoader";
import { eyeclose, eyeopen } from "../../../assets/icon";
// import { eyeopen, eyeclose } from "../../assets/icon";

const AddUser = ({ setLoading, setActiveTabIndex }) => {
  const [isOtpPopupVisible, setIsOtpPopupVisible] = useState(false);
  const [formData, setFormData] = useState(null);
  const [refFocused, setrefFocused] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [isOTPVerified, setIsOTPVrified] = useState(false);
  const { user } = useAuth();
  const [deptData, setDeptData] = useState([]);
  const [showpwd, setShowPwd] = useState(false);
  const [passwordMode, setPasswordMode] = useState("password");

  const loadDeptData = async () => {
    setLoading(true);
    const response = await GetCmpDept(user.cmpid);
    if (response.hasError === true) {
      setLoading(false);
      // return toastDisplayer("error", getOtpFromID.errorMessage);
      return toastDisplayer("error", response.errorMessage);
    } else {
      setDeptData(response.responseData?.Data);
      setLoading(false);
    }
  };
  useEffect(() => {
    loadDeptData();
  }, []);

  const GenerateOTP = async (officialMail, type, phone) => {
    // setIsOtpPopupVisible(true);

    setLoading(true);
    setrefFocused(true);
    const getOtpFromID = await requestOtp(officialMail, type, phone);

    if (getOtpFromID.hasError === true) {
      setLoading(false);
      return toastDisplayer("error", getOtpFromID.error);
    } else {
      setrefFocused(true);
      setIsOtpPopupVisible(true);
      setLoading(false);
      return toastDisplayer("success", "OTP send successfully");
    }
  };

  const OtpBtnHandler = () => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const isMatch = regex.test(formData?.e_mail);

    if (isMatch === false) {
      return toastDisplayer("error", "Please enter a valid email address.");
    }
    GenerateOTP(formData?.e_mail, "user",formData?.phone);
  };

  const mobileOption = {
    isDisabled: true,
    icon: PopUpIcon,
    onClick: OtpBtnHandler,
  };
  const handleCloseOtpPopup = () => {
    setrefFocused(false);
    setIsOtpPopupVisible(false);
  };
  const userType = [
    {
      Text: "Manager",
      Value: "Admin",
    },
    {
      Text: "Employee",
      Value: "User",
    },
  ];
  const Genders = ["Male", "Female"];

  const handleClick = async () => {
    if (isOTPVerified) {
      const requiredFields = ["username", "password", "e_mail", "cmpdeptid"];

      const hasEmptyField = requiredFields.find((field) => !formData[field]);
      if (hasEmptyField) {
      }
      const reqPayload = {
        username: formData?.username,
        password: formData?.password,
        e_mail: formData?.e_mail,
        phone: formData?.phone,
        cmptransid: user.cmpid,
        deptName: formData?.deptName || "",
        cmpdeptid: formData?.cmpdeptid,
        gender: formData?.gender || null,
        usertype: formData?.usertype,
        changepassstatus: 0,
        company_id: user.cmpid,
        sender_email: user.e_mail,
        sender_role: user.userrole,
      };
      setLoading(true);
      const response = await SaveUserData(reqPayload);
      if (response.hasError === true) {
        setLoading(false);
        return toastDisplayer("error", response.errorMessage);
      } else {
        setLoading(false);
        setFormData(null);
        setIsOTPVrified(false);
        setActiveTabIndex(1);
        return toastDisplayer(
          "success",
          `${formData?.username} has been successfully created in the ${formData?.deptName} Department as a ${formData?.usertype}.`
        );
      }
    } else {
      return toastDisplayer("error", "Please verify the OTP.");
    }
  };

  const handleInputChange = (fieldName, e) => {
    if (fieldName == "cmpdeptid") {
      var deptEntryData = deptData.find((item) => item.transid == e.value);
      if (deptEntryData?.deptname) {
        setFormData((prevState) => ({
          ...prevState,
          ["deptName"]: deptEntryData?.deptname,
        }));
      }
    }
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: e.value,
    }));
  };

  return (
    <>
      {/* <LoadPanel visible={true} shadingColor="rgba(0,0,0,0.4)" /> */}
      {/* {loading && <LoadPanel visible={true} shadingColor="rgba(0,0,0,0.4)" />} */}
      {/* {loading && (
        <div className="Myloader">
          <CustomLoader />
        </div>
      )} */}
      <div className="dx-card" style={{ marginTop: "16px" }}>
        <div className="navigation-header-main">
          <div className="title-section">
            <HeaderText text="Add Users" />
          </div>
          <div className="title-section-btn">
            <Button
              text="Save Details"
              width={140}
              height={44}
              // className="button-with-margin"
              onClick={handleClick}
              useSubmitBehavior={true}
            />
          </div>
        </div>
        <form>
          <div className="personal-detail-form">
            <div className="form-input">
              <SelectBox
                label="User Type"
                placeholder="Enter user's type"
                labelMode="static"
                stylingMode="outlined"
                items={userType}
                displayExpr={"Text"}
                valueExpr={"Value"}
                onValueChanged={(e) => handleInputChange("usertype", e)}
                defaultValue={formData?.userType}
                className="required"
              >
                <Validator>
                  <RequiredRule message="Usertype is required" />
                </Validator>
              </SelectBox>
            </div>
            <div className="form-input">
              <TextBox
                label="Name"
                placeholder="Enter name"
                labelMode="static"
                stylingMode="outlined"
                onValueChanged={(e) => handleInputChange("username", e)}
                value={formData?.username}
                className="required"
              >
                <Validator>
                  <RequiredRule message="Username is required" />
                </Validator>
              </TextBox>
            </div>
          </div>
          <div className="personal-detail-form">
            <div className="form-input">
              <TextBox
                label="Password"
                placeholder="Enter password"
                // value={password}
                mode={passwordMode}
                labelMode="static"
                stylingMode="outlined"
                onValueChanged={(e) => handleInputChange("password", e)}
                value={formData?.password}
                className="required"
              >
                <TextBoxButton
                  name="password"
                  location="after"
                  options={{
                    icon: `${showpwd ? eyeopen : eyeclose}`,
                    stylingMode: "text",
                    onClick: () => {
                      setShowPwd(!showpwd);
                      setPasswordMode((prevPasswordMode) =>
                        prevPasswordMode === "text" ? "password" : "text"
                      );
                    },
                  }}
                />
                <Validator>
                  <RequiredRule message="Password is required." />
                </Validator>
              </TextBox>
            </div>
            <div className="form-input popup-textbox">
              <TextBox
                label="Mobile Number"
                placeholder="Enter mobile number"
                labelMode="static"
                stylingMode="outlined"
                onValueChanged={(e) => handleInputChange("phone", e)}
                value={formData?.phone}
              >
                <Validator>
                  {/* <RequiredRule message="Mobile is required" /> */}
                  <PatternRule
                    message="Invalid mobile number"
                    pattern="^\d{10}$"
                  />
                </Validator>
              </TextBox>
            </div>
          </div>
          <div className="personal-detail-form">
            <div className="form-input popup-textbox">
              <TextBox
                label="Email Address"
                placeholder="Enter your email address."
                labelMode="static"
                stylingMode="outlined"
                valueChangeEvent="keyup"
                onValueChanged={(e) => handleInputChange("e_mail", e)}
                readOnly={isOTPVerified}
                value={formData?.e_mail}
                className="required"
              >
                <TextBoxButton
                  name="popupSearch"
                  location="after"
                  options={mobileOption}
                />
                <Validator>
                  <RequiredRule message="Email address is required." />
                  <EmailRule message="Email is invalid" />
                </Validator>
              </TextBox>
            </div>
            <div className="form-input">
              <SelectBox
                label="Department"
                placeholder="Select department"
                labelMode="static"
                stylingMode="outlined"
                onValueChanged={(e) => handleInputChange("cmpdeptid", e)}
                items={deptData}
                displayExpr={"deptname"}
                valueExpr={"transid"}
                value={formData?.cmpdeptid}
                className="required"
              >
                <Validator>
                  <RequiredRule message="Department is required" />
                </Validator>
              </SelectBox>
            </div>
          </div>
          <div className="personal-detail-form">
            <div className="form-input">
              <SelectBox
                label="Gender"
                placeholder="Select gender"
                labelMode="static"
                stylingMode="outlined"
                items={Genders}
                onValueChanged={(e) => handleInputChange("gender", e)}
                value={formData?.gender}
              ></SelectBox>
            </div>
            <div className="form-input"></div>
          </div>
        </form>
      </div>
      <OtpPopup
        header="OTP Verification"
        subHeader={`Sent to ${formData?.e_mail}`}
        isVisible={isOtpPopupVisible}
        onHide={handleCloseOtpPopup}
        email={`${formData?.e_mail}`}
        role={"user"}
        isBtnVisible={true}
        setIsOTPVrified={setIsOTPVrified}
        isOTPVerified={isOTPVerified}
        GenerateOTP={GenerateOTP}
        setrefFocused={setrefFocused}
        refFocused={refFocused}
        setLoading={setLoading}
      />
    </>
  );
};

export default AddUser;
