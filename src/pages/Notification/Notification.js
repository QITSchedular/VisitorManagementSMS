import React, { useEffect, useState } from "react";
import HeaderTab from "../../components/HeaderTab/HeaderTab";
import "./notification.scss";
import { useWebSocket } from "../../contexts/websocket";
import { useAuth } from "../../contexts/auth";
import { SelectBox } from "devextreme-react";
import NotificationItem from "./NotificationItem";
import { getAllNotification, updateNotificationStatus } from "../../api/common";
import { useRecoilState } from "recoil";
import { notificationAtom } from "../../contexts/atom";
import { HeaderText } from "../../components/typographyText/TypograghyText";
import CustomLoader from "../../components/customerloader/CustomLoader";

const Notification = () => {
  const [activePage, setActivePage] = useState();
  const [loading, setLoading] = useState(false);
  const [notificationAtomState, setNotificationAtomState] =
    useRecoilState(notificationAtom);

  const [notificationCnt, setNotificationCnt] = useState(0);
  useEffect(() => {
    if (notificationAtom) {
      // setNotificationCnt(notificationAtomState.length);
    }
  }, [notificationAtomState]);

  const { authRuleContext, user } = useAuth();
  const [HeaderTabText, setHeaderTabtext] = useState([
    "Notification",
    "Profile",
  ]);
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

  const { send, eventEmitter } = useWebSocket();
  const [notificationData, setNotificationData] = useState([]);
  const [notificationAllData, setNotificationAllData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("R");
  // const [notificationData, setNotificationData] =
  //   useRecoilState(notificationAtom);

  useEffect(() => {
    if (notificationAtom && notificationAtomState) {
      if (notificationAtomState) {
        setNotificationData(notificationAtomState);
      }
    }
  }, [notificationAtomState]);

  useEffect(() => {
    // eventEmitter.on('notifications', (data) => {
    //     setNotificationData(data.notification);
    // });
    const onNewNotification = (data) => {
      setNotificationData((prevData) => {
        const isDuplicate = prevData.some(
          (item) => item.transid === data.notification.transid
        );
        if (!isDuplicate) {
          return [data.notification, ...prevData];
        }
        return prevData;
      });
    };

    const onUpdateNotification = (data) => {
      setNotificationData((prevNotificationData) => [
        data.notification,
        ...prevNotificationData,
      ]);
    };
    send({ type: "send_notifications", usrid: user ? user.transid : 0 ,cmpid:user ? user.cmpid : 0});
    eventEmitter.on("notification", onNewNotification);
    eventEmitter.on("new_notification", onUpdateNotification);
    return () => {
      eventEmitter.off("notifications");
      eventEmitter.off("new_notification", onUpdateNotification);
    };
  }, [send, eventEmitter]);

  useEffect(() => {
    const getData = async () => {
      if (selectedTab == "A") {
        setLoading(true);
        if(user.userrole=="MA"){
        const apiResponse = await getAllNotification("SA",user.e_mail, user.cmpid);
        if (!apiResponse.hasError) {
          setNotificationAllData(apiResponse.responseData.notifications);
          setLoading(false);
        }
      }else{
          const apiResponse = await getAllNotification("",user.e_mail, user.cmpid);
          if (!apiResponse.hasError) {
            setNotificationAllData(apiResponse.responseData.notifications);
            setLoading(false);
          }

        }
      }
    };
    getData();
  }, [selectedTab]);

  const Source = [
    { value: "R", text: "Recent" },
    { value: "A", text: "All" },
  ];

  const updateChkStatus = async (id) => {
    // if(user.userrole=="MA"){
    const apiResponse = await updateNotificationStatus(user.userrole == "MA" ? "Sa" : "",
      id,
      user.e_mail,
      user.cmpid
    );
    if (!apiResponse.hasError) {
      const updatedData = notificationData.map((item) => {
        if (item.transid === id) {
          return { ...item, chk_status: "A" };
        }
        return item;
      });
      setNotificationData(updatedData);
      setNotificationAtomState(updatedData);
    }
  };
  const handleInputChange = (value) => {
    setSelectedTab(value);
  };
  return (
    <>
      {loading && (
        <div className="Myloader">
          <CustomLoader />
        </div>
      )}
      <div className="notification">
        <HeaderTab
          HeaderTabText={HeaderTabText}
          HeaderText={activePage}
          setActivePage={setActivePage}
          NotificationCnt={notificationCnt}
        />
        <div className="content-block dx-card">
          <div className="header-container">
            <HeaderText text="Notification" />
            <SelectBox
              labelMode="outside"
              width={125}
              onValueChanged={(e) => handleInputChange(e.value)}
              value={selectedTab}
              items={Source}
              valueExpr={"value"}
              displayExpr={"text"}
            ></SelectBox>
          </div>
          <div className="notifydropdown-body">
            {selectedTab === "R"
              ? notificationData.map((values) => (
                  <>
                    <NotificationItem
                      key={values.transid}
                      values={values}
                      updateChkStatus={updateChkStatus}
                      // onClickReadMore={handleClickReadMore}
                      // expanded={expandedNotifications[values.n_Id]}
                    />
                  </>
                ))
              : notificationAllData.map((values) => (
                  <NotificationItem
                    key={values.transid}
                    values={values}
                    updateChkStatus={updateChkStatus}
                    // onClickReadMore={handleClickReadMore}
                    // expanded={expandedNotifications[values.n_Id]}
                  />
                ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;
