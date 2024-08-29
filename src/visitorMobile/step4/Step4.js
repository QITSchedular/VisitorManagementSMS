import React, { useEffect, useMemo, useState } from "react";
import "./step4.scss";
import {
  Autocomplete,
  Button,
  SelectBox,
  TextBox,
  Validator,
} from "devextreme-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRegisterVisitor } from "../../Atoms/customHook";
import { GettingDepratmentdata } from "../../api/departmentAPi";
import { registerVisitorApi } from "../../api/mobileVisitorApi";
import { RequiredRule } from "devextreme-react/cjs/data-grid";
import { toastDisplayer } from "../../components/toastDisplayer/toastdisplayer";
import { useResetRecoilState } from "recoil";
import { saveNotification } from "../../api/notification";
import { getAllUserData, getUserData } from "../../api/common";
import CustomLoader from "../../components/customerloader/CustomLoader";

export const Step4 = () => {
  const navigate = useNavigate();
  const [registerVisitor, setRegisterVisitor] = useRegisterVisitor();
  const [departmentdataState, setDepartmentdataState] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [contactList, setContactList] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const cmpId = queryParams.get("cmpId");
  const [loading, setLoading] = useState(false);

  const handlePreviousBtn = () => {
    navigate(`/welcomestep3?cmpId=${cmpId}`);
  };
  const handleAproval = async () => {
    if (
      !registerVisitor.cnctperson ||
      !registerVisitor.department_id ||
      !registerVisitor.timeslot ||
      !registerVisitor.purposeofvisit
    ) {
      return;
    }

    setLoading(true);

    try {
      const registor = await registerVisitorApi(registerVisitor);
      saveNotification(
        "Visitors",
        0,
        "Visitor",
        `${registerVisitor.vname} will be arriving for a ${registerVisitor.purposeofvisit} at ${registerVisitor.timeslot}`,
        registerVisitor.company_id
      );

      if (registor.hasError) {
        toastDisplayer("error", `${registor.error}`);
        return;
      }

      setRegisterVisitor({
        vavatar: "",
        cnctperson: "",
        department_id: "",
        timeslot: "",
        anyhardware: "",
        purposeofvisit: "",
        company_id: "",
        reason: "",
        status: "",
        createdby: null,
        vname: "",
        phone1: "",
        vcmpname: "",
        vlocation: "",
        e_mail: "",
      });

      sessionStorage.removeItem("registerVisitor");
      navigate(`/Success?cmpId=${cmpId}`);
    } catch (error) {
      console.error("Error during approval process:", error);
      toastDisplayer("error", "Failed to complete the approval process.");
    } finally {
      setLoading(false);
    }
  };

  const company_id = registerVisitor.company_id;
  const getDepartmentdata = async () => {
    const departmentData = await GettingDepratmentdata(company_id);
    if (departmentData.hasError === true) {
    }
    const specialActionItem = {
      transid: 0,
      deptname: "Other",
      transid: "specialAction",
    };
    return setDepartmentdataState([
      ...departmentData.repsonseData.Data,
      specialActionItem,
    ]);
  };

  const hanldeInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterVisitor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputTime = (e) => {
    if (e?.value) {
      setRegisterVisitor((prev) => ({
        ...prev,
        timeslot: e.value,
      }));
    } else {
      console.error("Invalid value provided for timeslot");
    }
  };

  const handleInputChange = (field, e) => {
    if (field === "cnctperson" && e?.value) {
      // Check if value is defined
      const selectedUser = contactList.find(
        (user) => user.username === e.value
      );
      if (selectedUser) {
        setRegisterVisitor((prevFormData) => ({
          ...prevFormData,
          cnctperson: e.value,
          department_id: selectedUser.cmpdeptid,
        }));
      }
    } else if (field === "cmpdeptid" && e?.value) {
      setRegisterVisitor((prevFormData) => ({
        ...prevFormData,
        department_id: e.value,
      }));
    }
  };

  const formatDateTime = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const generateTimeSlots = (date) => {
    let slots = [];
    const now = new Date();
    const currentHour = now.getHours();

    for (let i = currentHour + 1; i < 24; i++) {
      const slotDate = new Date(date);
      slotDate.setHours(i, 0, 0, 0);
      const displayText = `${slotDate.getDate()} - ${
        slotDate.getMonth() + 1
      } - ${slotDate.getFullYear()}, ${slotDate.getHours() % 12 || 12} : 00 ${
        slotDate.getHours() >= 12 ? "pm" : "am"
      }`;
      slots.push({
        text: displayText,
        value: formatDateTime(slotDate),
      });
    }
    return slots;
  };

  const getAllUser = async () => {
    const userData = await getAllUserData(company_id);
    if (userData.hasError === true) {
    }

    setContactList(userData.responseData);
  };
  useEffect(() => {
    getAllUser();
  }, []);

  const memoizedTimeSlots = useMemo(() => {
    const today = new Date();
    return generateTimeSlots(today);
  }, []);

  useEffect(() => {
    setRegisterVisitor((prev) => ({
      ...prev,
      company_id: registerVisitor.company_id,
    }));
    getDepartmentdata();
  }, []);

  useEffect(() => {
    setTimeSlots(memoizedTimeSlots);
  }, [memoizedTimeSlots]);

  return (
    <>
      {loading && (
        <div className="Myloader">
          <CustomLoader />
        </div>
      )}
      <div className="Step1">
        <form>
          <div className="backbtn">
            <i
              className="ri-arrow-left-line"
              style={{ fontSize: "20px" }}
              onClick={handlePreviousBtn}
            ></i>
          </div>
          <div className="header-step">
            <div className="step-number">
              <span>Step 4/4</span>
            </div>
            <div className="welcome-text">
              <span>Other Details!</span>
            </div>
          </div>
          <div className="input-text">
            {/* <SelectBox
            label="Contact Person"
            items={contactList}
            displayExpr={"username"}
            valueExpr={"username"}
            placeholder="Whom do you want to me ?"
            labelMode="static"
            stylingMode="outlined"
            height={"56px"}
            className="step-textbox"
            searchEnabled={true}
            onValueChanged={(e) => handleInputChange("meetPerson", e)}
          >
            <Validator>
              <RequiredRule message="Mention the person to meet" />
            </Validator>
          </SelectBox> */}
            <SelectBox
              label="Contact Person"
              placeholder="Whom do they want to meet?"
              labelMode="static"
              stylingMode="outlined"
              onValueChanged={(e) => handleInputChange("cnctperson", e)}
              value={registerVisitor?.cnctperson}
              items={contactList}
              displayExpr={"username"}
              valueExpr={"username"}
              className="step-textbox required"
              height={"56px"}
              searchEnabled={true}
            ></SelectBox>
            <SelectBox
              label="Select Department"
              dataSource={departmentdataState}
              displayExpr="deptname"
              valueExpr="transid"
              placeholder="Select Department"
              labelMode="static"
              stylingMode="outlined"
              value={registerVisitor?.department_id}
              className="step-textbox required"
              height={"56px"}
              searchEnabled={true}
              onValueChanged={(e) => handleInputChange("department_id", e)}
            >
              <Validator>
                <RequiredRule message="Select the department" />
              </Validator>
            </SelectBox>
            <SelectBox
              label="Time Slot"
              dataSource={timeSlots}
              displayExpr="text"
              valueExpr="value"
              labelMode="static"
              placeholder="Select Timeslot"
              stylingMode="outlined"
              height={"56px"}
              className="step-textbox required"
              value={registerVisitor?.timeslot}
              onValueChanged={(e) => handleInputTime(e)}
            >
              <Validator>
                <RequiredRule message="Time Slot is required" />
              </Validator>
            </SelectBox>

            <TextBox
              label="Any Hardware"
              labelMode="static"
              stylingMode="outlined"
              height={"56px"}
              className="last-textbox"
              placeholder="Eg. Phone ,Laptop ,etc. "
              onValueChanged={(e) =>
                hanldeInputChange({
                  target: { name: "anyhardware", value: e.value },
                })
              }
            ></TextBox>
            <TextBox
              label="Purpose of visit"
              placeholder="Why do you want to Meet ?"
              labelMode="static"
              stylingMode="outlined"
              height={"56px"}
              className="last-textbox required"
              onValueChanged={(e) =>
                hanldeInputChange({
                  target: { name: "purposeofvisit", value: e.value },
                })
              }
            >
              <Validator>
                <RequiredRule message="Mention the Purpose of visit" />
              </Validator>
            </TextBox>
          </div>
          <div className="btn-section">
            <Button
              text="Send For Approval"
              width={"100%"}
              height={"44px"}
              onClick={handleAproval}
            />
          </div>
        </form>
      </div>
    </>
  );
};
