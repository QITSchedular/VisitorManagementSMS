import React, { useEffect, useRef, useState } from "react";
import {
  HeaderText,
  SubText,
} from "../../components/typographyText/TypograghyText";
import { Button, DateBox, Popup, SelectBox, TextBox } from "devextreme-react";
import { Button as TextBoxButton } from "devextreme-react/text-box";
import { CalendarIcon, DownloadIcon, helpIcon } from "../../assets";
import "./log-report.scss";
import Breadcrumbs from "../../components/breadcrumbs/BreadCrumbs";
import DataGrid, {
  Column,
  Paging,
  Toolbar,
  Item,
  Pager,
  SearchPanel,
} from "devextreme-react/data-grid";
import { logAPI } from "../../api/logger";
import HelperPopupPage from "../../components/Helper-popup/helper_popup";
import { getErrorInfo, getUserData } from "../../api/common";
import { useAuth } from "../../contexts/auth";
import { toastDisplayer } from "../../components/toastDisplayer/toastdisplayer";
import CustomLoader from "../../components/customerloader/CustomLoader";
import { saveAs } from "file-saver";
import { Workbook } from "exceljs";
import { exportDataGrid } from "devextreme/excel_exporter";
import ErrorPopup from "../../components/Helper-popup/error_popup";
import "./log-report.scss";

const LogReportMain = () => {
  const [loading, setLoading] = useState(false);
  const dataGrid = useRef(null);
  const [userPopup, setUserPopUp] = useState(false);
  const [errorPopup, setErrorPopUp] = useState(false);
  const [logs, Setlogs] = useState([]);
  const [fromdate, Setfromdate] = useState(null);
  const [todate, Settodate] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedloglevel, setSelectedloglevel] = useState(null);
  const { user } = useAuth();
  const [UserData, setUserData] = useState([]);
  const [ErrorData, setErrorData] = useState([]);
  const [selectedRowKeysOnChangeAuth, setSelectedRowKeysOnChangeAuth] =
    useState([]);
  const dataGridRefAuthRule = useRef();
  const dataGridErrorRef = useRef();
  // const LogData = async () => {
  //   const list = await logAPI();
  //   Setlogs(list);
  // };

  const handleFromDateChange = (value) => {
    let date = new Date(value);
    Setfromdate(
      `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    );
  };

  const handleToDateChange = (value) => {
    let date = new Date(value);
    Settodate(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
  };

  const handleGetLogData = async () => {
    try {
      setLoading(true);
      if (fromdate == null || fromdate == "") {
        setLoading(false);
        return toastDisplayer("error", "From Date is required.");
      }
      if (todate == null || todate == "") {
        setLoading(false);
        return toastDisplayer("error", "To Date is required.");
      }
      const loginUser =
        user.userrole != "USER" ? "Admin" : user ? user.e_mail : "";
      const result = await logAPI(
        user ? user.cmpid : 0,
        selectedModule,
        selectedloglevel,
        selectedRowKeysOnChangeAuth.length > 0
          ? selectedRowKeysOnChangeAuth[0].e_mail
          : "",
        loginUser,
        fromdate,
        todate
      );
      if (result.hasError) {
        Setlogs([]);
        setLoading(false);
        return toastDisplayer("error", result.errorMessage);
      }
      Setlogs(result.responseData);
      setLoading(false);
    } catch {}
  };

  const handleUser = () => {
    setUserPopUp(true);
  };

  const userOptions = {
    icon: helpIcon,
    onClick: () => {
      handleUser();
    },
  };
  const logLevel = [
    { value: "I", text: "Information" },
    { value: "S", text: "Succcess" },
    { value: "E", text: "Error" },
  ];
  const modules = [
    "Visitors",
    "Verify Visitors",
    "User Settings",
    "Notification",
    "Profile",
    "General Settings",
  ];
  const handleCancel = () => {
    setUserPopUp(false);
  };

  const handleCancelErrorPopup = () => {
    setErrorPopUp(false);
  };

  const getData = async () => {
    setLoading(true);
    let result = await getUserData("All", user.cmpid);

    if (result.hasError) {
      setLoading(false);
      return toastDisplayer("error", result.errorMessage);
    }
    setLoading(false);
    var Data = result.responseData?.Data;
    if (user.userrole == "COMPANY") {
      var new_data = {
        transid: "c1",
        username: user.e_mail,
        e_mail: user.e_mail,
        phone: "",
        usertype: "COMPANY",
      };
      Data.push(new_data);
      console.log(Data);
      setUserData(Data);
    } else {
      const new_data = Data.filter((user) => user.usertype !== "Admin");
      setUserData(new_data);
    }
  };
  const ErrorInfo = async () => {
    setLoading(true);
    let result = await getErrorInfo();
    if (result.hasError) {
      setLoading(false);
      return toastDisplayer("error", result.errorMessage);
    }
    setLoading(false);
    const Data = result.responseData;
    setErrorData(Data);
  };
  useEffect(() => {
    getData();
    ErrorInfo();
  }, []);
  const [loginUser, setLogedInUser] = useState([]);
  useEffect(() => {
    console.log(UserData);
    if (user && user.userrole == "USER") {
      const new_data = UserData.filter((user1) => user1.e_mail == user.e_mail);
      setLogedInUser(new_data);
    }
  }, [UserData]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleSave = async () => {
    setSelectedRowKeys(selectedRowKeysOnChangeAuth);
    if (selectedRowKeysOnChangeAuth.length > 0) {
      setLoading(true);
      setUserPopUp(false);
      setLoading(false);
    } else {
      setLoading(false);
      // return toastDisplayer("error", "Please select a user");
    }
  };
  const handleDataGridRowSelectionAuthRuleUser = async ({
    selectedRowKeys,
  }) => {
    setSelectedRowKeysOnChangeAuth(selectedRowKeys);
    const length = await selectedRowKeys.length;
    if (selectedRowKeys.length > 1) {
      const value = await dataGridRefAuthRule.current.instance.selectRows(
        selectedRowKeys[length - 1]
      );
      return selectedRowSetterApprove(value);
    } else {
      const value = await dataGridRefAuthRule.current.instance.selectRows(
        selectedRowKeys[0]
      );
      return selectedRowSetterApprove(value);
    }
  };

  const selectedRowSetterApprove = async (params) => {
    setSelectedRowKeysOnChangeAuth(params);
  };
  // export to excel
  const handleDownload = () => {
    setLoading(true);
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Main sheet");

    exportDataGrid({
      component: dataGrid.current.instance,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          "LogReportData.xlsx"
        );
      });
    });
    setLoading(false);
  };

  // Show error info
  const handleErrorInfo = () => {
    setErrorPopUp(true);
  };

  function formatDate(dateString) {
    // Parse the input date string as a UTC date
    const date = new Date(dateString);

    // Extract date components
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getUTCFullYear();

    // Extract time components and convert to 12-hour format
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    // Determine AM/PM
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert from 24-hour to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    // Pad hours
    const formattedHours = String(hours).padStart(2, "0");

    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
  }
  return (
    <>
      {loading && (
        <div className="Myloader">
          <CustomLoader />
        </div>
      )}
      {errorPopup && (
        <Popup
          visible={true}
          height={window.innerHeight - 200}
          showCloseButton={false}
          className="initate-popup-css"
          showTitle={false}
          contentRender={() => (
            <ErrorPopup
              title={"Error Details"}
              caption={"Error Information"}
              handleCancel={handleCancelErrorPopup}
              datagridData={ErrorData}
              keyExpr={"Code"}
              dataGridRef={dataGridErrorRef}
            />
          )}
        ></Popup>
      )}
      {userPopup && (
        <Popup
          visible={true}
          height={window.innerHeight - 100}
          showCloseButton={false}
          className="initate-popup-css"
          showTitle={false}
          contentRender={() => (
            <HelperPopupPage
              title={"User Details"}
              caption={"Select the user"}
              handleCancel={handleCancel}
              handleSave={handleSave}
              datagridData={UserData}
              keyExpr={"e_mail"}
              handleDataGridRowSelection={
                handleDataGridRowSelectionAuthRuleUser
              }
              dataGridRef={dataGridRefAuthRule}
              selectedRowKeys={selectedRowKeys}
            />
          )}
        ></Popup>
      )}
      <div className="content-block">
        <div className="navigation-header-main">
          <div className="title-section">
            <HeaderText text="All the Log Reports" />
          </div>
        </div>
      </div>
      <Breadcrumbs />
      <div className="content-block dx-card">
        <div className="log-report-input">
          <div className="form-input">
            <DateBox
              label="From Date"
              height={56}
              displayFormat="dd-MM-yyyy"
              placeholder="Input"
              labelMode="static"
              stylingMode="outlined"
              showClearButton={true}
              className="required"
              onValueChange={(value) => handleFromDateChange(new Date(value))}
              icon={CalendarIcon}
            />
          </div>
          <div className="form-input">
            <DateBox
              label="To Date"
              height={56}
              displayFormat="dd-MM-yyyy"
              placeholder="Input"
              labelMode="static"
              stylingMode="outlined"
              showClearButton={true}
              className="required"
              onValueChange={(value) => handleToDateChange(new Date(value))}
              icon={CalendarIcon}
            />
          </div>
          <div className="form-input">
            <SelectBox
              label="Module"
              height={56}
              showClearButton={true}
              items={modules}
              // displayExpr="module"
              // valueExpr="module"
              labelMode="static"
              stylingMode="outlined"
              // value={selectedModule}
              onValueChanged={(e) => setSelectedModule(e.value)}
            />
          </div>
          <div className="form-input">
            <SelectBox
              label="Log Level"
              height={56}
              showClearButton={true}
              items={logLevel}
              displayExpr="text"
              valueExpr="value"
              labelMode="static"
              stylingMode="outlined"
              // value={selectedLogLevel}
              onValueChanged={(e) => setSelectedloglevel(e.value)}
            />
          </div>
          <div className="form-input">
            <TextBox
              label="User"
              placeholder="Input"
              height={56}
              labelMode="static"
              stylingMode="outlined"
              disabled={user ? (user.userrole == "USER" ? true : false) : false}
              value={
                user
                  ? user.userrole == "USER"
                    ? loginUser[0]
                      ? loginUser[0].username
                      : user.e_mail
                    : selectedRowKeysOnChangeAuth.length > 0
                    ? selectedRowKeysOnChangeAuth[0].username
                    : ""
                  : ""
              }
            >
              <TextBoxButton
                name="popupSearch"
                location="after"
                options={userOptions}
              />
            </TextBox>
          </div>
          <Button
            style={{ marginTop: "6.5px" }}
            height={56}
            width={56}
            stylingMode="outlined"
            onClick={handleGetLogData}
            icon="search"
          />
        </div>
      </div>
      <div className="content-block dx-card">
        <DataGrid
          dataSource={logs}
          showBorders={false}
          selection={{
            mode: "multiple",
          }}
          className="data-grid log-report"
          hoverStateEnabled={true}
          columnAutoWidth={true}
          ref={dataGrid}
        >
          <SearchPanel
            visible={true}
            width={300}
            height={44}
            placeholder="Search visitors"
          />
          <Paging defaultPageSize={10} />
          <Pager
            visible={true}
            displayMode="compact"
            showNavigationButtons={true}
          />
          <Column dataField="transid" visible={false} />
          <Column dataField="module" caption="Module" />
          <Column dataField="viewname" caption="Visitor Name" />
          <Column
            dataField="loglevel"
            caption="Log Level"
            // cellRender={(e)=>{
            //   if(e.value == "I")
            //     return "Information"
            //   else if(e.value == "S")
            //     return "Success"
            //   else if(e.value == "E")
            //     return "Error"
            // }}
          />
          <Column dataField="logmessage" caption="Log Message" />
          <Column dataField="loginuser" caption="Login User" />
          <Column
            dataField="entrydate"
            caption="Entry Date"
            cellRender={(data) => formatDate(data.value)}
          />
          <Column dataField="error_id" />
          <Toolbar className="toolbar-item">
            <Item location="before">
              <div className="informer">
                <SubText text={`In total, you have ${logs.length} reports`} />
              </div>
            </Item>

            <Item location="after">
              <Button
                disabled={!logs.length}
                stylingMode="outlined"
                height={45}
                width={45}
                onClick={handleDownload}
                icon={DownloadIcon}
              />
            </Item>
            <Item location="after">
              <Button
                stylingMode="outlined"
                height={45}
                onClick={handleErrorInfo}
                text="Error Info"
                // style={{ "margin-right": "5px" }}
              />
            </Item>
            <Item name="searchPanel" />
          </Toolbar>
        </DataGrid>
      </div>
    </>
  );
};

export default LogReportMain;
