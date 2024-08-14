import React, { useEffect, useState } from "react";
import "./HeaderTab.scss";
import { Tabs } from "devextreme-react";
import { useNavigate, useLocation } from "react-router-dom";
import { HeaderText } from "../typographyText/TypograghyText";

const HeaderTab = ({ HeaderTabText, setActivePage, activePageText }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const path2 = location.pathname.toLowerCase().replace(/^\//, "");

    const pageIndex = HeaderTabText.findIndex(
      (tab) => tab && tab.toLowerCase().replace(" ", "") == path2.toLowerCase()
    );
    setSelectedIndex(pageIndex !== -1 ? pageIndex : 0);
  }, [location.pathname, HeaderTabText]);

  const handleItemClick = (item) => {
    if (item.itemData) {
      const path = item.itemData.toLowerCase().replace(" ", "");

      navigate(`/${path}`);
      setActivePage(item.itemData);
    }
  };

  return (
    <div className="HeaderTab">
      <div className="Active-Header">
        <HeaderText text={HeaderTabText[selectedIndex]} />
      </div>
      <Tabs
        id="withText"
        width={"100%"}
        selectedIndex={selectedIndex}
        dataSource={HeaderTabText}
        onItemClick={handleItemClick}
      />
    </div>
  );
};

export default HeaderTab;
