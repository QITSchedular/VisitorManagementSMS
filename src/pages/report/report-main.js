import React, { useRef, useState } from "react";
import {
  HeaderText,
  SubText,
} from "../../components/typographyText/TypograghyText";
import Breadcrumbs from "../../components/breadcrumbs/BreadCrumbs";
import DataGrid, {
  Column,
  Paging,
  Toolbar,
  Item,
  Pager,
  SearchPanel,
} from "devextreme-react/data-grid";
import { Button, DateBox, SelectBox, TextBox } from "devextreme-react";
import "./report.scss";
import { getReportData } from "../../api/main-reportApi";
import { toastDisplayer } from "../../components/toastDisplayer/toastdisplayer";
import { useAuth } from "../../contexts/auth";
import CustomLoader from "../../components/customerloader/CustomLoader";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { exportDataGrid } from "devextreme/excel_exporter";
import { DownloadIcon } from "../../assets";

const ReportMain = () => {
  const dataGrid = useRef(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterState, setFilterState] = useState("All");

  const allVisitorsState = [
    { value: "All", text: "All Visitors" },
    { value: "Pending", text: "Pending " },
    { value: "Approved", text: "Approved " },
    { value: "Rejected", text: "Rejected " },
  ];

  const handleFilterChange = (newStatus) => {
    setFilterStatus(newStatus);
    const filterValue = newStatus === "All" ? undefined : newStatus;
    if (dataGrid.current && dataGrid.current.instance) {
      dataGrid.current.instance.columnOption(
        "state",
        "filterValue",
        filterValue
      );
      dataGrid.current.instance.refresh();
    }
  };

  const allCheckinVisitor = [
    { value: "All", text: "All Status" },
    { value: "Check in", text: "Check in" },
    { value: "Check Out", text: "Check Out" },
  ];

  const handleFilterState = (newStatus) => {
    setFilterState(newStatus);
    const filterValue = newStatus === "All" ? undefined : newStatus;

    if (dataGrid.current && dataGrid.current.instance) {
      dataGrid.current.instance.columnOption(
        "status",
        "filterValue",
        filterValue
      );
      dataGrid.current.instance.refresh();
    }
  };
  const handleFromDateChange = (value) => {
    const formattedFromDate = value instanceof Date ? formatDate(value) : null;
    setFromDate(formattedFromDate);
  };

  const handleToDateChange = (value) => {
    const formattedToDate = value instanceof Date ? formatDate(value) : null;
    setToDate(formattedToDate);
  };
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const fetchReportData = async () => {
    setLoading(true);
    const cmpid = user.cmpid;

    try {
      const response = await getReportData(cmpid, fromDate, toDate);

      if (response.hasError) {
        toastDisplayer("error", "No Data Found");
        setReportData([]);
      } else {
        if (response.repsonseData.Status === 400) {
          toastDisplayer("error", response.repsonseData.StatusMsg);
          setReportData([]);
        } else {
          setReportData(response.repsonseData);
        }
      }
    } catch (error) {
      toastDisplayer("error", "There was an error retrieving the data.");
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveData = () => {
    if (fromDate == "") {
      return toastDisplayer("error", "From Date is required.");
    }
    if (toDate == "") {
      return toastDisplayer("error", "To Date is required.");
    }
    fetchReportData();
  };
  const colors = ["#007bff", "#28a745", "#dc3545", "#ffc107", "#17a2b8"];

  const getInitials = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };

  const renderGridCell = (cellData) => {
    const { value, data } = cellData;
    const visitorName = data.vName;

    if (value && value !== "null") {
      return (
        <div className="image">
          <img src={value} alt="Profile" />
        </div>
      );
    }

    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return (
      <div
        className="initials"
        title={visitorName}
        style={{ backgroundColor: randomColor }}
      >
        {getInitials(visitorName)}
      </div>
    );
  };
  // export to excel
  const handleDownload = async () => {
    setLoading(true);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Main sheet");

    exportDataGrid({
      component: dataGrid.current.instance,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      worksheet.spliceColumns(1, 1);

      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          "VisitorsData.xlsx"
        );
      });
    });

    setLoading(false);
  };

  function formatDate1(dateString) {
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
      <div className="content-block">
        <div className="navigation-header-main">
          <div className="title-section">
            <HeaderText text="All Reports" />
          </div>
        </div>
      </div>
      <Breadcrumbs />
      <div className="content-block dx-card">
        <div className="main-report-form">
          <div className="form-input">
            <DateBox
              label="From Date"
              height={56}
              displayFormat="dd-MM-yyyy"
              placeholder="Input"
              labelMode="static"
              stylingMode="outlined"
              showClearButton={true}
              onValueChange={(value) => handleFromDateChange(new Date(value))}
              ref={dataGrid}
              className="required"
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
            />
          </div>
          <Button
            style={{ marginTop: "6.5px" }}
            height={56}
            width={56}
            stylingMode="outlined"
            onClick={handleSaveData}
            icon="search"
          />
        </div>
      </div>
      <div className="content-block dx-card">
        <DataGrid
          dataSource={reportData}
          showBorders={false}
          selection={{
            mode: "multiple",
          }}
          className="log-data-grid"
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
          <Column dataField="id" visible={false} />

          <Column
            caption="Profile"
            dataField="vavatar"
            cellRender={renderGridCell}
          />
          <Column caption="Visitor name" dataField="vName" />
          <Column caption="Company Name" dataField="vCmpname" />
          <Column caption="Location" dataField="vLocation" />
          <Column caption="state" dataField="state" />
          <Column caption="status" dataField="status" />
          <Column caption="Email" dataField="vEmail" />
          <Column caption="Department" dataField="deptName" />
          <Column caption="Contact Person" dataField="cnctperson" />
          <Column
            caption="timeslot"
            dataField="timeslot"
            cellRender={(data) => formatDate1(data.value)}
          />
          <Column caption="any hardware" dataField="anyhardware" />
          <Column caption="added By" dataField="addedBy" />
          <Column caption="Phone" dataField="vPhone1" />

          <Toolbar className="toolbar-item">
            <Item location="before">
              <div className="informer">
                <SubText
                  text={`In total, you have ${reportData.length} reports`}
                />
              </div>
            </Item>
            <Item name="searchPanel" />
            <Item location="after">
              <SelectBox
                // width={116}
                // height={44}
                valueExpr="value"
                displayExpr="text"
                stylingMode="outlined"
                className="left-textbox"
                placeholder="Check In"
                items={allCheckinVisitor}
                value={filterState}
                onValueChanged={(e) => handleFilterState(e.value)}
              />
            </Item>
            <Item location="after">
              <SelectBox
                // width={166}
                // height={44}
                valueExpr="value"
                displayExpr="text"
                stylingMode="outlined"
                items={allVisitorsState}
                value={filterStatus}
                // className="left-textbox"
                // placeholder="Pending Visitors"
                onValueChanged={(e) => handleFilterChange(e.value)}
              />
            </Item>
            <Item location="after">
              <Button
                // text="Download"
                icon={DownloadIcon}
                stylingMode="outlined"
                height={45}
                width={45}
                className="left-textbox"
                onClick={handleDownload}
              />
            </Item>
          </Toolbar>
        </DataGrid>
      </div>
    </>
  );
};

export default ReportMain;
