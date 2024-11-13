import React, { useEffect, useRef, useState } from "react";
import { HeaderText } from "../typographyText/TypograghyText";
import { Button, DataGrid, LoadPanel } from "devextreme-react";
import {
  Column,
  Editing,
  Pager,
  Paging,
  RequiredRule,
} from "devextreme-react/cjs/data-grid";
import { GettingLocationdata, saveLocation } from "../../api/locationAPI";
import { toastDisplayer } from "../toastDisplayer/toastdisplayer";

function LocationGrid({ user }) {
  const gridAVLRef = useRef(null);
  const [locationData, setLocationData] = useState([]);

  const handleAddVLPopup = async () => {
    if (gridAVLRef.current && gridAVLRef.current.instance) {
      const gridInstance = gridAVLRef.current.instance;
      try {
        gridInstance.addRow();
      } catch (error) {
        // console.error("Error adding row:", error);
      }
    } 
  };

  const getLocData = async () => {
    // setLoading(true);
    var apiRes = await GettingLocationdata(user.cmpid);
    // setLoading(false);
    if (!apiRes.hasError) {
      console.log(apiRes?.repsonseData?.Data);
      setLocationData(apiRes?.repsonseData?.Data);
    } else {
      return toastDisplayer("error", apiRes.errorMessage);
    }
  };

  useEffect(() => {
    getLocData();
  }, []);

  const handleAddLocation = async (e) => {
    var newName = e.data.locationname;
    if (newName) {
      if (!newName.trim()) {
        e.cancel = true;
        return toastDisplayer("error", "Location name is required.");
      } else {
        const reqBody = {
          loc_name: newName,
          company_id: user.cmpid,
          sender_email: user.e_mail,
          sender_role: user.userrole,
        };
        var apiRes = await saveLocation(reqBody);
        if (apiRes.hasError) {
          toastDisplayer("error", apiRes.errorMessage);
          await getLocData();
        } else {
          toastDisplayer("success", "A new Location has been added.");
        //   if (fromURL) {
        //     state.data.cmpLocid = apiRes.responsedata.LocId;
        //     navigate(fromURL, {
        //       state: {
        //         LocId: apiRes.responsedata.LocId,
        //         fromURL: "generalSetting",
        //         data: state.data,
        //       },
        //     });
        //   }
          await getLocData();
        }
      }
    } else {
      e.cancel = true;
      return toastDisplayer("error", "Location name is required.");
    }
  };

  return (
    <>
      <div className="content-block dx-card">
        <div className="navigation-header-main">
          <div className="title-section">
            <HeaderText text="Add Visitng Location" />
          </div>
          <div className="title-section-btn">
            <Button
              style={{ color: "#6941c6" }}
              text="Add Visiting Branch"
              height={44}
              onClick={handleAddVLPopup}
              useSubmitBehavior={true}
              stylingMode="text"
            />
          </div>
        </div>
        <div style={{ marginTop: "24px" }}>
          <DataGrid
            id="gridContainer"
            dataSource={locationData}
            keyExpr="transid"
            allowColumnReordering={true}
            showBorders={true}
            ref={gridAVLRef}
            //   onRowUpdated={handleUpdateLocation}
            //   onRowRemoved={handleRemoveLocation}
              onRowInserted={handleAddLocation}
          >
            <LoadPanel visible={false} />
            <Paging defaultPageSize={5} />
            <Pager
              visible={true}
              displayMode="compact"
              showNavigationButtons={true}
            />
            <Editing mode="row" allowUpdating={true} allowDeleting={true} />
            <Column caption="Location Name" dataField="locationname">
              {/* <ValidationRule
                  type="required"
                  message="Category name is required"
                /> */}
              <RequiredRule message="Required" />
            </Column>
          </DataGrid>
        </div>
      </div>
    </>
  );
}

export default LocationGrid;
