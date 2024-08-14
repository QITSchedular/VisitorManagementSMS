import React, { useEffect, useRef, useState } from "react";
import TreeList, {
  Column,
  SearchPanel,
  Toolbar,
  Item,
} from "devextreme-react/tree-list";
import CheckBox from "devextreme-react/check-box";
import TextBox, { Button as TextBoxButton } from "devextreme-react/text-box";
import {
  authObject,
  finalObject,
} from "../../../components/common-object/common-object";
import { Button, LoadPanel, Popup } from "devextreme-react";
import {
  HeaderText,
  PopupHeaderText,
} from "../../../components/typographyText/TypograghyText";
import HelperPopupPage from "../../../components/Helper-popup/helper_popup";
import "./user-authorization.scss";
import { useAuth } from "../../../contexts/auth";
import {
  getUserAuthRole,
  getUserData,
  postAuthenticationRule,
} from "../../../api/common";
import { toastDisplayer } from "../../../components/toastDisplayer/toastdisplayer";
import { PreSetRule, helpIcon } from "../../../assets";

const UserAuthorization = ({ setLoading }) => {
  // const [loading, setLoading] = useState(false);
  const [UserData, setUserData] = useState(false);
  const [AuthPopUp, setAuthPopUp] = useState(false);
  const [isModuleTreeVisible, setModuleTreeVisible] = useState(false);
  const [CopyAuthPopUp, CopysetAuthPopUp] = useState(false);
  const [expandedKeys] = useState([]);
  const [selectedKeys] = useState([]);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [selectedRowKeysOnChangeAuth, setSelectedRowKeysOnChangeAuth] =
    useState([]);
  const [selectedCopyRowKeysOnChangeAuth, setSelectedCopyRowKeysOnChangeAuth] =
    useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedCopyRowKeys, setSelectedCopyRowKeys] = useState([]);
  const [userAuthorizationRule, setuserAuthorizationRule] = useState([]);
  const [userCopyData, setUserCopyData] = useState([]);
  const dataGridCopyRefAuthRule = useRef();
  const dataGridRefAuthRule = useRef();
  const updatedStates = {};
  const { user } = useAuth();

  const handleCheckboxValueChanged = (taskId, field, value) => {
    setCheckboxStates((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [field]: value,
      },
    }));
  };

  const userHelpOptions = {
    icon: helpIcon,
    onClick: () => showPopupHandler(),
  };

  const showPopupHandler = () => {
    setAuthPopUp(true);
  };

  const handleCancel = () => {
    setAuthPopUp(false);
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      let result = await getUserData("All", user.cmpid);
      if (result.hasError) {
        setLoading(false);
        return toastDisplayer("error", result.errorMessage);
      }
      setLoading(false);
      const Data = result.responseData?.Data;
      if (user.userrole == "COMPANY") {
        setUserData(Data);
      } else {
        const new_data = Data.filter((user) => user.usertype !== "Admin");
        setUserData(new_data);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (userAuthorizationRule) {
      findTaskIDWithAccess(userAuthorizationRule, authObject);
    } else {
      authObject.forEach((task) => {
        updatedStates[task.Task_ID] = {
          C: false,
        };
      });
      setCheckboxStates(updatedStates);
    }
  }, []);

  function findTaskIDWithAccess(object, data) {
    setCheckboxStates(updatedStates);
    object.forEach((item) => {
      if (item.hasAccess) {
        const task = data.find(
          (taskItem) =>
            taskItem.Task_Subject.toLowerCase() === item.text.toLowerCase()
        );

        if (task) {
          updatedStates[task.Task_ID] = {
            C: true,
          };
        }
      } else {
        const task = data.find(
          (taskItem) =>
            taskItem.Task_Subject.toLowerCase() === item.text.toLowerCase()
        );

        if (task) {
          updatedStates[task.Task_ID] = {
            C: false,
          };
        }
      }
    });

    setCheckboxStates((prevStates) => ({
      ...prevStates,
      ...updatedStates,
    }));
  }

  const handleSave = async () => {
    setSelectedRowKeys(selectedRowKeysOnChangeAuth);
    if (selectedRowKeysOnChangeAuth.length > 0) {
      setLoading(true);
      setAuthPopUp(false);
      copyToPopUpData(selectedRowKeysOnChangeAuth[0].e_mail);
      const getUserAuthRoleRes = await getUserAuthRole(
        selectedRowKeysOnChangeAuth[0].e_mail,
        selectedRowKeysOnChangeAuth[0].usertype,
        user.cmpid
      );
      if (!getUserAuthRoleRes.hasError) {
        setLoading(false);
        const authData = getUserAuthRoleRes.responseData;

        const correctedString = authData.Authentication_Rule.replace(/'/g, '"')
          .replace(/True/g, "true")
          .replace(/False/g, "false");

        const userAuthJSON = JSON.parse(correctedString);
        setuserAuthorizationRule(userAuthJSON);
        findTaskIDWithAccess(userAuthJSON, authObject);
      } else {
        authObject.forEach((task) => {
          updatedStates[task.Task_ID] = {
            C: false,
          };
        });
        setCheckboxStates(updatedStates);
      }
      setModuleTreeVisible(true);
      setLoading(false);
    } else {
      setModuleTreeVisible(false);
      setLoading(false);
      // return toastDisplayer("error", "Please select a user");
    }
  };

  const selectedRowSetterApprove = async (params) => {
    setSelectedRowKeysOnChangeAuth(params);
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

  const handleClick = async () => {
    if (!selectedRowKeysOnChangeAuth.length) {
      return toastDisplayer("error", "Select user");
    }
    try {
      setLoading(true);
      var notificationText = `${selectedRowKeysOnChangeAuth[0].username} now has access to `;
      var notficationModule = [];
      const finalNavigation = finalObject.map((authItem) => {
        const task = authObject.find(
          (taskItem) =>
            taskItem.Task_Subject.toLowerCase() === authItem.text.toLowerCase()
        );

        if (task) {
          if (checkboxStates[task.Task_ID].C) {
            notficationModule.push(task.Task_Subject);
          }
          return {
            ...authItem,
            hasAccess: task ? checkboxStates[task.Task_ID].C : false,
          };
        }
        return authItem;
      });
      notificationText += `${notficationModule[0]}`;
      if (notficationModule.length > 1) {
        for (var i = 1; i < notficationModule.length - 1; i++) {
          notificationText += `, ${notficationModule[i]}`;
        }

        notificationText += ` and ${
          notficationModule[notficationModule.length - 1]
        }`;
      }
      const payload = {
        useremail: selectedRowKeysOnChangeAuth[0].e_mail,
        userrole: selectedRowKeysOnChangeAuth[0].usertype,
        cmptransid: user.cmpid,
        module_classes: finalNavigation,
        sender_email: user.e_mail,
        sender_role: user.userrole,
        company_id: user.cmpid,
        notText: notificationText,
      };
      const apiResponse = await postAuthenticationRule(payload);
      if (apiResponse.hasError) {
        setLoading(false);
        return toastDisplayer("error", apiResponse.errorMessage);
      } else {
        setSelectedRowKeys([]);
        setSelectedRowKeysOnChangeAuth([]);
        setModuleTreeVisible(false);
        setLoading(false);
        return toastDisplayer("success", apiResponse.responseData.StatusMsg);
      }
    } catch (error) {}
  };

  // ================== copy data

  const copyhelpOptions = {
    icon: PreSetRule,
    class: "copyIcon",
    onClick: async () => {
      copyshowPopupHandler();
    },
  };

  const copyshowPopupHandler = () => {
    CopysetAuthPopUp(true);
  };

  const copyToPopUpData = (id) => {
    const new_data = UserData.filter((user) => user.e_mail !== id);
    setUserCopyData(new_data);
  };

  const handleCopyPopupCancel = () => {
    CopysetAuthPopUp(false);
  };

  const handleDataGridCopyRowSelectionAuthRuleUser = async ({
    selectedRowKeys,
  }) => {
    setSelectedCopyRowKeysOnChangeAuth(selectedRowKeys);
  };

  const handleCopySave = async () => {
    const res = [];
    setLoading(true);
    await Promise.all(
      selectedCopyRowKeysOnChangeAuth.map(async (element) => {
        var new_data = UserData.filter((user) => user.e_mail == element);
        const payload = {
          useremail: new_data[0].e_mail,
          userrole: new_data[0].usertype,
          cmptransid: user.cmpid,
          module_classes: userAuthorizationRule,
          sender_email: user.e_mail,
          sender_role: user.userrole,
          company_id: user.cmpid,
        };
        const apiResponse = await postAuthenticationRule(payload);
        res.push(apiResponse);
      })
    );

    if (res.length > 0) {
      if (res.some((item) => item.hasError)) {
        res.forEach((item) => {
          if (item.hasError) {
            setLoading(false);
            toastDisplayer("error", item.errorMessage);
          }
        });
      } else {
        toastDisplayer("success", "The rule has been copied.");
      }
      setLoading(false);
      CopysetAuthPopUp(false);
    } else {
      setLoading(false);
      CopysetAuthPopUp(false);
      return toastDisplayer("error", "Something went wrong");
    }
  };

  return (
    <>
      {/* {loading && <LoadPanel visible={true} />} */}
      {AuthPopUp && (
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
      {CopyAuthPopUp && (
        <Popup
          visible={true}
          height={window.innerHeight - 100}
          showCloseButton={false}
          className="initate-popup-css"
          showTitle={false}
          contentRender={() => (
            <HelperPopupPage
              title={"Apply Same Authorisation Rule to Users"}
              caption={"Apply rules to users"}
              handleCancel={handleCopyPopupCancel}
              handleSave={handleCopySave}
              datagridData={userCopyData}
              keyExpr={"e_mail"}
              handleDataGridRowSelection={
                handleDataGridCopyRowSelectionAuthRuleUser
              }
              dataGridRef={dataGridCopyRefAuthRule}
              selectedRowKeys={selectedCopyRowKeys}
            />
          )}
        ></Popup>
      )}

      <div className="dx-card" style={{ marginTop: "16px" }}>
        <div className="navigation-header-main">
          <div className="title-section">
            <HeaderText text="Authorise the Modules to User" />
          </div>
          <div className="title-section-btn">
            {/* {isModuleTreeVisible && (
              <Button
                text="Save Details"
                width={140}
                height={44}
                className="button-with-margin"
                onClick={handleClick}
              />
            )} */}
            <Button
              text="Save Details"
              width={140}
              height={44}
              // className="button-with-margin"
              onClick={handleClick}
            />
          </div>
        </div>

        <div className="main-content-div">
          <div className="auth-title-section">
            <TextBox
              label="User Name"
              placeholder="Select User"
              labelMode="static"
              stylingMode="outlined"
              width={300}
              height={56}
              className="seachBox"
              value={
                selectedRowKeysOnChangeAuth.length > 0
                  ? selectedRowKeysOnChangeAuth[0].username
                  : ""
              }
            >
              <TextBoxButton
                name="popupSearch"
                location="after"
                options={userHelpOptions}
                className="searchicon"
                style={{ "background-color": "#f6f6f6" }}
              />
            </TextBox>
          </div>
        </div>
        {isModuleTreeVisible && (
          <div className="tree-list-main">
            <TreeList
              dataSource={authObject}
              keyExpr="Task_ID"
              defaultExpandedRowKeys={expandedKeys}
              defaultSelectedRowKeys={selectedKeys}
              showRowLines={true}
              showColumnLines={false}
              columnAutoWidth={true}
            >
              <SearchPanel visible={true} />
              <Column dataField="Task_Subject" caption="Modules" width={300} />
              <Column dataField="Task_ID" visible={false} />
              <Column
                caption="Authorise"
                alignment={"center"}
                cellRender={(cellData) => {
                  return (
                    <>
                      <CheckBox
                        value={checkboxStates[cellData.data.Task_ID]?.C}
                        onValueChanged={(e) => {
                          handleCheckboxValueChanged(
                            cellData.data.Task_ID,
                            "C",
                            e.value
                          );
                        }}
                      />
                    </>
                  );
                }}
              />

              <Toolbar className="header-toolbar-modules">
                <Item location="before">
                  <div className="informer">
                    <PopupHeaderText text={"All Modules"} />
                  </div>
                </Item>
                <Item name="searchPanel" />
                <Item location="after" cssClass="searchPanelIcon">
                  <TextBox
                    placeholder="Pre-set Rule"
                    width={168}
                    className="report-right"
                  >
                    <TextBoxButton
                      name="popupSearch"
                      location="after"
                      options={copyhelpOptions}
                      height={44}
                      className="popup-copy-icon"
                    />
                  </TextBox>
                </Item>
              </Toolbar>
            </TreeList>
          </div>
        )}
      </div>
    </>
  );
};

export default UserAuthorization;
