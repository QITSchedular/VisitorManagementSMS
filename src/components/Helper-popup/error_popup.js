import React, { useEffect, useState } from "react";
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  SearchPanel,
  Selection,
  Pager,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react";
import "./popup.scss";
import {
  PopupHeaderText,
  PopupSubText,
} from "../typographyText/TypograghyText";
function ErrorPopup({
  handleCancel,
  datagridData,
  keyExpr,
  dataGridRef,
  title,
  caption,
}) {
  const [dataSource, setDataSource] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
    const dataGridDataHandler = async () => {
      setDataSource(datagridData);
    };
    dataGridDataHandler();
  }, [datagridData]);
  return (
    <>
      <div className="popup-main-cointainer search-panel-width">
        <div className="verification-popup-main">
          <PopupHeaderText text={title} />
          <div className="popup-subtext">
            <PopupSubText text={caption} />
          </div>

          <div className="popup-close-btn">
            <Button icon="close" onClick={handleCancel} />
          </div>
        </div>
        {loading ? (
          // <Triangleloader />
          ""
        ) : (
          <div className="verify-pro-datagrid">
            <DataGrid
              dataSource={dataSource}
              keyExpr={keyExpr}
              showBorders={false}
              columnAutoWidth={true}
              hoverStateEnabled={true}
              ref={dataGridRef}
            >
              <SearchPanel visible={true} className={"search-panel"} />
              {/* <Selection mode="multiple" allowSelectAll={false} /> */}
              <Scrolling columnRenderingMode="virtual" />
              <Paging defaultPageSize={8} />
              <Pager
                visible={true}
                displayMode="compact"
                showNavigationButtons={true}
              />
              <Column dataField="Code" alignment="left" />
              <Column dataField="Message" />
            </DataGrid>
          </div>
        )}
        {/* <div className="popup-btn-section">
          <Button
            text="Cancel"
            width={144}
            height={44}
            onClick={handleCancel}
            stylingMode="outlined"
          />
        </div> */}
      </div>
    </>
  );
}

export default ErrorPopup;
