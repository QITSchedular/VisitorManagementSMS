import React, { useEffect, useMemo, useState } from "react";
import {
  FormText,
  HeaderText,
} from "../../../components/typographyText/TypograghyText";
import { Button, DateBox, SelectBox, TextBox } from "devextreme-react";
import Validator, {
  CustomRule,
  RequiredRule,
  EmailRule,
  PatternRule,
} from "devextreme-react/validator";
import Breadcrumbs from "../../../components/breadcrumbs/BreadCrumbs";
import { useRecoilState } from "recoil";
import { stateAtom, statusAtom } from "../../../contexts/atom";
import SendVerification from "../../../components/popups/send-verification";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getCompanyUser,
  getVisitorDetailsApi,
  getVisitorEditedApi,
} from "../../../api/visitorApi";
import { toastDisplayer } from "../../../components/toastDisplayer/toastdisplayer";
import {
  checkInVisitorApi,
  checkOutVisitorApi,
} from "../../../api/mobileVisitorApi";
import { GettingDepratmentdata } from "../../../api/departmentAPi";
import EditSavePopup from "../../../components/popups/EditSavePopup";
import CustomLoader from "../../../components/customerloader/CustomLoader";
import { useAuth } from "../../../contexts/auth";
import CheckoutPopup from "../../../components/popups/CheckoutPopup";

import { GetCmpDept } from "../../../api/userAPI";

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
const getStatusColors = (status) => {
  const statusColors = {
    "Check in": "#0D4D8B",
    "Check Out": "#AD1820",
  };

  return statusColors[status];
};
const getStatusBackgrounds = (status) => {
  const statusColors = {
    "Check in": "rgba(6, 84, 139, 0.06)",
    "Check Out": "rgba(173, 24, 32, 0.06)",
  };
  return statusColors[status] || "#fff";
};
const VisitorDetail = () => {
  const [status] = useRecoilState(statusAtom);
  const [state] = useRecoilState(stateAtom);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isChkINPopupVisible, setIsChkNIPopupVisible] = useState(false);
  const { user } = useAuth();
  const [visitorDetailbrief, setVisitorDetailbrief] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [companyUserData, setCompanyUserData] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const visitorId = queryParams.get("visitorId");
  const currentDate = new Date();
  const [editingData, setEditingData] = useState({
    cnctperson: "",
    department_id: 1,
    timeslot: "",
    anyhardware: "",
    purposeofvisit: "",
    company_id: null,
    reason: "",
    createdby: null,
    vname: "",
    phone1: "",
    vcmpname: "",
    vlocation: "",
    e_mail: "",
    vavatar: "",
  });

  const getVisitorDetails = async () => {
    setIsLoading(true);
    const authState = JSON.parse(sessionStorage.getItem("authState"));
    const cmp_id = authState.user.cmpid;
    const detail = await getVisitorDetailsApi(cmp_id, visitorId);

    if (detail.hasError === true) {
      setIsLoading(false);
      return toastDisplayer("error", `${detail.error}`);
    }
    const visitorData = detail.responseData.Data;

    setEditingData({
      cnctperson: visitorData.cnctperson || "",
      department_id: visitorData.deptId || null,
      timeslot: formatDateTimeUTC(visitorData.timeslot),
      anyhardware: visitorData.anyhardware || "",
      purposeofvisit: visitorData.purposeofvisit || "",
      company_id: authState.user.cmpid || null,
      reason: visitorData.reason || "",
      createdby: authState.user.transid,
      vname: visitorData.vName || "",
      phone1: visitorData.vPhone1 || "",
      vcmpname: visitorData.vCmpname || "",
      vlocation: visitorData.vLocation || "",
      e_mail: visitorData.vEmail || "",
      vavatar: visitorData.vavatar,
      visitor_id: parseInt(visitorId),
    });
    setIsLoading(false);
    console.log(visitorData);
    setVisitorDetailbrief(visitorData);
  };

  useEffect(() => {
    setTimeout(() => {
      sessionStorage.setItem(
        "prevPath",
        `/Visitors/Details-of-Visitor?visitorId=${visitorId}`
      );
    }, 1000);
    getVisitorDetails();
  }, []);

  const handleOpenPopup = () => {
    setIsPopupVisible(true);
  };
  const handleChkINOpenPopup = () => {
    setIsChkNIPopupVisible(true);
  };
  const handleEditOpenPopup = () => {
    setIsEditPopupVisible(true);
  };
  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };
  const handleChkINClosePopup = () => {
    setIsChkNIPopupVisible(false);
  };
  const handleEditClosePopup = () => {
    setIsEditPopupVisible(false);
  };

  const handleEditVisitor = () => {
    setIsEdit(false);
  };

  const handleSaveVisitorEdit = async () => {
    setIsLoading(true);
    const editingRepsonse = await getVisitorEditedApi(editingData);
    if (editingRepsonse.hasError === true) {
      setIsLoading(false);
      return toastDisplayer("error", `${editingRepsonse.error}`);
    }
    toastDisplayer("success", `Edited Successfully `);
    setIsLoading(false);
    setStatusMessage("success");
    return setTimeout(() => {
      setStatusMessage(null);
      navigate("/Visitors");
    }, 2400);
  };

  const fetchDeptData = async () => {
    setIsLoading(true);
    const response = await GetCmpDept(user.cmpid);
    if (response.hasError === true) {
      setIsLoading(false);
      // return toastDisplayer("error", getOtpFromID.errorMessage);

      return toastDisplayer("error", "Department data not found.");
    }
    setDeptData([...response.responseData.Data]);
    setIsLoading(false);
    return toastDisplayer("suceess", "OTP send successfully.");
  };

  const fetchCompanyUser = async () => {
    setIsLoading(true);
    const response = await getCompanyUser(user.cmpid);
    if (response.hasError === true) {
      setIsLoading(false);
      return toastDisplayer("error", "Company user not found.");
    }
    setCompanyUserData([...response.responseData.Data]);
    // setCompanyUserData(response.responseData.Data);
    setIsLoading(false);
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    const authState = JSON.parse(sessionStorage.getItem("authState"));
    const cmpid = authState.user.cmpid;

    const payload = {
      e_mail: visitorDetailbrief.vEmail,
      company_id: cmpid,
      sender_email: user.e_mail,
      sender_role: user.userrole,
    };
    const checkOutVisitor = await checkOutVisitorApi(payload);
    setIsLoading(false);
    if (checkOutVisitor.hasError === true) {
      return toastDisplayer("error", `${checkOutVisitor.error}`);
    }

    setIsPopupVisible(false);

    toastDisplayer("success", "Visitor checked-out Successfully");
    return navigate("/Visitors");
  };

  useEffect(() => {
    fetchDeptData();
    fetchCompanyUser();
  }, []);

  const handleCheckIn = async () => {
    setIsLoading(true);
    const authState = JSON.parse(sessionStorage.getItem("authState"));
    const cmpid = authState.user.cmpid;
    const payload = {
      e_mail: visitorDetailbrief.vEmail,
      company_id: cmpid,
      sender_email: user.e_mail,
      sender_role: user.userrole,
    };
    const checkOutVisitor = await checkInVisitorApi(payload);
    setIsLoading(false);
    if (checkOutVisitor.hasError === true) {
      return toastDisplayer("error", `${checkOutVisitor.error}`);
    }
    setIsChkNIPopupVisible(false);
    toastDisplayer("success", "Visitor checked-in Successfully");
    return navigate("/Visitors");
  };

  const getDepartmentdata = async () => {
    const authState = JSON.parse(sessionStorage.getItem("authState"));
    const cmpid = authState.user.cmpid;
    const departmentData = await GettingDepratmentdata(cmpid);
    if (departmentData.hasError === true) {
    }
    return setDepartmentData(departmentData.repsonseData.Data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "cnctperson") {
      const selectedUser = companyUserData.find(
        (user) => user.username === value
      );
      if (selectedUser) {
        setEditingData((prev) => ({
          ...prev,
          cmpdeptid: selectedUser.cmpdeptid,
          department_id: selectedUser.cmpdeptid,
        }));
        return;
      }
    }
    if (name == "timeslot") {
      setEditingData((prev) => ({
        ...prev,
        [name]: formatDateTime(value),
      }));
      return;
    }

    setEditingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    getDepartmentdata();
  }, []);

  const formatDateTimeUTC = (dateString) => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
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
  const validateDate = (e) => {
    const selectedDate = new Date(e.value);
    if (selectedDate.getTime() <= currentDate.getTime()) {
      return false;
    }
    return true;
  };
  return (
    <>
      {isLoading && (
        <div className="Myloader">
          <CustomLoader />
        </div>
      )}

      <div className="content-block">
        <div className="navigation-header-main">
          <div className="title-section">
            <HeaderText text="Visitors" />
          </div>
          <div className="title-section-btn">
            {visitorDetailbrief.state === "Approved" &&
              visitorDetailbrief.status === "Check in" && (
                <Button
                  text="Check-out"
                  width="auto"
                  height={44}
                  onClick={handleOpenPopup}
                />
              )}
            {visitorDetailbrief.state === "Approved" &&
              visitorDetailbrief.addedBy === "Company" &&
              visitorDetailbrief.status !== "Check in" &&
              visitorDetailbrief.status !== "Check Out" &&
              new Date(visitorDetailbrief.timeslot) >=
                new Date().setHours(0, 0, 0, 0) && (
                <Button
                  text="Check-in"
                  width="auto"
                  height={44}
                  onClick={handleChkINOpenPopup}
                />
              )}
            {visitorDetailbrief.state === "Rejected" &&
              visitorDetailbrief.addedBy === "Company" && (
                <>
                  <Button
                    text="Send for Verify"
                    width="auto"
                    height={44}
                    onClick={handleEditOpenPopup}
                  />

                  {/* {isEdit && (
                    <Button
                      text="Edit"
                      width="auto"
                      height={44}
                      onClick={handleEditVisitor}
                    />
                  )} */}
                </>
              )}
          </div>
        </div>
      </div>
      <Breadcrumbs />
      <div className="content-block dx-card">
        <div className="title-section">
          <span
            className="header-state"
            style={{
              backgroundColor: getStatusBackground(visitorDetailbrief.state),
            }}
          >
            <span
              className="status-circle"
              style={{
                backgroundColor: getStatusColor(visitorDetailbrief.state),
              }}
            />
            <span data-type={visitorDetailbrief.state}>
              {visitorDetailbrief.state}
            </span>
          </span>
          <span
            className="header-status"
            style={{
              backgroundColor: getStatusBackgrounds(visitorDetailbrief.status),
            }}
          >
            <span
              className="status-circle"
              style={{
                backgroundColor: getStatusColors(visitorDetailbrief.status),
              }}
            />
            <span data-type={visitorDetailbrief.status}>
              {visitorDetailbrief.status}
            </span>
          </span>
        </div>
        <div className="visitor-personal-detail">
          <div className="visitor-personal-data">
            <div className="visitor-header">Reason</div>
            <div className="visitor-sub-header">
              {visitorDetailbrief.reason === "" ||
              visitorDetailbrief.reason === null
                ? "--"
                : visitorDetailbrief.reason}
            </div>
          </div>
        </div>
      </div>

      {((visitorDetailbrief.state !== "Rejected" &&
        visitorDetailbrief.state !== "Rejected") ||
        visitorDetailbrief.addedBy == "External") && (
        <div className="content-block dx-card">
          <div className="title-section">
            <FormText text="Personal Details" />
          </div>
          <div className="visitor-personal-detail">
            <div className="visitor-personal-data">
              <div className="visitor-header">Name</div>
              <div className="visitor-sub-header">
                {visitorDetailbrief.vName}{" "}
              </div>
            </div>
            <div className="visitor-personal-data">
              <div className="visitor-header">Email</div>
              <div className="visitor-sub-header">
                {visitorDetailbrief.vEmail === ""
                  ? "--"
                  : visitorDetailbrief.vEmail}
              </div>
            </div>
          </div>
          <div className="visitor-personal-detail">
            <div className="visitor-personal-data">
              <div className="visitor-header">Mobile Number</div>
              <div className="visitor-sub-header">
                {visitorDetailbrief.vPhone1 === ""
                  ? "--"
                  : visitorDetailbrief.vPhone1}
              </div>
            </div>
            <div className="visitor-personal-data">
              <div className="visitor-header">Name of the Company</div>
              <div className="visitor-sub-header">
                {visitorDetailbrief.vCmpname === ""
                  ? "--"
                  : visitorDetailbrief.vCmpname}
              </div>
            </div>
          </div>
          <div className="visitor-personal-detail">
            <div className="visitor-personal-data">
              <div className="visitor-header">Company Address</div>
              <div className="visitor-sub-header">
                {visitorDetailbrief.vLocation === ""
                  ? "--"
                  : visitorDetailbrief.vLocation}
              </div>
            </div>
          </div>
        </div>
        // )
      )}

      {((visitorDetailbrief.state !== "Rejected" &&
        visitorDetailbrief.state !== "Rejected") ||
        visitorDetailbrief.addedBy == "External") && (
        <div className="content-block dx-card">
          <div className="title-section">
            <FormText text="Other Details" />
          </div>
          <div className="visitor-personal-detail">
            <div className="visitor-personal-data">
              <div className="visitor-header">Contact Person</div>
              <div className="visitor-sub-header">
                {visitorDetailbrief.cnctperson === ""
                  ? "--"
                  : visitorDetailbrief.cnctperson}
              </div>
            </div>
            <div className="visitor-personal-data">
              <div className="visitor-header">Department</div>
              <div className="visitor-sub-header">
                {visitorDetailbrief.deptName === ""
                  ? "--"
                  : visitorDetailbrief.deptName}
              </div>
            </div>
          </div>
          <div className="visitor-personal-detail">
            <div className="visitor-personal-data">
              <div className="visitor-header">Time Slot</div>
              <div className="visitor-sub-header">
                {visitorDetailbrief.timeslot === "" ? (
                  "--"
                ) : (
                  <> {formatDate(visitorDetailbrief.timeslot)}</>
                )}
              </div>
            </div>
            <div className="visitor-personal-data">
              <div className="visitor-header">Hardware</div>
              <div className="visitor-sub-header">
                {visitorDetailbrief.anyhardware === ""
                  ? "--"
                  : visitorDetailbrief.anyhardware}
              </div>
            </div>
          </div>
          <div className="visitor-personal-detail">
            <div className="visitor-personal-data">
              <div className="visitor-header">Purpose of Visit</div>
              <div className="visitor-sub-header">
                {visitorDetailbrief.purposeofvisit === ""
                  ? "--"
                  : visitorDetailbrief.purposeofvisit}
              </div>
            </div>
          </div>
        </div>
        // )
      )}
      {visitorDetailbrief.state === "Rejected" &&
        visitorDetailbrief.state === "Rejected" &&
        visitorDetailbrief.addedBy != "External" && (
          <div className="content-block dx-card">
            <div className="title-section">
              <FormText text="Personal Details" />
            </div>
            <div className="visitor-personal-detail">
              <div className="visitor-personal-data">
                {/* <div className="visitor-header">Name</div>
            <div className="visitor-sub-header">{visitorDetailbrief.vName} </div> */}
                <TextBox
                  label="Name"
                  labelMode="static"
                  stylingMode="outlined"
                  height={"56px"}
                  // className="required"
                  className="last-textbox required"
                  defaultValue={visitorDetailbrief.vName}
                  //readOnly={isEdit}
                  onValueChanged={(e) =>
                    handleInputChange({
                      target: { name: "vname", value: e.value },
                    })
                  }
                >
                  <Validator>
                    <RequiredRule message="Username is required" />
                  </Validator>
                </TextBox>
              </div>
              <div className="visitor-personal-data">
                <TextBox
                  label="Email Address"
                  labelMode="static"
                  stylingMode="outlined"
                  height={"56px"}
                  className="last-textbox required"
                  //readOnly={isEdit}
                  defaultValue={visitorDetailbrief.vEmail}
                  onValueChanged={(e) =>
                    handleInputChange({
                      target: { name: "e_mail", value: e.value },
                    })
                  }
                >
                  <Validator>
                    <RequiredRule message="mobile is required" />
                  </Validator>
                </TextBox>
              </div>
            </div>
            <div className="visitor-personal-detail">
              <div className="visitor-personal-data">
                <TextBox
                  label="Mobile Number"
                  labelMode="static"
                  stylingMode="outlined"
                  height={"56px"}
                  className="last-textbox required"
                  //readOnly={isEdit}
                  defaultValue={visitorDetailbrief.vPhone1}
                  onValueChanged={(e) =>
                    handleInputChange({
                      target: { name: "phone1", value: e.value },
                    })
                  }
                >
                  <Validator>
                    <RequiredRule message="mobile is required" />
                    <PatternRule
                      message="Invalid mobile number"
                      pattern="^\d{10}$"
                    />
                  </Validator>
                </TextBox>
              </div>
              <div className="visitor-personal-data">
                <TextBox
                  label="Name of the Company"
                  labelMode="static"
                  stylingMode="outlined"
                  height={"56px"}
                  className="last-textbox required"
                  //readOnly={isEdit}
                  defaultValue={visitorDetailbrief.vCmpname}
                  onValueChanged={(e) =>
                    handleInputChange({
                      target: { name: "vcmpname", value: e.value },
                    })
                  }
                >
                  <Validator>
                    <RequiredRule message="Company is required" />
                  </Validator>
                </TextBox>
              </div>
            </div>
            <div className="visitor-personal-detail">
              <div className="visitor-personal-data">
                <TextBox
                  label="Company Address"
                  labelMode="static"
                  stylingMode="outlined"
                  height={"56px"}
                  className="last-textbox required"
                  //readOnly={isEdit}
                  defaultValue={visitorDetailbrief.vLocation}
                  onValueChanged={(e) =>
                    handleInputChange({
                      target: { name: "vlocation", value: e.value },
                    })
                  }
                >
                  <Validator>
                    <RequiredRule message="Location is required" />
                  </Validator>
                </TextBox>
              </div>
            </div>
          </div>
        )}

      {visitorDetailbrief.state === "Rejected" &&
        visitorDetailbrief.state === "Rejected" &&
        visitorDetailbrief.addedBy != "External" && (
          <div className="content-block dx-card">
            <div className="title-section">
              <FormText text="Other Details" />
            </div>
            <div className="visitor-personal-detail">
              <div className="visitor-personal-data">
                <SelectBox
                  label="Contact Person"
                  labelMode="static"
                  stylingMode="outlined"
                  height={"56px"}
                  className="last-textbox required"
                  defaultValue={visitorDetailbrief.cnctperson}
                  items={companyUserData}
                  displayExpr={"username"}
                  valueExpr={"username"}
                  //readOnly={isEdit}
                  searchEnabled={true}
                  onValueChanged={(e) =>
                    handleInputChange({
                      target: { name: "cnctperson", value: e.value },
                    })
                  }
                >
                  <Validator>
                    <RequiredRule message="Contact Person is required" />
                  </Validator>
                </SelectBox>
              </div>
              <div className="visitor-personal-data">
                <SelectBox
                  label="Department"
                  items={deptData}
                  displayExpr={"deptname"}
                  valueExpr={"transid"}
                  placeholder="Select Department"
                  labelMode="static"
                  stylingMode="outlined"
                  height={"56px"}
                  className="last-textbox required"
                  //readOnly={isEdit}
                  defaultValue={editingData.department_id}
                  searchEnabled={true}
                  onValueChanged={(e) =>
                    handleInputChange({
                      target: { name: "department_id", value: e.value },
                    })
                  }
                >
                  <Validator>
                    <RequiredRule message="Department is required" />
                  </Validator>
                </SelectBox>
              </div>
            </div>
            <div className="visitor-personal-detail">
              <div className="visitor-personal-data">
                <DateBox
                  labelMode="static"
                  stylingMode="outlined"
                  // placeholder={visitorDetailbrief.timeslot}
                  type="datetime"
                  label="Time Slot"
                  height={"56px"}
                  //readOnly={isEdit}
                  displayFormat="dd-MM-yyyy, HH:mm:ss"
                  onValueChanged={(e) =>
                    handleInputChange({
                      target: { name: "timeslot", value: e.value },
                    })
                  }
                  defaultValue={editingData.timeslot}
                  // selectedItem={visitorDetailbrief.timeslot}
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
              <div className="visitor-personal-data">
                <TextBox
                  label="Hardware"
                  labelMode="static"
                  stylingMode="outlined"
                  height={"56px"}
                  className="last-textbox"
                  //readOnly={isEdit}
                  defaultValue={visitorDetailbrief.anyhardware}
                  onValueChanged={(e) =>
                    handleInputChange({
                      target: { name: "anyhardware", value: e.value },
                    })
                  }
                />
              </div>
            </div>
            <div className="visitor-personal-detail">
              <div className="visitor-personal-data">
                <TextBox
                  label="Purpose of visit"
                  labelMode="static"
                  stylingMode="outlined"
                  height={"56px"}
                  className="last-textbox required"
                  //readOnly={isEdit}
                  defaultValue={visitorDetailbrief.purposeofvisit}
                  onValueChanged={(e) =>
                    handleInputChange({
                      target: { name: "purposeofvisit", value: e.value },
                    })
                  }
                >
                  <Validator>
                    <RequiredRule message="Purpose of Visit is required" />
                  </Validator>
                </TextBox>
              </div>
            </div>
          </div>
        )}

      <SendVerification
        header="Check-out Confirmation"
        subHeader="Are you sure you want visitor to check-out? "
        approval="Check-out"
        discard="Cancel"
        status={statusMessage}
        saveFunction={handleCheckOut}
        isVisible={isPopupVisible}
        onHide={handleClosePopup}
        loading={isLoading}
      />

      <SendVerification
        header="Check-in Confirmation"
        subHeader="Are you sure you want visitor to Check-in? "
        approval="Check-in"
        discard="Cancel"
        status={statusMessage}
        saveFunction={handleCheckIn}
        isVisible={isChkINPopupVisible}
        onHide={handleChkINClosePopup}
        loading={isLoading}
      />

      {/* <CheckoutPopup
        header="Checkout Confirmation"
        subHeader="Are you sure you want visitor to checkout? "
        approval="Check Out"
        discard="Cancel"
       /> */}

      <EditSavePopup
        header="Edit Confirmation"
        subHeader="Are you sure you want to send for approval? "
        approval="Save Edit"
        discard="Cancel"
        saveFunction={handleSaveVisitorEdit}
        isVisible={isEditPopupVisible}
        onHide={handleEditClosePopup}
        status={statusMessage}
        loading={isLoading}
      />
    </>
  );
};

export default VisitorDetail;
