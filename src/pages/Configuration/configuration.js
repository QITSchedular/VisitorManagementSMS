import React, { useEffect, useState } from "react";
import "./configuration.scss";
import HeaderTab from "../../components/HeaderTab/HeaderTab";
import { HeaderText } from "../../components/typographyText/TypograghyText";
import { Button, SelectBox, Switch } from "devextreme-react";
import { toastDisplayer } from "../../components/toastDisplayer/toastdisplayer";
import { useAuth } from "../../contexts/auth";
import CustomLoader from "../../components/customerloader/CustomLoader";
import { configAtom } from "../../contexts/atom";
import { useRecoilState } from "recoil";
import { SaveConfigData } from "../../api/auth";

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
  const handleInputChange = (fieldname, e) => {
    // if(fieldname){
    //     setTempStagedChanges((prevValues) => {
    //         const updatedValues = { ...prevValues, fieldname: e };
    //         return updatedValues;
    //       });
    //   }
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
              <HeaderText text="Configuration (Visitor Manual Entry)" />
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
          <div>
            <div className="SubHeaderTxt">Auto Approval</div>
            <div className="chkBoxGroup">
              <SelectBox
                labelMode="outside"
                width={150}
                onValueChanged={(e) =>
                  handleInputChange("ApprovalTime", e.value)
                }
                value={
                  // "ON"
                  tempStagedChanges ? tempStagedChanges["ApprovalTime"] : "OFF"
                }
                items={Source}
                valueExpr={"id"}
                displayExpr={"value"}
              ></SelectBox>
            </div>
          </div>
          <div style={{ paddingTop: "8px" }}>
            <div className="SubHeaderTxt">OTP Verification</div>
            <div className="chkBoxGroup">
              <SelectBox
                labelMode="outside"
                width={150}
                onValueChanged={(e) =>
                  handleInputChange("OtpVerification", e.value)
                }
                value={
                  tempStagedChanges ? tempStagedChanges["OtpVerification"] : "O"
                }
                items={VerificationOTP}
                valueExpr={"id"}
                displayExpr={"value"}
              ></SelectBox>
              {/* <Switch
              value={stagedChanges?.OtpVerification === true}
              onValueChanged={(e) => {
                toggleCheckbox("OtpVerification", e.value);
              }}
            /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Configuration;
