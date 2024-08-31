import { Button, Popup, TextBox } from "devextreme-react";
import React, { useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../typographyText/TypograghyText";
import { visitorDecision } from "../../api/visitorApi";
import { toastDisplayer } from "../toastDisplayer/toastdisplayer";
import successGif from "../../assets/images/success.gif";
import CustomLoader from "../customerloader/CustomLoader";

const AllowEntryPopup = ({
  header,
  allowEntry,
  isVisible,
  onHide,
  subHeader,
  dessionStatus,
  verifyData,
  setVerifyData,
  getAllVisitor,
  refresh,
  onToggleExpand,
  index,
}) => {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAllowVisitor = async () => {
    setIsLoading(true);
    const decision = await visitorDecision(verifyData);

    if (decision.hasError === true) {
      setIsLoading(false);
      return toastDisplayer("error", `${decision.error}`);
    }
    setStatus("success");
    setIsLoading(false);
    return setTimeout(() => {
      setStatus(null);
      onHide();
      toastDisplayer(
        "success",
        `${verifyData.visitor_name} can enter into the premises to meet ${verifyData.cnctperson}.`
      );
      if (refresh === true) {
        getAllVisitor();
        onToggleExpand(index);
      }
      setIsLoading(false);
    }, 2400);
  };

  const handleReasonInput = (e) => {
    setVerifyData((prev) => ({
      ...prev,
      reason: e.value, // Access the input value from the event
    }));
  };

  return (
    <>
      <Popup
        visible={isVisible}
        onHiding={onHide}
        width={355}
        height={"auto"}
        showCloseButton={false}
        dragEnabled={false}
        showTitle={false}
      >
        {isLoading && (
          <div className="Myloader">
            <CustomLoader />
          </div>
        )}
        {status === "success" && (
          <div className="verification-popup-main">
            <div className="statusGifHeader">
              <span>Approved Successfully</span>
            </div>

            <div className="statusGif">
              <img src={successGif} height={"75px"} width={"75px"} />
            </div>
          </div>
        )}
        {/* <div className="verification-popup-main">
          <div className="statusGifHeader">
            <span>Approved Successfully</span>
          </div>

          <div className="statusGif">
            <img src={successGif} height={"75px"} width={"75px"} />
          </div>
        </div> */}

        {status === null && (
          <>
            <div className="verification-popup-main">
              <PopupHeaderText text={header} />
              <div className="popup-subtext">
                <PopupSubText text={subHeader} />
              </div>

              <div className="popup-close-btn">
                <Button icon="close" onClick={onHide} />
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
            </div>
            <div className="popup-footer">
              <Button
                text={allowEntry}
                height={44}
                onClick={handleAllowVisitor}
                className="full-width-button"
              />
            </div>
          </>
        )}
      </Popup>
    </>
  );
};

export default AllowEntryPopup;
