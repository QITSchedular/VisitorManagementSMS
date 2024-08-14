import { Button, Popup, TextBox } from "devextreme-react";
import React from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../typographyText/TypograghyText";

function ChangeCmpStatus({
  header,
  subHeader,
  btnTxt,
  isVisible,
  closePopUpHandle,
  isActive,
  handleReasonInput,
  handleSubmit,
}) {
  return (
    <>
      <>
        <Popup
          visible={isVisible}
          onHiding={closePopUpHandle}
          width={"25%"}
          height={"auto"}
          showCloseButton={false}
          dragEnabled={false}
          showTitle={false}
        >
          {/* {status === "success" && (
            <div className="verification-popup-main">
              <div className="statusGifHeader">
                <span>Approved Successfully</span>
              </div>

              <div className="statusGif">
                <img src={successGif} height={"75px"} width={"75px"} />
              </div>
            </div>
          )} */}
          <>
            <div className="verification-popup-main">
              <PopupHeaderText text={header} />
              <div className="popup-subtext">
                <PopupSubText text={subHeader} />
              </div>

              <div className="popup-close-btn">
                <Button icon="close" onClick={closePopUpHandle} />
              </div>
            </div>
            <div className="popup-input">
              <div className="form-input">
                <TextBox
                  label="Reason"
                  placeholder="Input"
                  labelMode="static"
                  stylingMode="outlined"
                  onValueChanged={handleReasonInput}
                  height={56}
                />
              </div>
              <div className="form-input">
                {isActive && (
                  <>
                    <TextBox
                      label="No of Days"
                      placeholder="Input"
                      labelMode="static"
                      stylingMode="outlined"
                      //   onValueChanged={handleReasonInput}
                      height={56}
                      style={{ marginTop: "16px" }}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="popup-footer">
              <Button
                text={btnTxt}
                height={44}
                className="full-width-button"
                stylingMode={isActive ? "contained" : "outlined"}
                onClick={handleSubmit}
              />
            </div>
          </>
        </Popup>
      </>
    </>
  );
}

export default ChangeCmpStatus;
