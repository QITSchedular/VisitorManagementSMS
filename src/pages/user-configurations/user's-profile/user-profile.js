import React, { useEffect, useState } from "react";
import { HeaderText } from "../../../components/typographyText/TypograghyText";
import { Button, LoadPanel, SelectBox } from "devextreme-react";
import DataGrid, {
  Column,
  Paging,
  Pager,
  Editing,
} from "devextreme-react/data-grid";
import "./user-profile.scss";
import { useAuth } from "./../../../contexts/auth";
import { toastDisplayer } from "../../../components/toastDisplayer/toastdisplayer";
import { EditUser, GetAllUser, GetCmpDept } from "../../../api/userAPI";
import CustomLoader from "../../../components/customerloader/CustomLoader";

const getStatusColor = (status) => {
  const statusColors = {
    Changed: "#124d22",
    Pending: "#934908",
  };

  return statusColors[status];
};

const UserProfile = ({ setLoading }) => {
  // const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);
  const [dataToUpdate, setDataToUpdate] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const { user } = useAuth();

  const getAllUserData = async () => {
    setLoading(true);
    const response = await GetAllUser(user.cmpid);
    if (response.hasError === true) {
      setLoading(false);
      return toastDisplayer("error", response.errorMessage);
    } else {
      setUserData(response.responseData?.Data);
      setLoading(false);
      // return toastDisplayer("suceess", "OTP send successfully");
    }
  };

  const loadDeptData = async () => {
    setLoading(true);
    const response = await GetCmpDept(user.cmpid);
    if (response.hasError === true) {
      setLoading(false);
      // return toastDisplayer("error", getOtpFromID.errorMessage);
      return toastDisplayer("error", response.errorMessage);
    } else {
      setDeptData(response.responseData.Data);
      setLoading(false);
      // return toastDisplayer("suceess", "OTP send successfully");
    }
  };

  useEffect(() => {
    getAllUserData();
    loadDeptData();
  }, []);

  const allowEditingPassword = (rowData) => {
    return rowData.changepassstatus !== "Changed";
  };

  const handleRowUpdated = async (e) => {
    var newData = e.data;
    newData["company_id"] = user.cmpid;
    if (!newData["password"]) {
      newData["password"] = "";
    }
    setDataToUpdate((prevData) => {
      const dataExists = prevData.find(
        (item) => item.transid === newData.transid
      );
      if (dataExists) {
        return prevData.map((item) =>
          item.transid === newData.transid ? { ...item, ...newData } : item
        );
      } else {
        return [...prevData, newData];
      }
    });
  };

  const handleClick = async () => {
    if (!dataToUpdate.length) {
      return toastDisplayer("error", "Nothing to update");
    }
    setLoading(true);
    const promises = dataToUpdate.map((e) => {
      const reqBody = {
        ...e,
        sender_email: user.e_mail,
        sender_role: user.userrole,
        company_id: user.cmpid,
      };
      return EditUser(reqBody);
    });
    const apiRes = await Promise.all(promises);

    var flag = 1;

    setLoading(false);
    apiRes.forEach((data, index) => {
      if (data.hasError) {
        toastDisplayer(
          "error",
          "Error while updating user : " + dataToUpdate[index].e_mail
        );
      } else {
        flag = 1;
      }
    });
    setDataToUpdate([]);
    getAllUserData();

    if (flag) {
      return toastDisplayer("success", "User data updated");
    }
  };

  const departmentRender = (data) => {
    const onValueChanged = (e) => {
      var selectedValue = deptData.filter((item) => item.transid == e.value);
      data.data.cmpdeptid = e.value;
      data.setValue(selectedValue[0].deptname);
    };
    return (
      <>
        <SelectBox
          // label="Select User Type"
          placeholder="Input"
          labelMode="static"
          stylingMode="outlined"
          items={deptData}
          displayExpr={"deptname"}
          valueExpr={"transid"}
          value={data?.data.cmpdeptid}
          onValueChanged={onValueChanged}
        ></SelectBox>
      </>
    );
  };

  const genderRender = (data) => {
    const Genders = ["Male", "Female"];
    const onValueChanged = (e) => {
      data.setValue(e.value);
    };
    return (
      <>
        <SelectBox
          // label="Select User Type"
          placeholder="Input"
          labelMode="static"
          stylingMode="outlined"
          items={Genders}
          value={data?.data.gender}
          onValueChanged={onValueChanged}
        ></SelectBox>
      </>
    );
  };

  const onEditingStart = (e) => {
    if (e.data.changepassstatus == "Pending") {
      setAllowEdit(true);
    } else {
      setAllowEdit(false);
    }
  };

  return (
    <>
      <div className="dx-card" style={{ marginTop: "16px" }}>
        <div className="navigation-header-main">
          <div className="title-section">
            <HeaderText text="User’s Profile" />
          </div>
          <div className="title-section-btn">
            <Button
              text="Save Details"
              width={140}
              height={44}
              // className="button-with-margin"
              onClick={handleClick}
            />
          </div>
        </div>

        {userData && (
          <>
            <DataGrid
              dataSource={userData}
              showBorders={false}
              selection={{
                mode: "multiple",
              }}
              className="data-grid on-hover-data"
              hoverStateEnabled={true}
              columnAutoWidth={true}
              onRowUpdated={handleRowUpdated}
              onEditingStart={onEditingStart}
            >
              <Paging defaultPageSize={10} />
              <Pager
                visible={true}
                displayMode="compact"
                showNavigationButtons={true}
              />
              <Editing
                allowDeleting={true}
                allowUpdating={true}
                useIcons={true}
              />
              <Column dataField="transid" visible={false} />
              <Column
                dataField="username"
                label={"User Name"}
                allowEditing={false}
              />
              <Column type="buttons">
                <Button name="edit" />
                <Button name="delete" />
              </Column>
              <Column
                caption="Password"
                dataField="password"
                allowEditing={true}
                // allowEditing={1 ? false : true}
                // editorOptions={{
                //   mode: "password",
                // }}
              />
              <Column
                dataField="deptName"
                caption="Department"
                allowEditing={true}
                editCellRender={departmentRender}
              ></Column>
              <Column
                dataField="gender"
                editCellRender={genderRender}
                caption="gender"
                allowEditing={true}
              />
              <Column
                dataField="e_mail"
                caption="EMAIL ID"
                allowEditing={false}
              />
              <Column
                dataField="phone"
                caption="Phone number"
                allowEditing={true}
              />
              <Column
                allowEditing={false}
                caption="change password"
                dataField="changepassstatus"
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
            </DataGrid>
          </>
        )}
      </div>
    </>
  );
};

export default UserProfile;
