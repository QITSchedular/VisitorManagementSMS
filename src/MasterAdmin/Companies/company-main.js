import React, { useEffect, useRef, useState } from "react";
import { SelectBox, Button, ContextMenu } from "devextreme-react";
import Breadcrumbs from "../../components/breadcrumbs/BreadCrumbs";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import { Workbook } from "exceljs";
import { exportDataGrid } from "devextreme/excel_exporter";
import {
  HeaderText,
  SubText,
} from "../../components/typographyText/TypograghyText";
import DataGrid, {
  Column,
  Paging,
  Toolbar,
  Item,
  Pager,
  SearchPanel,
} from "devextreme-react/data-grid";
import CustomLoader from "../../components/customerloader/CustomLoader";
import { changeCmpStatus, getAllCompnies } from "../../api/masterAdmin";
import { toastDisplayer } from "../../components/toastDisplayer/toastdisplayer";
import "./company-main.scss";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import ChangeCmpStatus from "../../components/popups/changeCmpStatus";
import { useAuth } from "../../contexts/auth";

const Companymain = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [companiesData, setCompaniesData] = useState([]);
  const [filterState, setFilterState] = useState("All");
  const [activePopUp, setActivePopUp] = useState(false);
  const [inactivePopUp, setInactivePopUp] = useState(false);
  const [reasonInput, setReasonInput] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const dataGrid = useRef(null);
  const getStatusColor = (status) => {
    const statusColors = {
      A: "#124d22",
      I: "#934908",
    };

    return statusColors[status];
  };

  const allCompanies = [
    { value: "All", text: "All Comapnies" },
    { value: "A", text: "Active" },
    { value: "I", text: "Inactive" },
  ];
  const handleClick = () => {
    // navigate("/Visitors/Add-Visitors");
    navigate("/Company/Add-Company");
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
          "CompaniesData.xlsx"
        );
      });
    });
    setLoading(false);
  };

  const getCompniesData = async () => {
    try {
      setLoading(true);
      const getData = await getAllCompnies();

      if (getData.hasError) {
        setLoading(false);
        return toastDisplayer("error", getData.error);
      }
      setCompaniesData(getData.responseData);

      setLoading(false);
    } catch {}
  };

  useEffect(() => {
    getCompniesData();
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getUTCFullYear().toString().slice(-2);
    const month = date.getMonth() + 1;
    const date1 = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

    const monthStr = month < 10 ? `0${month}` : `${month}`;
    var data = `Joined on ${date1}.${monthStr}.${year}`;
    return data;
  }

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

  const sanitizeClassName = (str) => {
    return String(str).replace(/[^a-zA-Z0-9_-]/g, "");
  };

  const actionTemplate = (cellData) => {
    const actionMenuItems = [
      {
        text: "Make it Inactive ",
        onClick: () => {
          setSelectedRow(cellData.data.transid);
          handleActivePopUp();
        },
      },
      {
        text: "Edit & View Details",
        onClick: () => {
          setSelectedRow(cellData.data.transid);
          navigate(`/Company/Company-Details`, { state: cellData.data });
        },
      },
    ];

    const sanitizedClassName = `actionbtn-${sanitizeClassName(
      cellData.data.ID
    )}`;

    return (
      <>
        <div className="actionDetails">
          <Button
            stylingMode="outlined"
            className={sanitizedClassName}
            // onClick={() => onCloneIconClick(cellData)}
          >
            <MoreHorizOutlinedIcon />
          </Button>
        </div>
        <ContextMenu
          items={actionMenuItems}
          target={`.${sanitizedClassName}`}
          showEvent={"dxclick"}
          className={"actionMenu"}
          //onItemClick={handleMenuClick}
        />
      </>
    );
  };

  const actionTemplate2 = (cellData, e) => {
    const actionMenuItems = [
      {
        text: "Make it Active",
        onClick: () => {
          setSelectedRow(cellData.data.transid);
          handleInactivePopUp();
        },
      },
      {
        text: "Edit & View Details",
        onClick: () => {
          setSelectedRow(cellData.data.transid);
          navigate(`/Company/Company-Details`, { state: cellData.data });
        },
      },
    ];

    const sanitizedClassName = `actionbtn1-${sanitizeClassName(
      cellData.data.ID
    )}`;

    const actionMenuMode = "context1";

    return (
      <>
        <div className="actionDetails">
          <Button
            stylingMode="outlined"
            className={sanitizedClassName}
            // onClick={() => onCloneIconClick(cellData)}
          >
            <MoreHorizOutlinedIcon />
          </Button>
        </div>
        <ContextMenu
          items={actionMenuItems}
          target={`.${sanitizedClassName}`}
          showEvent={"dxclick"}
          className={"actionMenu"}
          //onItemClick={handleMenuClick}
        />
      </>
    );
  };

  const handleActivePopUp = () => {
    setActivePopUp(true);
  };

  const handleCloseActivePopUp = () => {
    setActivePopUp(false);
    setReasonInput("");
  };

  const handleInactivePopUp = () => {
    setInactivePopUp(true);
  };

  const handleCloseInactivePopUp = () => {
    setInactivePopUp(false);
    setReasonInput("");
  };

  const handleReasonInput = (e) => {
    setReasonInput(e.value);
  };

  const handleActivateSave = async () => {
    if (reasonInput == "" || reasonInput == null) {
      return toastDisplayer("error", "Reason is required.");
    }
    handleStatusChange("I");
  };
  const handleInactivateSave = async () => {
    handleStatusChange("A");
  };

  const handleStatusChange = async (status) => {
    setLoading(true);
    const reqPayload = {
      cmpid: selectedRow,
      status: status,
      reason: reasonInput,
    };
    var response = await changeCmpStatus(reqPayload);
    setLoading(false);
    if (response.hasError) {
      return toastDisplayer("error", response.error);
    } else {
      getCompniesData();
      if (status == "A") {
        setInactivePopUp(false);
        return toastDisplayer("success", "Company activated successfully.");
      } else {
        setActivePopUp(false);
        return toastDisplayer("success", "Company deactivated successfully.");
      }
    }
  };

  const handleRowDblClick = (event) => {
    const rowData = event.data; // Access the data of the double-clicked row
    navigate(`/Company/Company-Details`, { state: rowData });
    // Add your custom logic here, e.g., opening a detailed view
  };

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
            <HeaderText text="List of Companies" />
          </div>
          <div className="title-section-btn">
            <Button
              text="Export to Excel"
              stylingMode="outlined"
              width="auto"
              height={44}
              onClick={handleDownload}
            />
            <Button
              text="Create New"
              width={140}
              height={44}
              className="button-with-margin"
              onClick={handleClick}
            />
          </div>
        </div>
      </div>
      <Breadcrumbs />

      <div className="content-block dx-card">
        <DataGrid
          dataSource={companiesData}
          showBorders={false}
          selection={{
            mode: "multiple",
          }}
          className="data-grid"
          hoverStateEnabled={true}
          columnAutoWidth={true}
          ref={dataGrid}
          // ref={(ref) => {
          // dataGrid = ref;
          // }}
          onRowDblClick={handleRowDblClick}
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
            dataField="bname"
            alignment={"left"}
            caption="name of company"
          />
          <Column
            dataField="ACTIONS"
            width={"auto"}
            cellRender={(e) => {
              if (e.data.status == "A") {
                return actionTemplate(e);
              } else {
                return actionTemplate2(e);
              }
            }}
            caption="ACTIONS"
            allowSorting={false}
            allowSearch={false}
          />
          <Column
            alignment={"left"}
            // width={150}
            dataField={"status"}
            caption={"Status"}
            cellRender={(data) => {
              var displayData =
                data["value"] == "A"
                  ? "Active"
                  : data["value"] == "I"
                  ? "Inactive"
                  : null;
              return (
                <>
                  <span className="col-main" data-type={displayData}>
                    <span
                      className="status-circle"
                      style={{
                        backgroundColor: getStatusColor(displayData),
                      }}
                    />
                    <span data-type={displayData}>
                      {displayData == null ? "-" : displayData}
                    </span>
                  </span>
                </>
              );
            }}
          />
          <Column dataField="blocation" caption="Location" alignment={"left"} />

          <Column dataField="valid" caption="Valid till" alignment={"center"} />
          <Column dataField="plan" caption="Plan" alignment={"center"} />

          <Column
            alignment={"left"}
            // width={150}
            dataField={"payment"}
            caption={"pAYMENT"}
            cellRender={(data) => {
              return (
                <>
                  <span className="col-main" data-type={data["value"]}>
                    <span
                      className="status-circle"
                      style={{
                        backgroundColor: getStatusColor(data["value"]),
                      }}
                    />
                    <span data-type={data["value"]}>{data["value"]}</span>
                  </span>
                </>
              );
            }}
          />
          <Column
            dataField="entrydate"
            caption="Date"
            alignment={"left"}
            sortOrder="desc"
            cellRender={(data) => {
              return (
                <>
                  <span>{formatDate(data["value"])}</span>
                </>
              );
            }}
          />
          <Column dataField="totaluser" caption="Users" alignment={"center"} />

          <Toolbar className="toolbar-item">
            <Item location="before">
              <div className="informer">
                <SubText
                  text={`In total, you have ${companiesData?.length} companies`}
                />
              </div>
            </Item>
            <Item name="searchPanel" />
            <Item location="after">
              <SelectBox
                width={170}
                // height={44}
                valueExpr="value"
                displayExpr="text"
                stylingMode="outlined"
                className="left-textbox"
                placeholder="All Companies"
                items={allCompanies}
                value={filterState}
                onValueChanged={(e) => handleFilterState(e.value)}
              />
            </Item>
          </Toolbar>
        </DataGrid>
      </div>

      {activePopUp && (
        <>
          <ChangeCmpStatus
            header={"Make it Inactive"}
            subHeader={"Mention Reasons"}
            btnTxt={"Deactivate"}
            isVisible={activePopUp}
            closePopUpHandle={handleCloseActivePopUp}
            isActive={false}
            handleReasonInput={handleReasonInput}
            handleSubmit={handleActivateSave}
          />
        </>
      )}
      {inactivePopUp && (
        <>
          <ChangeCmpStatus
            header={"Make it Active"}
            subHeader={"Mention Reasons"}
            btnTxt={"Activate"}
            isVisible={inactivePopUp}
            closePopUpHandle={handleCloseInactivePopUp}
            isActive={true}
            handleReasonInput={handleReasonInput}
            handleSubmit={handleInactivateSave}
          />
        </>
      )}
    </>
  );
};

export default Companymain;
