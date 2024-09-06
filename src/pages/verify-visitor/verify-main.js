import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../components/breadcrumbs/BreadCrumbs";
import {
  HeaderText,
  SubText,
} from "../../components/typographyText/TypograghyText";
import "./verify-visitor.scss";
import SearchBox from "./search-box";
import VisitorCard from "./visitor-card/visitor-card";
import { getPendingVisiotrCompanyWise } from "../../api/visitorApi";
import { toastDisplayer } from "../../components/toastDisplayer/toastdisplayer";
import CustomLoader from "../../components/customerloader/CustomLoader";
import successStickers from "../../assets/images/success.gif";
import { SelectBox } from "devextreme-react";

const VerifyVisitorMain = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [visitorDataState, setVisitorDataState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [selectedDateFilter, setSelectedDateFilter] = useState("all");
  const [expandedCards, setExpandedCards] = useState({ 0: true });
  const [status, setStatus] = useState(null);

  const dateFilterOptions = [
    { value: "all", text: "All" },
    { value: "today", text: "Today" },
    { value: "tomorrow", text: "Tomorrow" },
    { value: "thisWeek", text: "This Week" },
  ];
  const filterVisitorsByDate = (filterValue) => {
    const today = new Date();
    let filteredData = [];

    switch (filterValue) {
      case "today":
        filteredData = visitorDataState.filter((visitor) => {
          const visitorDate = new Date(visitor.timeslot);
          const visitorUTCDate = new Date(
            visitorDate.getUTCFullYear(),
            visitorDate.getUTCMonth(),
            visitorDate.getUTCDate()
          );

          const today = new Date();
          const todayUTCDate = new Date(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            today.getUTCDate()
          );

          return visitorUTCDate.toDateString() === todayUTCDate.toDateString();
        });
        break;
      case "tomorrow":
        const tomorrow = new Date();
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
        const tomorrowUTCDate = new Date(
          tomorrow.getUTCFullYear(),
          tomorrow.getUTCMonth(),
          tomorrow.getUTCDate()
        );

        filteredData = visitorDataState.filter((visitor) => {
          const visitorDate = new Date(visitor.timeslot);
          const visitorUTCDate = new Date(
            visitorDate.getUTCFullYear(),
            visitorDate.getUTCMonth(),
            visitorDate.getUTCDate()
          );

          return (
            visitorUTCDate.toDateString() === tomorrowUTCDate.toDateString()
          );
        });
        break;

      case "thisWeek":
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        filteredData = visitorDataState.filter((visitor) => {
          const visitorDate = new Date(visitor.timeslot);
          return visitorDate >= startOfWeek && visitorDate <= endOfWeek;
        });
        break;
      default:
        filteredData = visitorDataState;
    }

    setFilteredVisitors(filteredData);
  };

  useEffect(() => {
    filterVisitorsByDate(selectedDateFilter);
  }, [selectedDateFilter, visitorDataState]);

  useEffect(() => {
    if (searchText !== "") {
      const lowerCaseSearchText = searchText ? searchText.toLowerCase() : "";
      const filteredData = visitorDataState.filter((visitor) =>
        visitor.vName.toLowerCase().includes(lowerCaseSearchText)
      );
      setFilteredVisitors(filteredData);
    }
  }, [searchText, visitorDataState]);

  const toggleExpand = (index) => {
    setExpandedCards((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const getAllVisitor = async () => {
    setIsLoading(true);
    const details = JSON.parse(sessionStorage.getItem("authState"));
    const { user } = details;
    const company_id = user.cmpid;
    const visitorData = await getPendingVisiotrCompanyWise(company_id, "all");
    if (visitorData.hasError === true) {
      setIsLoading(false);
      setVisitorDataState([]);
      setVisitorCount(0);
      // return toastDisplayer("error", `${visitorData.error}`);
      return console.log("error", `${visitorData.error}`);
    }
    const data = visitorData.responseData;
    setIsLoading(false);
    setVisitorCount(data.length);
    // filterVisitorsByDate(selectedDateFilter);
    return setVisitorDataState(data);
  };

  useEffect(() => {
    getAllVisitor();
  }, []);

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
            <HeaderText text="Verify Visitors" />
          </div>
        </div>
      </div>
      <Breadcrumbs />
      <div
        className="content-block dx-card"
        style={{ backgroundColor: "#FDFDFD" }}
      >
        <div
          className="navigation-header-main"
          style={{ marginBottom: "24px" }}
        >
          <div className="title-section">
            <SubText
              text={`For verification, you have ${visitorCount} visitors`}
            />
          </div>
          <div className="title-section-search">
            <SearchBox
              width={250}
              searchText={searchText}
              setSearchText={setSearchText}
            />
          </div>

          <SelectBox
            value={selectedDateFilter}
            dataSource={dateFilterOptions}
            valueExpr="value"
            displayExpr="text"
            onValueChanged={(e) => setSelectedDateFilter(e.value)}
            width={130}
          />
        </div>

        <div className="visitor-cards-container">
          {visitorDataState && visitorDataState.length > 0 ? (
            <>
              {searchText || selectedDateFilter
                ? filteredVisitors.map((visitor, index) => (
                    <VisitorCard
                      key={index}
                      index={index}
                      visitor={visitor}
                      isExpanded={expandedCards[index]}
                      onToggleExpand={() => toggleExpand(index)}
                      getAllVisitor={getAllVisitor}
                    />
                  ))
                : visitorDataState.map((visitor, index) => (
                    <VisitorCard
                      key={index}
                      index={index}
                      visitor={visitor}
                      isExpanded={expandedCards[index]}
                      onToggleExpand={() => toggleExpand(index)}
                      getAllVisitor={getAllVisitor}
                    />
                  ))}
            </>
          ) : (
            <div className="no-visitors-message">
              There are no visitors at the moment.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VerifyVisitorMain;
