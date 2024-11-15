import React, { useEffect, useState } from "react";
import "./step1.scss";
import { Button, Form, TextBox, Validator } from "devextreme-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRegisterVisitor } from "../../Atoms/customHook";
import { requestOtp } from "../../api/registorApi";
import { toastDisplayer } from "../../components/toastDisplayer/toastdisplayer";
import {
  EmailRule,
  PatternRule,
  RequiredRule,
} from "devextreme-react/validator";
import { getIfVisitorEixist } from "../../api/visitorApi";
import { checkCompanyByQr } from "../../api/common";
import { checkInVisitorApi } from "../../api/mobileVisitorApi";
import CustomLoader from "../../components/customerloader/CustomLoader";

export const Step1 = () => {
  const [registerVisitor, setRegisterVisitor] = useRegisterVisitor();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const queryParams = new URLSearchParams(location.search);
  // const cmpId = queryParams.get("cmpId");

  const [prevData, setPrevData] = useState([]);
  const [companyId, setCompanyId] = useState();
  const [isidentityVal, setIsIdentity] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    localStorage.setItem("previousPath", "/step1");
  }, []);

  // useEffect(() => {
  //   if (cmpId) {
  //     const getCmpData = async () => {
  //       const data = await checkCompanyByQr(cmpId);
  //       const response = data.responseData;

  //       setCompanyId(response.Data[0].transid);
  //     };
  //     getCmpData();
  //   }
  // }, [cmpId]);

  const [cmpId, setcmpId] = useState(
    localStorage.getItem("cmpId") || queryParams.get("cmpId")
  );

  useEffect(() => {
    if (cmpId && cmpId != "null") {
      localStorage.setItem("cmpId", cmpId);
      const getCmpData = async () => {
        const data = await checkCompanyByQr(cmpId);
        const response = data.responseData;
        if (!data.hasError) {
          setCompanyId(response.Data[0].transid);
          setIsIdentity(response.Data[0].isidentity);
        } else {
          setcmpId("null");
          return toastDisplayer("error", `Please scan QR again.`);
        }
      };
      getCmpData();
    } else {
      navigate("/welcomevisitor?cmpId=");
    }
  }, [cmpId]);

  useEffect(() => {
    if (companyId) {
      setRegisterVisitor((prev) => ({
        ...prev,
        ["company_id"]: companyId,
        ["isIdentityVal"]: isidentityVal,
      }));
    } else {
    }
  }, [companyId, isidentityVal]);

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterVisitor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Previous Button function
  const handlePreviousBtn = () => {
    navigate(`/welcomevisitor?cmpId=${cmpId}`);
  };

  // Handle Continue Button
  const hanldeOnContinue = async (e) => {
    // return navigate(`/checkinotp?cmpId=${cmpId}`);
    if (registerVisitor.vname === "") {
      return toastDisplayer("error", "Enter the name.");
    } else if (registerVisitor.e_mail === "") {
      return toastDisplayer("error", "Enter the email address.");
    } else if (registerVisitor.phone1 === "") {
      return toastDisplayer("error", "Enter the phone number.");
    } else if (registerVisitor.vcmpname === "") {
      return toastDisplayer("error", "Enter the company name.");
    } else if (registerVisitor.vlocation === "") {
      return toastDisplayer("error", "Enter the company location.");
    } else {
      if (
        prevData.status == "A" &&
        prevData.isToday == "Y" &&
        prevData.checkinstatus == "I"
      ) {
        navigate(`/welcomevisitor?cmpId=${cmpId}`);
        return toastDisplayer("error", "Visitor already Checked In");
      } else if (
        prevData.status == "P" &&
        prevData.checkinstatus == null &&
        prevData.isToday.toUpperCase() !== "N"
      ) {
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
          isIdentityVal: "N",
        });
        sessionStorage.removeItem("registerVisitor");

        toastDisplayer("error", `Your request is already pending.`);
        return handlePreviousBtn();
        // navigate(`/welcomevisitor?cmpId=${cmpId}`);
        // return toastDisplayer("success", "Checked In");
      } else if (
        prevData.status == "A" &&
        prevData.isToday == "Y" &&
        prevData.checkinstatus == null
      ) {
        const payload = {
          company_id: prevData.cmptransid,
          e_mail: registerVisitor.e_mail,
          sender_email: registerVisitor.e_mail,
          sender_role: "visitor",
        };
        const checkIn = await checkInVisitorApi(payload);
        if (checkIn.hasError === true) {
          return toastDisplayer("error", `${checkIn.error}`);
        }
        return navigate(`/Success?cmpId=${cmpId}`, {
          state: { Message: "Checked In Successfully" },
        });
        // navigate(`/welcomevisitor?cmpId=${cmpId}`);
        // return toastDisplayer("success", "Checked In");
      } else {
        hanldeGetOtp();
        return navigate(`/checkinotp?cmpId=${cmpId}`);
      }
    }
  };

  // Handle OTP
  const hanldeGetOtp = () => {
    const email = registerVisitor.e_mail;
    const mobile = registerVisitor.phone1;
    const role = "visitor";
    const handleOtp = requestOtp(email, role, mobile);

    if (handleOtp === true) {
    }
  };

  const hanldeNavigateCheckOut = () => {
    navigate(`/checkout?cmpId=${cmpId}`);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkPrevUser = async () => {
    const payload = {
      company_id: registerVisitor.company_id,
      e_mail: registerVisitor.e_mail,
    };
    setLoading(true);
    const userData = await getIfVisitorEixist(payload);

    if (userData.hasError === true) {
      return null;
    }
    setPrevData(userData.responseData);
    setRegisterVisitor((prev) => ({
      ...prev,
      phone1: userData.responseData.phone1,
      vlocation: userData.responseData.vlocation,
      vcmpname: userData.responseData.vcmpname,
    }));
    setLoading(false);
  };

  useEffect(() => {
    if (isValidEmail(registerVisitor.e_mail)) {
      checkPrevUser();
    }
  }, [registerVisitor.e_mail]);

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
              <span>Step 1/4</span>
            </div>
            <div className="welcome-text">
              <span>Welcome!</span> <span>Fill in the details</span>
            </div>
          </div>

          <div className="input-text">
            <TextBox
              label="Name"
              value={registerVisitor.vname}
              placeholder="What's your name "
              labelMode="static"
              stylingMode="outlined"
              height={"56px"}
              className="step-textbox required"
              onValueChanged={(e) =>
                handleInputChange({ target: { name: "vname", value: e.value } })
              }
            >
              <Validator>
                <RequiredRule message="Name is required" />
              </Validator>
            </TextBox>
            <TextBox
              label="Email Address"
              value={registerVisitor.e_mail}
              labelMode="static"
              stylingMode="outlined"
              height={"56px"}
              className="step-textbox required"
              placeholder="Enter your email address"
              Validator={true}
              onValueChanged={(e) =>
                handleInputChange({
                  target: { name: "e_mail", value: e.value },
                })
              }
            >
              <Validator className="custom-validator">
                <EmailRule message="Email is invalid" />
                <RequiredRule message="Email address is required." />
              </Validator>
            </TextBox>
            <TextBox
              label="Mobile Number"
              placeholder="Enter your mobile number"
              value={registerVisitor.phone1}
              labelMode="static"
              stylingMode="outlined"
              height={"56px"}
              className="step-textbox required"
              onValueChanged={(e) =>
                handleInputChange({
                  target: { name: "phone1", value: e.value },
                })
              }
            >
              <Validator className="custom-validator">
                <RequiredRule message="mobile Number is required" />
                <PatternRule
                  message="Invalid mobile number"
                  pattern="^\d{10}$"
                />
              </Validator>
            </TextBox>
            <TextBox
              label="Name of the company"
              value={registerVisitor.vcmpname}
              placeholder="In which company you work in"
              labelMode="static"
              stylingMode="outlined"
              height={"56px"}
              className="step-textbox required"
              onValueChanged={(e) =>
                handleInputChange({
                  target: { name: "vcmpname", value: e.value },
                })
              }
            >
              <Validator className="custom-validator">
                <RequiredRule message="Company is required" />
              </Validator>
            </TextBox>
            <TextBox
              label="Company's Addess"
              placeholder="Enter company address"
              value={registerVisitor.vlocation}
              labelMode="static"
              stylingMode="outlined"
              height={"56px"}
              className="last-textbox required"
              onValueChanged={(e) =>
                handleInputChange({
                  target: { name: "vlocation", value: e.value },
                })
              }
            >
              <Validator className="custom-validator">
                <RequiredRule message="Location is required" />
              </Validator>
            </TextBox>
          </div>
          <div className="btn-section">
            <Button
              text="Continue"
              width={"100%"}
              height={"44px"}
              onClick={hanldeOnContinue}
            />
          </div>

          <div className="already-text">
            <span> Already a visitor?</span>
            <span onClick={hanldeNavigateCheckOut}> Check Out</span>
          </div>
        </form>
      </div>
    </>
  );
};
