import React, { useEffect, useState } from "react";
import "./configuration.scss";
import HeaderTab from "../../components/HeaderTab/HeaderTab";
import { HeaderText } from "../../components/typographyText/TypograghyText";
import {
  Button,
  SelectBox,
  Switch,
  TextBox,
  Validator,
} from "devextreme-react";
import { toastDisplayer } from "../../components/toastDisplayer/toastdisplayer";
import { useAuth } from "../../contexts/auth";
import CustomLoader from "../../components/customerloader/CustomLoader";
import { configAtom } from "../../contexts/atom";
import { useRecoilState } from "recoil";
import { SaveConfigData } from "../../api/auth";
import {
  CustomRule,
  EmailRule,
  RequiredRule,
} from "devextreme-react/cjs/data-grid";

function Configuration() {
  const [activePage, setActivePage] = useState();
  const [loading, setLoading] = useState(false);

  const { authRuleContext, user } = useAuth();
  const [HeaderTabText, setHeaderTabtext] = useState([
    "Notification",
    "Profile",
  ]);

  const [autoApproval, setAutoApproval] = useState({
    off: true,
    oneDay: false,
    oneWeek: false,
  });

  useEffect(() => {
    if (authRuleContext) {
      const chkGeneralSetting = authRuleContext.filter(
        (item) => item.text == "General Settings"
      );
      if (chkGeneralSetting.length > 0) {
        setHeaderTabtext((prevData) => {
          const isDuplicate = prevData.some(
            (item) => item === "General Settings"
          );
          if (!isDuplicate) {
            return [...prevData, "General Settings"];
          }
          return prevData;
        });
      }
      const chkConfiguration = authRuleContext.filter(
        (item) => item.text == "Configuration"
      );
      if (chkConfiguration.length > 0) {
        setHeaderTabtext((prevData) => {
          const isDuplicate = prevData.some((item) => item === "Configuration");
          if (!isDuplicate) {
            return [...prevData, "Configuration"];
          }
          return prevData;
        });
      }
    }
  }, [authRuleContext]);

  const [stagedChanges, setStagedChanges] = useRecoilState(configAtom);
  const [tempStagedChanges, setTempStagedChanges] = useState(stagedChanges);

  useEffect(() => {
    setTempStagedChanges(stagedChanges);
  }, [stagedChanges]);

  const toggleCheckbox = (group, value) => {
    setTempStagedChanges((prevValues) => {
      const updatedValues = { ...prevValues, [group]: value };
      return updatedValues;
    });
  };

  const saveConfig = async () => {
    console.log("email  :", tempStagedChanges);
    if (tempStagedChanges.hostname && !tempStagedChanges.hostpasscode) {
      return toastDisplayer("error", "Host passcode is required..!!");
    }
    setLoading(true);
    var result = await SaveConfigData(tempStagedChanges);
    setLoading(false);
    if (result.hasError) {
      return toastDisplayer("error", result.errorMessage);
    } else {
      setStagedChanges(tempStagedChanges);
      return toastDisplayer("success", result.responseData?.StatusMsg);
    }
  };
  const Source = [
    { id: "OFF", value: "Off" },
    { id: "ON", value: "On" },
  ];
  const VerificationOTP = [
    { id: true, value: "Yes" },
    { id: false, value: "No" },
  ];
  const isidentity = [
    { id: "Y", value: "Yes" },
    { id: "N", value: "No" },
  ];
  const handleInputChange = (fieldname, e) => {
    if (fieldname == "ApprovalTime") {
      setTempStagedChanges((prevValues) => {
        const updatedValues = { ...prevValues, ApprovalTime: e };
        return updatedValues;
      });
    } else if (fieldname == "OtpVerification") {
      setTempStagedChanges((prevValues) => {
        const updatedValues = { ...prevValues, OtpVerification: e };
        return updatedValues;
      });
    }
    if (fieldname) {
      setTempStagedChanges((prevValues) => {
        const updatedValues = { ...prevValues, [fieldname]: e };
        return updatedValues;
      });
    }
  };

  const validatePasscode = (e) => {
    const passcodePattern = /^[A-Za-z0-9]{16}$/; // 16-character alphanumeric passcode
    return passcodePattern.test(e.value); // Returns true if the passcode is valid
  };

  return (
    <>
      {loading && (
        <div className="Myloader">
          <CustomLoader />
        </div>
      )}
      <div className="GeneralSetting">
        <HeaderTab
          HeaderTabText={HeaderTabText}
          HeaderText={activePage}
          setActivePage={setActivePage}
        />

        <div className="content-block dx-card">
          <div className="navigation-header-main">
            <div className="title-section">
              <HeaderText text="Configuration" />
            </div>
            <div className="title-section-btn">
              <Button
                text="Save Configuration"
                height={44}
                onClick={saveConfig}
                useSubmitBehavior={true}
                // stylingMode="text"
              />
            </div>
          </div>
          <div style={{ paddingTop: "16px" }}>
            <div className="title-section">
              <span className="title-header-text">Visitor Manual Entry</span>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <div>
                <div className="SubHeaderTxt">Auto Approval</div>
                <div className="chkBoxGroup">
                  <SelectBox
                    labelMode="outside"
                    width={300}
                    onValueChanged={(e) =>
                      handleInputChange("ApprovalTime", e.value)
                    }
                    value={
                      // "ON"
                      tempStagedChanges
                        ? tempStagedChanges["ApprovalTime"]
                        : "OFF"
                    }
                    items={Source}
                    valueExpr={"id"}
                    displayExpr={"value"}
                  ></SelectBox>
                </div>
              </div>
              <div>
                <div className="SubHeaderTxt">OTP Verification</div>
                <div className="chkBoxGroup">
                  <SelectBox
                    labelMode="outside"
                    width={300}
                    onValueChanged={(e) =>
                      handleInputChange("OtpVerification", e.value)
                    }
                    value={
                      tempStagedChanges
                        ? tempStagedChanges["OtpVerification"]
                        : "O"
                    }
                    items={VerificationOTP}
                    valueExpr={"id"}
                    displayExpr={"value"}
                  ></SelectBox>
                </div>
              </div>
              <div>
                <div className="SubHeaderTxt">PAN/Aadhar Required</div>
                <div className="chkBoxGroup">
                  <SelectBox
                    labelMode="outside"
                    width={300}
                    onValueChanged={(e) =>
                      handleInputChange("isidentity", e.value)
                    }
                    value={
                      tempStagedChanges ? tempStagedChanges["isidentity"] : "O"
                    }
                    items={isidentity}
                    valueExpr={"id"}
                    displayExpr={"value"}
                  ></SelectBox>
                </div>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: "16px", paddingBottom: "20px" }}>
            <div className="SubHeaderTxt">Email Configuration</div>
            <div className="" style={{ display: "flex", gap: "16px" }}>
              <TextBox
                label="Email Address"
                placeholder="Enter email address"
                labelMode="static"
                stylingMode="outlined"
                onValueChanged={(e) => handleInputChange("hostname", e.value)}
                // readOnly={isOTPVerified}
                // value={formData && formData?.e_mail}
                value={tempStagedChanges ? tempStagedChanges["hostname"] : ""}
                style={{ cursor: "pointer" }}
                valueChangeEvent="keyup"
                width={300}
              >
                <Validator>
                  <EmailRule message="Email is invalid" />
                </Validator>
              </TextBox>
              <TextBox
                label="Passcode"
                placeholder="Enter passcode"
                labelMode="static"
                stylingMode="outlined"
                onValueChanged={(e) =>
                  handleInputChange("hostpasscode", e.value)
                }
                style={{ cursor: "pointer" }}
                valueChangeEvent="keyup"
                width={300}
                value={
                  tempStagedChanges ? tempStagedChanges["hostpasscode"] : ""
                }
              >
                <Validator>
                  <CustomRule
                    validationCallback={validatePasscode}
                    message="Passcode must be a 16-character alphanumeric code."
                  />
                </Validator>
              </TextBox>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Configuration;
