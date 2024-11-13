import React, { useEffect, useRef, useState } from "react";
import "./generalsetting.scss";
import HeaderTab from "../../components/HeaderTab/HeaderTab";
import { HeaderText } from "../../components/typographyText/TypograghyText";
import { Button, CheckBox, Switch } from "devextreme-react";
import DataGrid, {
  Column,
  Paging,
  Toolbar,
  Item,
  Pager,
  SearchPanel,
  RequiredRule,
  Editing,
  LoadPanel,
} from "devextreme-react/data-grid";
import { toastDisplayer } from "../../components/toastDisplayer/toastdisplayer";
import { GetCmpDept } from "../../api/userAPI";
import { useAuth } from "../../contexts/auth";
import {
  deleteDepartment,
  saveDepartment,
  updateDepartment,
} from "../../api/departmentAPi";
import CustomLoader from "../../components/customerloader/CustomLoader";
import CustomCheckBox from "../../components/CustomCheckBox/CustomCheckBox";
import { configAtom } from "../../contexts/atom";
import { useRecoilState } from "recoil";
import { SaveConfigData } from "../../api/auth";
import { useLocation, useNavigate } from "react-router-dom";
import LocationGrid from "../../components/locationGrid/LocationGrid";

const GeneralSetting = () => {
  const [activePage, setActivePage] = useState();

  const gridRef = useRef(null);
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromURL, setFromURL] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (state) {
      const comeFrom = state.from;
      setFromURL(comeFrom);
    }
  }, []);

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

  const getDeptData = async () => {
    setLoading(true);
    var apiRes = await GetCmpDept(user.cmpid);
    setLoading(false);
    if (!apiRes.hasError) {
      setDepartmentData(apiRes.responseData?.Data);
    } else {
      return toastDisplayer("error", apiRes.errorMessage);
    }
  };

  useEffect(() => {
    getDeptData();
  }, []);

  const handleAddPopup = async () => {
    if (gridRef.current && gridRef.current.instance) {
      const gridInstance = gridRef.current.instance;
      try {
        gridInstance.addRow();
      } catch (error) {
        // console.error("Error adding row:", error);
      }
    } else {
      // console.error("Grid instance not available.");
    }
  };


  const handleAddDepartment = async (e) => {
    var newName = e.data.deptname;
    if (newName) {
      if (!newName.trim()) {
        e.cancel = true;
        return toastDisplayer("error", "Department name is required.");
      } else {
        const reqBody = {
          dept_name: newName,
          company_id: user.cmpid,
          sender_email: user.e_mail,
          sender_role: user.userrole,
        };
        var apiRes = await saveDepartment(reqBody);
        if (apiRes.hasError) {
          toastDisplayer("error", apiRes.errorMessage);
          await getDeptData();
        } else {
          toastDisplayer("success", "A new department has been added.");
          if (fromURL) {
            state.data.cmpdeptid = apiRes.responsedata.deptId;
            navigate(fromURL, {
              state: {
                deptId: apiRes.responsedata.deptId,
                fromURL: "generalSetting",
                data: state.data,
              },
            });
          }
          await getDeptData();
        }
      }
    } else {
      e.cancel = true;
      return toastDisplayer("error", "Department name is required.");
    }
  };

  const handleUpdateDepartment = async (e) => {
    const updatedName = e.data.deptname;

    if (updatedName) {
      if (!updatedName.trim()) {
        e.cancel = true;
        return toastDisplayer("error", "Department name is required.");
      } else {
        const reqBody = {
          transid: e.data.transid,
          deptname: updatedName,
          cmptransid: user.cmpid,
          sender_email: user.e_mail,
          sender_role: user.userrole,
          company_id: user.cmpid,
        };
        const apiRes = await updateDepartment(reqBody);
        if (apiRes.hasError) {
          toastDisplayer("error", apiRes.errorMessage);
          await getDeptData();
        } else {
          toastDisplayer("success", "Department details have been updated.");
          await getDeptData();
        }
      }
    } else {
      e.cancel = true;
      return toastDisplayer("error", "Department name is required.");
    }
  };

  const handleRemoveDepartment = async (e) => {
    var deptID = e.data.transid;
    var deptName = e.data.deptname;
    var compID = user.cmpid;
    var sender_email = user.e_mail;
    var sender_role = user.userrole;
    if (deptID) {
      var apiRes = await deleteDepartment(
        deptID,
        compID,
        sender_email,
        sender_role,
        deptName
      );
      if (apiRes.hasError) {
        return toastDisplayer("error", apiRes.errorMessage);
      } else {
        return toastDisplayer("success", "Department deleted successfully");
      }
    } else {
      e.cancel = true;
      return toastDisplayer("error", "Department name is required.");
    }
  };

  // const [stagedChanges, setStagedChanges] = useRecoilState(configAtom);
  // const [tempStagedChanges, setTempStagedChanges] = useState(stagedChanges);

  // useEffect(() => {
  //   setTempStagedChanges(stagedChanges);
  // }, [stagedChanges]);

  // useEffect(() => {
  // }, [stagedChanges]);

  // const toggleCheckbox = (group, value) => {
  //   setTempStagedChanges((prevValues) => {
  //     const updatedValues = { ...prevValues, [group]: value };
  //     return updatedValues;
  //   });
  // };

  // const saveConfig = async () => {
  //   setLoading(true);
  //   var result = await SaveConfigData(tempStagedChanges);
  //   setLoading(false);
  //   if (result.hasError) {
  //     return toastDisplayer("error", result.errorMessage);
  //   } else {
  //     setStagedChanges(tempStagedChanges);
  //     return toastDisplayer("success", result.responseData?.StatusMsg);
  //   }
  // };

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
              <HeaderText text="Add Department" />
            </div>
            <div className="title-section-btn">
              <Button
                style={{ color: "#6941c6" }}
                text="Add Department"
                height={44}
                onClick={handleAddPopup}
                useSubmitBehavior={true}
                stylingMode="text"
              />
            </div>
          </div>
          <div style={{ marginTop: "24px" }}>
            <DataGrid
              id="gridContainer"
              dataSource={departmentData}
              keyExpr="transid"
              allowColumnReordering={true}
              showBorders={true}
              ref={gridRef}
              onRowUpdated={handleUpdateDepartment}
              onRowRemoved={handleRemoveDepartment}
              onRowInserted={handleAddDepartment}
            >
              <LoadPanel visible={false} />
              <Paging defaultPageSize={5} />
              <Pager
                visible={true}
                displayMode="compact"
                showNavigationButtons={true}
              />
              <Editing mode="row" allowUpdating={true} allowDeleting={true} />
              <Column caption="Department Name" dataField="deptname">
                {/* <ValidationRule
                  type="required"
                  message="Category name is required"
                /> */}
                <RequiredRule message="Required" />
              </Column>
            </DataGrid>
          </div>
        </div>
        <LocationGrid user={user}/>
      </div>
    </>
  );
};

export default GeneralSetting;
