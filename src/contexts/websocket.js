import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import EventEmitter from "eventemitter3";
import { useAuth } from "./auth";
import { useRecoilState } from "recoil";
import { notificationAtom } from "./atom";

// Create WebSocket context
const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
  const { user } = useAuth();
  const ws = useRef(null);
  const eventEmitter = useRef(new EventEmitter());
  const [notificationData, setNotificationData] = useState([]);
  const [notificationAtomState, setNotificationAtomState] =
    useRecoilState(notificationAtom);

  const getConnectWebsocket = async () => {
    if (user) {
      if (user.userrole == "MA") {
        ws.current = new WebSocket(
          `${process.env.REACT_APP_WSS_URL}?type=${"sa"}&user=${
            user.transid
          }&cmp=${user.cmpid}`
        );
      } else {
        ws.current = new WebSocket(
          `${process.env.REACT_APP_WSS_URL}?type=${"user"}&user=${
            user.transid
          }&cmp=${user.cmpid}`
        );
      }

      if (user.userrole == "MA") {
        ws.current.onopen = () => {
          send({ type: "send_sa_notification", usrid: user.transid });
        };
      } else {
        ws.current.onopen = () => {
          send({ type: "send_notifications", usrid: user.transid ,cmpid:user.cmpid});
        };
      }

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        eventEmitter.current.emit(data.type, data);
      };

      ws.current.onclose = () => {};

      ws.current.onerror = (error) => {};

      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  };

  const send = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
    }
  };

  useEffect(() => {
    getConnectWebsocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [user]);

  useEffect(() => {
    const handleNotifications = (data) => {
      setNotificationData(data.notification);
      setNotificationAtomState(data.notification);
    };

    const handleNotification = (data) => {
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
    const handleSaNotification = (data) => {
      console.log("Data : ", data.data);
      // const newData = data.data;
      setNotificationData(data.data);
      setNotificationAtomState(data.data);
      // setNotificationData((prevData) => {
      //   const isDuplicate = prevData.some(
      //     (item) => item.transid === newData.transid
      //   );
      //   if (!isDuplicate) {
      //     return [newData, ...prevData];
      //   }
      //   return prevData;
      // });
    };
    const onUpdateNotification = (data) => {
      setNotificationData((prevNotificationData) => [
        data.notification,
        ...prevNotificationData,
      ]);
      setNotificationAtomState((prevNotificationData) => [
        data.notification,
        ...prevNotificationData,
      ]);
    };
    const onUpdateSaNotification = (data) => {
      console.log("data : ",data)
      setNotificationData((prevNotificationData) => [
        data.notification,
        ...prevNotificationData,
      ]);
      setNotificationAtomState((prevNotificationData) => [
        data.notification,
        ...prevNotificationData,
      ]);
    };

    eventEmitter.current.on("notifications", handleNotifications);
    eventEmitter.current.on("notification", handleNotification);
    eventEmitter.current.on("sa_notification", handleSaNotification);
    eventEmitter.current.on("new_sa_notification", onUpdateSaNotification);
    eventEmitter.current.on("new_notification", onUpdateNotification);
    return () => {
      eventEmitter.current.off("notifications", handleNotifications);
      eventEmitter.current.off("notification", handleNotification);
      eventEmitter.current.off("sa_notification", handleSaNotification);
      eventEmitter.current.off("new_sa_notification", onUpdateSaNotification);
      eventEmitter.current.off("new_notification", onUpdateNotification);
    };
  }, [user]);

  return (
    <WebSocketContext.Provider
      value={{ send, eventEmitter: eventEmitter.current }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
