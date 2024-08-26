import React, { useState } from "react";
import { HeaderText } from "../../components/typographyText/TypograghyText";
import { TabPanel } from "devextreme-react";
import { Item } from "devextreme-react/cjs/tab-panel";
import "./user-settings.scss";
import AddUser from "./add-user/add-user";
import UserAuthorization from "./authorize-user/user-authorization";
import UserProfile from "./user's-profile/user-profile";
import NotificationAuthorization from "./notification-authorize/notification-authorization";
import CustomLoader from "../../components/customerloader/CustomLoader";

const UserSettingsMain = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0); // Start with the first tab

  const handleTabChange = (index) => {
    setActiveTabIndex(parseInt(index));
  };
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);
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
            <HeaderText text="User Settings" />
          </div>
        </div>
      </div>
      <div className="content-block tab-panel">
        <TabPanel
          id="tabPanel"
          deferRendering={true}
          selectedIndex={parseInt(activeTabIndex)}
          onSelectedItemChange={handleTabChange}
        >
          <Item title="Add Users" deferRendering={true}>
            <AddUser
              setLoading={setLoading}
              activeTabIndex={parseInt(activeTabIndex)}
              setActiveTabIndex={setActiveTabIndex}
            />
          </Item>
          <Item title="User’s Profile" deferRendering={true}>
            <UserProfile
              setLoading={setLoading}
              activeTabIndex={activeTabIndex}
            />
          </Item>
          <Item title="Authorise User" deferRendering={true}>
            <UserAuthorization setLoading={setLoading} />
          </Item>
          <Item title="Notification Authorise" deferRendering={true}>
            <NotificationAuthorization setLoading={setLoading} />
          </Item>
        </TabPanel>
      </div>
    </>
  );
};

export default UserSettingsMain;
