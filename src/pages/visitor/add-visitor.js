import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../components/breadcrumbs/BreadCrumbs";
import {
  FormText,
  HeaderText,
} from "../../components/typographyText/TypograghyText";
import {
  Button,
  DateBox,
  LoadPanel,
  SelectBox,
  TextBox,
} from "devextreme-react";
import { Button as TextBoxButton } from "devextreme-react/text-box";
import SendVerification from "../../components/popups/send-verification";
import { PopUpIcon } from "../../assets";
import OtpPopup from "../../components/popups/otp-popup";
import Validator, {
  CustomRule,
  RequiredRule,
  EmailRule,
  PatternRule,
} from "devextreme-react/validator";
import { toastDisplayer } from "../../components/toastDisplayer/toastdisplayer";
import { useAuth } from "../../contexts/auth";
import { GetCmpDept } from "../../api/userAPI";
import { requestOtp } from "../../api/registorApi";
import { registerVisitorApi } from "../../api/mobileVisitorApi";
import CustomLoader from "../../components/customerloader/CustomLoader";
import { useLocation, useNavigate } from "react-router-dom";
import { saveNotification } from "../../api/notification";
import { useRecoilState } from "recoil";
import { configAtom } from "../../contexts/atom";
import { getCompanyUser } from "../../api/visitorApi";

const AddVisitor = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isOtpPopupVisible, setIsOtpPopupVisible] = useState(false);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    e_mail: "",
    company: "",
    location: "",
    meetPerson: "",
    cmpdeptid: "",
    timeslot: null,
    hardware: "",
    purpose: "",
  });
  const [cloneData, setCloneData] = useState(null);
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (state) {
      const providedDate = new Date(state?.timeslot);
      const adjustedDate = new Date(
        providedDate.getTime() - 5 * 60 * 60 * 1000 - 30 * 60 * 1000
      );
      state.timeslot = adjustedDate;

      // cloneData?.vName : formData?.username
      // cloneData?.vEmail : formData?.e_mail
      // cloneData?.vPhone1 : formData?.phone1
      // cloneData?.vCmpname : formData?.company
      // cloneData?.vLocation : formData?.location
      // cloneData?.cnctperson : formData?.meetPerson
      // cloneData?.deptId : formData?.cmpdeptid
      // cloneData?.timeslot : formData.timeslot
      // cloneData?.anyhardware : formData?.hardware
      // cloneData?.purposeofvisit : formData?.purpose

      // formData.username = cloneData?.vName;
      // formData.e_mail = cloneData?.vEmail;
      // formData.phone1 = cloneData?.vPhone1;
      // formData.company = cloneData?.vCmpname;
      // formData.location = cloneData?.vLocation;
      // formData.meetPerson = cloneData?.cnctperson;
      // formData.cmpdeptid = cloneData?.deptId;
      // formData.timeslot = adjustedDate;
      // formData.hardware = cloneData?.anyhardware;
      // formData.purpose = cloneData?.purposeofvisit;

      setFormData((prev) => ({
        ...prev,
        username: state?.vName,
        e_mail: state?.vEmail,
        phone1: state?.vPhone1,
        company: state?.vCmpname,
        location: state?.vLocation,
        meetPerson: state?.cnctperson,
        cmpdeptid: state?.deptId,
        timeslot: adjustedDate,
        hardware: state?.anyhardware,
        purpose: state?.purposeofvisit,
      }));

      setCloneData(state);
    }
  }, []);

  const validateFields = () => {
    const requiredFields = [
      "username",
      "e_mail",
      "company",
      "meetPerson",
      "cmpdeptid",
      "timeslot",
      "location",
      // "hardware",
      "purpose",
    ];
    return requiredFields.every((field) => formData[field]);
  };
  const [isOTPVerified, setIsOTPVrified] = useState(false);
  const [deptData, setDeptData] = useState([]);
  const [companyUserData, setCompanyUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refFocused, setrefFocused] = useState(false);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedData, setVerifiedData] = useState(null);

  const [stagedChanges, setStagedChanges] = useRecoilState(configAtom);

  const currentDate = new Date();

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const handleOpenPopup = (e) => {
    e.preventDefault();

    if (stagedChanges.OtpVerification === true) {
      if (isOTPVerified) {
        if (!validateFields()) {
          return toastDisplayer(
            "error",
            "Please complete all required fields."
          );
        }
        setIsPopupVisible(true);
      } else {
        toastDisplayer("error", "Email or Phone is not verified.");
      }
    } else {
      setIsPopupVisible(true);
    }
  };

  const handleCloseOtpPopup = () => {
    setrefFocused(false);
    setIsOtpPopupVisible(false);
  };

  const mobileOption = {
    isDisabled: true,
    icon: PopUpIcon,
    onClick: () => {
      OtpBtnHandler();
    },
  };

  const selectOption = {
    icon: PopUpIcon,
    onClick: () => {
      navigate("/generalsettings");
    },
  };

  const handleDateChange = (field, e) => {
    const dateValue = e.value;
    // const formattedDate = formatDateTime(dateValue);
    setFormData((prev) => ({
      ...prev,
      [field]: dateValue,
    }));
  };

  const handleInputChange = (field, e) => {
    if (field == "e_mail") {
      if (
        verifiedData?.officialMail == e.value &&
        verifiedData?.mobile == formData?.phone1
      ) {
        setIsOTPVrified(true);
      } else {
        setIsOTPVrified(false);
      }
    }
    if (field == "phone1") {
      if (
        verifiedData?.officialMail != formData?.e_mail ||
        verifiedData?.mobile != e.value
      ) {
        setIsOTPVrified(false);
      } else {
        setIsOTPVrified(true);
      }
    }
    if (field == "cmpdeptid") {
      if (e.value == "specialAction") {
        navigate("/generalsettings");
      }
    }
    if (field == "meetPerson") {
      if (e.value == "specialAction") {
        navigate("/Users-Settings");
      }
    }
    const value = e.value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));

    if (field === "meetPerson") {
      const selectedUser = companyUserData.find(
        (user) => user.username === value
      );

      if (selectedUser) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          cmpdeptid: selectedUser.cmpdeptid,
        }));
      }
    }
  };

  const GenerateOTP = async (officialMail, type, mobile) => {
    setLoading(true);
    setrefFocused(true);
    const getOtpFromID = await requestOtp(officialMail, type, mobile);
    if (getOtpFromID.hasError === true) {
      setLoading(false);
      return toastDisplayer("error", getOtpFromID.errorMessage);
    } else {
      setrefFocused(true);
      setIsOtpPopupVisible(true);
      setVerifiedData({ officialMail, mobile });
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
    const mobileRegex = /^\d{10}$/;
    const isMobileMatch = mobileRegex.test(formData?.phone1);
    if (!isMobileMatch) {
      return toastDisplayer(
        "error",
        "Please enter a valid 10-digit mobile number."
      );
    }
    GenerateOTP(formData?.e_mail, "visitor", formData?.phone1);
  };

  const fetchDeptData = async () => {
    setLoading(true);
    const response = await GetCmpDept(user.cmpid);
    if (response.hasError === true) {
      setLoading(false);
      // return toastDisplayer("error", getOtpFromID.errorMessage);

      return toastDisplayer("error", "Department data not found.");
    } else {
      // setDeptData(response.responseData.Data);
      const specialActionItem = {
        transid: 0,
        deptname: "Special Action",
        transid: "specialAction",
      };
      setDeptData([...response.responseData.Data, specialActionItem]);
      setLoading(false);
      return toastDisplayer("suceess", "OTP send successfully.");
    }
  };

  const fetchCompanyUser = async () => {
    setLoading(true);
    const response = await getCompanyUser(user.cmpid);
    if (response.hasError === true) {
      setLoading(false);
      return toastDisplayer("error", "Company user not found.");
    } else {
      const specialActionItem = {
        transid: 0,
        username: "Special Action",
        username: "specialAction",
      };
      setCompanyUserData([...response.responseData.Data, specialActionItem]);
      // setCompanyUserData(response.responseData.Data);
      setLoading(false);
    }
  };

  // Custom item template
  const itemTemplate = (data) => {
    if (data.transid === "specialAction") {
      return `<span style="color: blue;">Add</span>`;
    }
    return data.deptname;
  };

  // Custom item template for user
  const useritemTemplate = (data) => {
    if (data.username === "specialAction") {
      return `<span style="color: blue;">Add</span>`;
    }
    return data.username;
  };

  useEffect(() => {
    fetchDeptData();
    fetchCompanyUser();
  }, []);

  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    const secondsStr = seconds < 10 ? "0" + seconds : seconds;

    const monthStr = month < 10 ? `0${month}` : `${month}`;
    return `${date.getDate()}/${monthStr}/${year} at ${hours}:${minutesStr}:${secondsStr} ${ampm}`;
    // return strTime;
  }

  const handleSaveFunction = async () => {
    // if (isOTPVerified) {
    if (!validateFields()) {
      return toastDisplayer("error", "Please complete all required fields.");
    }

    const formattedTimeslot = formData.timeslot
      ? formatDateTime(new Date(formData.timeslot))
      : null;
    const reqPayload = {
      vname: formData.username,
      e_mail: formData.e_mail,
      phone1: formData.phone1,
      company_id: user.cmpid,
      vcmpname: formData.company,
      vlocation: formData.location,
      cnctperson: formData.meetPerson,
      department_id: formData.cmpdeptid,
      timeslot: formattedTimeslot,
      anyhardware: formData.hardware,
      purposeofvisit: formData.purpose,
      vavatar: "",
      createdby: user.transid,
      reason: "",
      sender_email: user.e_mail,
      sender_role: user.userrole,
    };

    setLoading(true);
    const response = await registerVisitorApi(reqPayload);
    saveNotification(
      "Visitors",
      user.e_mail,
      "Visitor",
      `${formData.username} has been successfully registered to meet ${
        formData.meetPerson
      } on ${formatDateTime(formData.timeslot)}`,
      user.cmpid
    );
    if (response.hasError === true) {
      setLoading(false);
      return toastDisplayer("error", response.error);
    } else {
      setLoading(false);
      // setFormData({});
      setIsPopupVisible(false);
      toastDisplayer(
        "success",
        `${formData.username} has been successfully registered to meet ${
          formData.meetPerson
        } on ${formatDate(formData.timeslot)}`
      );
      setStatus("success");
      // setTimeout(() => {
      setStatus(null);
      setIsPopupVisible(false);
      // }, 2400);
      return navigate("/Visitors");
    }
    // } else {
    //   toastDisplayer("error", "Email or Phone is not verified.");
    // }
  };
  const validateDate = (e) => {
    const selectedDate = new Date(e.value);
    if (selectedDate.getTime() <= currentDate.getTime()) {
      return false;
    }
    return true;
  };

  return (
    <>
      {loading && (
        <div className="Myloader">
          <CustomLoader />
        </div>
      )}
      <form onSubmit={handleOpenPopup}>
        <div className="content-block">
          <div className="navigation-header">
            <div className="title-section">
              <HeaderText text="Add Visitors" />
            </div>
            <div className="title-section-btn">
              <Button
                text="Send for Verify"
                width={140}
                height={44}
                className="button-with-margin"
                // onClick={handleOpenPopup}
                useSubmitBehavior={true}
              />
            </div>
          </div>
        </div>
        <Breadcrumbs />

        <div className="content-block dx-card">
          <div className="title-section">
            <FormText text="Personal Details" />
          </div>
          <div className="personal-detail-form">
            <div className="form-input">
              <TextBox
                label="Name"
                placeholder="What's visitor name?"
                labelMode="static"
                stylingMode="outlined"
                onValueChanged={(e) => handleInputChange("username", e)}
                value={formData && formData?.username}
                className="required"
              >
                <Validator>
                  <RequiredRule message="Username is required" />
                </Validator>
              </TextBox>
            </div>
            <div className="form-input popup-textbox">
              <TextBox
                label="Email Address"
                placeholder="Enter email address"
                labelMode="static"
                stylingMode="outlined"
                onValueChanged={(e) => handleInputChange("e_mail", e)}
                // readOnly={isOTPVerified}
                value={formData && formData?.e_mail}
                style={{ cursor: "pointer" }}
                valueChangeEvent="keyup"
                className="required"
              >
                {/* <TextBoxButton
                  name="popupSearch"
                  location="after"
                  options={mobileOption}
                /> */}
                <Validator>
                  <RequiredRule message="Email address is required." />
                  <EmailRule message="Email is invalid" />
                </Validator>
              </TextBox>
              {/* )} */}
            </div>
          </div>
          <div className="personal-detail-form">
            <div className="form-input popup-textbox">
              <TextBox
                label="Mobile"
                placeholder="Input"
                labelMode="static"
                stylingMode="outlined"
                onValueChanged={(e) => handleInputChange("phone1", e)}
                value={formData && formData?.phone1}
                className="required"
                valueChangeEvent="keyup"
                // readOnly={isOTPVerified}
              >
                {stagedChanges &&
                  stagedChanges.OtpVerification &&
                  !isOTPVerified && (
                    <TextBoxButton
                      name="popupSearch"
                      location="after"
                      options={mobileOption}
                    />
                  )}
                {/* <TextBoxButton
                  name="popupSearch"
                  location="after"
                  options={mobileOption}
                  visible={false}
                  // visible={stagedChanges && stagedChanges.OtpVerification} // Control visibility
                /> */}
                <Validator>
                  <RequiredRule message="Mobile is required" />
                  <PatternRule
                    message="Invalid mobile number"
                    pattern="^\d{10}$"
                  />
                </Validator>
              </TextBox>
            </div>

            {/* <div className="form-input  popup-textbox">
              {stagedChanges && stagedChanges.OtpVerification ? (
                <>
                  <TextBox
                    label="Mobile"
                    placeholder="Input"
                    labelMode="static"
                    stylingMode="outlined"
                    onValueChanged={(e) => handleInputChange("phone1", e)}
                    value={formData && formData?.phone1}
                    className="required"
                    // maxLength={10}
                  >
                    <TextBoxButton
                      name="popupSearch"
                      location="after"
                      options={mobileOption}
                    />
                    <Validator>
                      <RequiredRule message="Mobile is required" />
                      <PatternRule
                        message="Invalid mobile number"
                        pattern="^\d{10}$"
                      />
                    </Validator>
                  </TextBox>
                </>
              ) : (
                <>
                  <TextBox
                    label="Mobile"
                    placeholder="Input"
                    labelMode="static"
                    stylingMode="outlined"
                    onValueChanged={(e) => handleInputChange("phone1", e)}
                    value={formData && formData?.phone1}
                    className="required"
                    // maxLength={10}
                  >
                    <Validator>
                      <RequiredRule message="Mobile is required" />
                      <PatternRule
                        message="Invalid mobile number"
                        pattern="^\d{10}$"
                      />
                    </Validator>
                  </TextBox>
                </>
              )}
            </div> */}
            <div className="form-input">
              <TextBox
                placeholder="In which company visitor work"
                label="Name of the Company"
                labelMode="static"
                stylingMode="outlined"
                onValueChanged={(e) => handleInputChange("company", e)}
                className="required"
                value={formData && formData?.company}
              >
                <Validator>
                  <RequiredRule message="Company is required" />
                </Validator>
              </TextBox>
            </div>
          </div>
          <div className="personal-detail-form">
            <div className="form-input">
              <TextBox
                placeholder="Enter company's address"
                label="Company Address"
                labelMode="static"
                stylingMode="outlined"
                onValueChanged={(e) => handleInputChange("location", e)}
                value={formData && formData?.location}
                className="required"
              >
                <Validator>
                  <RequiredRule message="Location is required" />
                </Validator>
              </TextBox>
            </div>
          </div>
        </div>

        <div className="content-block dx-card">
          <div className="title-section">
            <FormText text="Other Details" />
          </div>
          <div className="personal-detail-form">
            <div className="form-input">
              <SelectBox
                label="Contact Person"
                placeholder="Whom do they want to meet?"
                labelMode="static"
                stylingMode="outlined"
                onValueChanged={(e) => handleInputChange("meetPerson", e)}
                items={companyUserData}
                displayExpr={"username"}
                valueExpr={"username"}
                value={formData && formData?.meetPerson}
                itemTemplate={useritemTemplate}
                searchEnabled={true}
                className="required"
              >
                <Validator>
                  <RequiredRule message="Contact Person is required" />
                </Validator>
              </SelectBox>
            </div>
            <div className="form-input">
              <SelectBox
                label="Department"
                placeholder="Select Department"
                labelMode="static"
                stylingMode="outlined"
                onValueChanged={(e) => handleInputChange("cmpdeptid", e)}
                items={deptData}
                displayExpr={"deptname"}
                valueExpr={"transid"}
                value={formData && formData?.cmpdeptid}
                itemTemplate={itemTemplate}
                className="required"
                searchEnabled={true}
              >
                <Validator>
                  <RequiredRule message="Department is required" />
                </Validator>
              </SelectBox>
            </div>
          </div>
          <div className="personal-detail-form">
            <div className="form-input">
              <DateBox
                labelMode="static"
                stylingMode="outlined"
                type="datetime"
                label="Time Slot"
                height={"56px"}
                placeholder="Select Time Slot"
                displayFormat="dd-MM-yyyy, HH:mm:ss"
                onValueChanged={(e) => handleDateChange("timeslot", e)}
                value={formData.timeslot}
                // value={formData.timeslot}
                // min={currentDate}
                className="required"
              >
                <Validator>
                  <CustomRule
                    message="Cannot select a previous time"
                    validationCallback={validateDate}
                  />
                  <RequiredRule message="Time Slot is required" />
                </Validator>
              </DateBox>
            </div>
            <div className="form-input">
              <TextBox
                placeholder="Any hardware carrying laptop/phone etc?"
                label="Hardware"
                labelMode="static"
                stylingMode="outlined"
                onValueChanged={(e) => handleInputChange("hardware", e)}
                value={formData && formData?.hardware}
              >
                {/* <Validator>
                  <RequiredRule message="Feild is required" />
                </Validator> */}
              </TextBox>
            </div>
          </div>
          <div className="personal-detail-form">
            <div className="form-input full-width">
              <TextBox
                label="Purpose of Visit"
                placeholder="Why they want to visit?"
                labelMode="static"
                stylingMode="outlined"
                onValueChanged={(e) => handleInputChange("purpose", e)}
                value={formData && formData?.purpose}
                className="required"
              >
                <Validator>
                  <RequiredRule message="Purpose of Visit is required" />
                </Validator>
              </TextBox>
            </div>
          </div>
        </div>
      </form>
      <SendVerification
        header="Send for Verification"
        subHeader="Send for approval?"
        approval="Send"
        discard="Discard"
        saveFunction={handleSaveFunction}
        status={status}
        isVisible={isPopupVisible}
        // isVisible={true}
        onHide={handleClosePopup}
        loading={loading}
      />
      <OtpPopup
        header="OTP Verification"
        subHeader={`Sent to ${formData?.e_mail}`}
        isVisible={isOtpPopupVisible}
        onHide={handleCloseOtpPopup}
        email={`${formData?.e_mail}`}
        role={"visitor"}
        isBtnVisible={true}
        setIsOTPVrified={setIsOTPVrified}
        GenerateOTP={GenerateOTP}
        setrefFocused={setrefFocused}
        refFocused={refFocused}
        setLoading={setLoading}
        isOTPVerified={isOTPVerified}
        loading={loading}
      />
    </>
  );
};

export default AddVisitor;
