import React, { useEffect, useRef, useState } from "react";
import {
  HeaderText,
  SubText,
} from "../../components/typographyText/TypograghyText";
import { SelectBox, Button, ContextMenu } from "devextreme-react";
import "./visitor-main.scss";
import Breadcrumbs from "../../components/breadcrumbs/BreadCrumbs";
import { useNavigate } from "react-router-dom";
import DataGrid, {
  Column,
  Paging,
  Toolbar,
  Item,
  Pager,
  SearchPanel,
} from "devextreme-react/data-grid";
import "remixicon/fonts/remixicon.css";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { useRecoilState } from "recoil";
import { addedByAtom, stateAtom, statusAtom } from "../../contexts/atom";
import { useWebSocket } from "../../contexts/websocket";
import { useAuth } from "../../contexts/auth";
import { CleaningServices } from "@mui/icons-material";
import SendVerification from "../../components/popups/send-verification";
import { toastDisplayer } from "../../components/toastDisplayer/toastdisplayer";
import {
  checkInVisitorApi,
  checkOutVisitorApi,
} from "../../api/mobileVisitorApi";
import CustomLoader from "../../components/customerloader/CustomLoader";
import { saveAs } from "file-saver";
import { Workbook } from "exceljs";
import { exportDataGrid } from "devextreme/excel_exporter";
import { getVisiotrCompanyWise } from "../../api/visitorApi";

const getStatusColor = (status) => {
  const statusColors = {
    Approved: "#124d22",
    Pending: "#934908",
    Rejected: "#AD1820",
    Canceled: "#344450",
    "Check in": "0D4D8B",
    "Check Out": "#AD1820",
  };

  return statusColors[status];
};
const sanitizeClassName = (str) => {
  return String(str).replace(/[^a-zA-Z0-9_-]/g, "");
};
const VisitorMain = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/Visitors/Add-Visitors");
  };
  // let dataGrid;
  const [clickedRowData, setClickedRowData] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [status, setStatus] = useRecoilState(statusAtom);
  const [state, setState] = useRecoilState(stateAtom);
  const [addedby, setAddedby] = useRecoilState(addedByAtom);
  const [checkOutRowData, setCheckOutRowData] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isChkInPopupVisible, setIsChkInPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { send, eventEmitter } = useWebSocket();
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterState, setFilterState] = useState("All");
  const [statusMessage, setStatusMessage] = useState(null);
  const dataGrid = useRef(null);
  // ------------------ filter according to state ----------------//
  const allVisitorsState = [
    { value: "All", text: "All Visitors" },
    { value: "Pending", text: "Pending " },
    { value: "Approved", text: "Approved " },
    { value: "Rejected", text: "Rejected " },
    { value: "Canceled", text: "Canceled " },
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

  const getVisitorsData = async () => {
    try {
      setLoading(true);
      const getData = await getVisiotrCompanyWise(user ? user.cmpid : 0, "all");

      if (getData.hasError) {
        setLoading(false);
        return toastDisplayer("error", getData.error);
      }
      setVisitors(getData.responseData);

      setLoading(false);
    } catch {}
  };
  useEffect(() => {
    getVisitorsData();
  }, []);

  useEffect(() => {
    // const onVisitors = (data) => {
    //   setLoading(true);
    //   setVisitors(data.visitors);
    //   setLoading(false);
    // };

    const onNewVisitor = (data) => {
      setVisitors((prevVisitors) => {
        if (
          !prevVisitors.some(
            (existingVisitor) => existingVisitor.id === data.visitor.id
          )
        ) {
          return [data.visitor, ...prevVisitors];
        }
        return prevVisitors;
      });
    };

    const onUpdateVisitor = (data) => {
      setVisitors((prevVisitors) =>
        prevVisitors.map((visitor) =>
          visitor.id === data.visitor.transid
            ? {
                ...visitor,
                state:
                  data.visitor.status === "R"
                    ? "Rejected"
                    : data.visitor.status === "A"
                    ? "Approved"
                    : "",
                reason: data.visitor.reason,
                status: data.visitor.checkinstatus,
              }
            : visitor
        )
      );
    };

    // eventEmitter.on("visitors", onVisitors);
    eventEmitter.on("new_visitor", onNewVisitor);
    eventEmitter.on("update_visitor", onUpdateVisitor);
    // setLoading(true);
    // send({ type: "send_visitors", cmpid: user ? user.cmpid : 0 });
    // setLoading(false);
    return () => {
      // eventEmitter.off("visitors", onVisitors);
      eventEmitter.off("new_visitor", onNewVisitor);
      eventEmitter.off("update_visitor", onUpdateVisitor);
    };
  }, [send, eventEmitter, user]);

  var selectedRowData = "";
  const onCloneIconClick = (e) => {
    selectedRowData = e.data;
  };

  const handleClone = (data) => {
    navigate("/Visitors/Add-Visitors", { state: clickedRowData });
  };

  const actionTemplate = (cellData, e) => {
    const actionMenuItems = [
      {
        text: "Check Out",
        onClick: () => {
          handleOpenPopup();
        },
      },
      {
        text: "View Details",
        onClick: () => {
          setTimeout(() => {
            sessionStorage.setItem(
              "prevPath",
              `/Visitors/Details-of-Visitor?visitorId=${selectedRowData.id}`
            );
          }, 1000);
          navigate(
            `/Visitors/Details-of-Visitor?visitorId=${selectedRowData.id}`
          );
        },
      },
      {
        text: "Clone",
        onClick: () => {
          handleClone(cellData?.data);
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
            onClick={() => onCloneIconClick(cellData)}
          >
            <MoreHorizOutlinedIcon />
          </Button>
        </div>
        <ContextMenu
          items={actionMenuItems}
          target={`.${sanitizedClassName}`}
          showEvent={"dxclick"}
          cssClass={"actionMenu"}
          //onItemClick={handleMenuClick}
        />
      </>
    );
  };

  const actionTemplate2 = (cellData, e) => {
    const actionMenuItems = [
      {
        text: "View Details",
        onClick: () => {
          setTimeout(() => {
            sessionStorage.setItem(
              "prevPath",
              `/Visitors/Details-of-Visitor?visitorId=${selectedRowData.id}`
            );
          }, 1000);
          navigate(
            `/Visitors/Details-of-Visitor?visitorId=${selectedRowData.id}`
          );
        },
      },
      {
        text: "Clone",
        onClick: () => {
          handleClone(cellData?.data);
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
            onClick={() => onCloneIconClick(cellData)}
          >
            <MoreHorizOutlinedIcon />
          </Button>
        </div>
        <ContextMenu
          items={actionMenuItems}
          target={`.${sanitizedClassName}`}
          showEvent={"dxclick"}
          cssClass={"actionMenu"}
          //onItemClick={handleMenuClick}
        />
      </>
    );
  };

  const actionTemplate3 = (cellData, e) => {
    const actionMenuItems = [
      {
        text: "Check In",
        onClick: () => {
          handleChkInOpenPopup();
        },
      },
      {
        text: "View Details",
        onClick: () => {
          setTimeout(() => {
            sessionStorage.setItem(
              "prevPath",
              `/Visitors/Details-of-Visitor?visitorId=${selectedRowData.id}`
            );
          }, 1000);
          navigate(
            `/Visitors/Details-of-Visitor?visitorId=${selectedRowData.id}`
          );
        },
      },
      {
        text: "Clone",
        onClick: () => {
          handleClone(cellData?.data);
        },
      },
    ];

    const sanitizedClassName = `actionbtn3-${sanitizeClassName(
      cellData.data.ID
    )}`;

    const actionMenuMode = "context1";

    return (
      <>
        <div className="actionDetails">
          <Button
            stylingMode="outlined"
            className={sanitizedClassName}
            onClick={() => onCloneIconClick(cellData)}
          >
            <MoreHorizOutlinedIcon />
          </Button>
        </div>
        <ContextMenu
          items={actionMenuItems}
          target={`.${sanitizedClassName}`}
          showEvent={"dxclick"}
          cssClass={"actionMenu"}
          //onItemClick={handleMenuClick}
        />
      </>
    );
  };

  const handleOpenPopup = () => {
    setCheckOutRowData(selectedRowData);
    setIsPopupVisible(true);
  };

  const handleChkInOpenPopup = () => {
    setCheckOutRowData(selectedRowData);
    setIsChkInPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const handleCloseChkInPopup = () => {
    setIsChkInPopupVisible(false);
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

  const handleCheckIn = async () => {
    setLoading(true);
    const authState = JSON.parse(sessionStorage.getItem("authState"));
    const cmpid = authState.user.cmpid;
    const payload = {
      e_mail: checkOutRowData.vEmail,
      company_id: cmpid,
      sender_email: user.e_mail,
      sender_role: user.userrole,
    };
    const checkOutVisitor = await checkInVisitorApi(payload);
    setLoading(false);
    if (checkOutVisitor.hasError === true) {
      return toastDisplayer("error", `${checkOutVisitor.error}`);
    }
    setIsChkInPopupVisible(false);
    getVisitorsData();
    return toastDisplayer(
      "success",
      `${checkOutRowData.vName} has been successfully checked in to meet ${
        checkOutRowData.cnctperson
      } on ${formatDate(checkOutRowData.timeslot)}`
    );
  };

  const handleCheckOut = async () => {
    setLoading(true);
    const authState = JSON.parse(sessionStorage.getItem("authState"));
    const cmpid = authState.user.cmpid;
    const payload = {
      e_mail: checkOutRowData.vEmail,
      company_id: cmpid,
      sender_email: user.e_mail,
      sender_role: user.userrole,
    };
    const checkOutVisitor = await checkOutVisitorApi(payload);
    setLoading(false);
    if (checkOutVisitor.hasError === true) {
      return toastDisplayer("error", `${checkOutVisitor.error}`);
    }
    setIsPopupVisible(false);
    getVisitorsData();
    return toastDisplayer(
      "success",
      `${checkOutRowData.vName} has been successfully checked out after meeting ${checkOutRowData.cnctperson}`
    );
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
          "VisitorsData.xlsx"
        );
      });
    });
    setLoading(false);
  };

  const handleRowDblClick = (event) => {
    const rowData = event.data; // Access the data of the double-clicked row
    setTimeout(() => {
      sessionStorage.setItem(
        "prevPath",
        `/Visitors/Details-of-Visitor?visitorId=${selectedRowData.id}`
      );
    }, 1000);
    navigate(`/Visitors/Details-of-Visitor?visitorId=${rowData.id}`);
    // Add your custom logic here, e.g., opening a detailed view
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
      <div className="content-block">
        <div className="navigation-header-main">
          <div className="title-section">
            <HeaderText text="Add Visitors" />
          </div>
          <div className="title-section-btn">
            <Button
              text="Export to Excel"
              stylingMode="outlined"
              width="auto"
              height={44}
              onClick={handleDownload}
              disabled={!visitors.length}
            />
            <Button
              text="Manual Entry"
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
          dataSource={visitors}
          // dataSource={customers}
          showBorders={false}
          selection={{
            mode: "multiple",
          }}
          className="data-grid"
          hoverStateEnabled={true}
          columnAutoWidth={true}
          ref={dataGrid}
          // ref={(ref) => {
          //   dataGrid = ref;
          // }}
          onRowDblClick={handleRowDblClick}
          onRowClick={(e) => setClickedRowData(e?.data)}
        >
          <SearchPanel
            visible={true}
            width={250}
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
          <Column dataField="vName" caption="Visitor name" />
          {/* <Column type="buttons" cellRender={actionTemplate}>
            <ColumnButton
              onClick={(cellData) => handlePopupIconClick(cellData)}
            >
              <MoreHorizOutlinedIcon />
            </ColumnButton>
          </Column> */}
          <Column
            dataField="ACTIONS"
            cellRender={(e) => {
              if (e.data.status == "Check in") {
                return actionTemplate(e);
              } else if (
                e.data.status == null &&
                e.data.state == "Approved" &&
                new Date(e.data.timeslot) >= new Date().setHours(0, 0, 0, 0)
              ) {
                return actionTemplate3(e);
              } else {
                return actionTemplate2(e);
              }
            }}
            caption="ACTIONS"
            allowSorting={false}
            // width={"10%"}
            allowSearch={false}
          />
          <Column
            alignment={"center"}
            // width={150}
            dataField={"status"}
            caption={"Status"}
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
                    <span data-type={data["value"]}>
                      {data["value"] == null ? "-" : data["value"]}
                    </span>
                  </span>
                </>
              );
            }}
          />
          <Column dataField="vCmpname" caption="Company Name" />
          <Column
            alignment={"center"}
            // width={150}
            dataField={"state"}
            caption={"State"}
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
            dataField="timeslot"
            caption="Date"
            cellRender={(data) => formatDate(data.value)}
          />
          {/* <Column dataField="sortDate" caption="Date" dataType="datetime"
          format="M/d/yyyy, HH:mm"/> */}
          <Column dataField="addedBy" />
          <Toolbar className="toolbar-item">
            <Item location="before">
              <div className="informer">
                <SubText
                  text={`In total, you have ${visitors?.length} visitors`}
                />
              </div>
            </Item>
            <Item name="searchPanel" cssClass="searchBox" />
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
                // placeholder="Pending Visitors"
                onValueChanged={(e) => handleFilterChange(e.value)}
              />
            </Item>
          </Toolbar>
        </DataGrid>
      </div>
      <SendVerification
        header="Check-out Confirmation"
        subHeader="Are you sure you want visitor to check-out? "
        approval="Check-out"
        discard="Cancel"
        saveFunction={handleCheckOut}
        statusMessage={statusMessage}
        isVisible={isPopupVisible}
        onHide={handleClosePopup}
        loading={loading}
      />
      <SendVerification
        header="Check-in Confirmation"
        subHeader="Are you sure you want visitor to check-in? "
        approval="Check-in"
        discard="Cancel"
        saveFunction={handleCheckIn}
        isVisible={isChkInPopupVisible}
        onHide={handleCloseChkInPopup}
        loading={loading}
      />
    </>
  );
};

export default VisitorMain;
