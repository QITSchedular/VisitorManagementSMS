import React, {
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import TreeView from "devextreme-react/tree-view";
import { navigation } from "../../app-navigation";
import { useNavigation } from "../../contexts/navigation";
import { useScreenSize } from "../../utils/media-query";
import "./SideNavigationMenu.scss";
import { Autocomplete, Button } from "devextreme-react";
import "remixicon/fonts/remixicon.css";
import * as events from "devextreme/events";
import { useAuth } from "../../contexts/auth";
import { notificationAtom } from "../../contexts/atom";
import { useRecoilState } from "recoil";
export default function SideNavigationMenu(props) {
  const { children, selectedItemChanged, openMenu, compactMode, onMenuReady } =
    props;
  const { signOut, authRuleContext, user } = useAuth();
  const { isLarge } = useScreenSize();
  const [authNavigation, setAuthNavigation] = useState([]);
  const [notificationAtomState, setNotificationAtomState] =
    useRecoilState(notificationAtom);

  const [notificationCnt, setNotificationCnt] = useState(0);
  useEffect(() => {
    if (notificationAtom) {
      if (notificationAtomState) {
        const data = notificationAtomState.filter(
          (item) => item.chk_status == "P"
        );
        setNotificationCnt(data.length);
      }
    }
  }, [notificationAtomState]);

  useEffect(() => {
    if (authRuleContext) {
      setAuthNavigation(authRuleContext);
    }
  }, [authRuleContext]);

  const [searchValue, setSearchValue] = useState("");

  function normalizePath() {
    return navigation.map((item) => ({
      ...item,
      expanded: isLarge,
      path: item.path && !/^\//.test(item.path) ? `/${item.path}` : item.path,
    }));
  }

  const items = useMemo(normalizePath, [isLarge]);

  const {
    navigationData: { currentPath },
  } = useNavigation();

  const treeViewRef = useRef(null);
  const wrapperRef = useRef();
  const getWrapperRef = useCallback(
    (element) => {
      const prevElement = wrapperRef.current;
      if (prevElement) {
        events.off(prevElement, "dxclick");
      }

      wrapperRef.current = element;
      events.on(element, "dxclick", (e) => {
        openMenu(e);
      });
    },
    [openMenu]
  );

  useEffect(() => {
    const treeView = treeViewRef.current && treeViewRef.current.instance;
    if (!treeView) {
      return;
    }

    if (currentPath !== undefined) {
      treeView.selectItem(currentPath);
      treeView.expandItem(currentPath);
      sessionStorage.setItem("prevPath", currentPath);
    }

    if (compactMode) {
      treeView.collapseAll();
    }
  }, [currentPath, compactMode]);

  const itemRender = (item) => {
    return (
      <div className="treeview-item-content">
        <i className={`${item.icon} custom-icon`}></i>
        <span className="custom-text">
          {item.text}
          {item.text === "Notification" && (
            <span className="notification-badge">{notificationCnt}</span>
          )}
        </span>
      </div>
    );
  };

  // Handle search input change
  const handleSearchValueChanged = (e) => {
    setSearchValue(e.value);
  };

  // Filter items based on search input
  const filteredItems = authNavigation.filter((item) =>
    searchValue
      ? item.text.toLowerCase().includes(searchValue.toLowerCase())
      : true
  );

  return (
    <div
      className={`dx-swatch-additional side-navigation-menu`}
      ref={getWrapperRef}
    >
      {children}
      {compactMode && (
        <div className="search-icon">
          <i className="ri-search-line"></i>
        </div>
      )}
      {!compactMode && (
        <>
          {user.cmpLogo != "" && user.cmpLogo != null ? (
            <>
              <div className="logo-cmp">
                <img src={user.cmpLogo} height={60} />
              </div>
            </>
          ) : (
            ""
          )}
        </>
      )}
      <div className="logout-link" onClick={signOut}>
        <i className="ri-logout-box-line"></i>
        <span>Logout</span>
      </div>
      {!compactMode && (
        <div className="search-box">
          <i className="ri-search-line"></i>
          <Autocomplete
            placeholder="Search modules"
            stylingMode="outlined"
            showClearButton={true}
            displayExpr={(item) => item.text}
            valueExpr="text"
            value={searchValue}
            onValueChanged={handleSearchValueChanged}
          />
        </div>
      )}
      <div className={"menu-container"}>
        <TreeView
          ref={treeViewRef}
          items={filteredItems}
          // items={navigation}
          keyExpr={"path"}
          selectionMode={"single"}
          focusStateEnabled={false}
          expandEvent={"click"}
          onItemClick={selectedItemChanged}
          onContentReady={onMenuReady}
          itemRender={itemRender}
          width={"100%"}
        />
      </div>
    </div>
  );
}
