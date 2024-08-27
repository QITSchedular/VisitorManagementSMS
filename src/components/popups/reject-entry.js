import { Button, Popup, TextBox } from "devextreme-react";
import React, { useState } from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../typographyText/TypograghyText";
import { visitorDecision } from "../../api/visitorApi";
import { toastDisplayer } from "../toastDisplayer/toastdisplayer";
import { useNavigate } from "react-router-dom";
import rejectGif from "../../assets/images/Rejection.gif";
import CustomLoader from "../customerloader/CustomLoader";

const RejectEntryPopup = ({
  header,
  rejectEntry,
  isVisible,
  onHide,
  subHeader,
  verifyData,
  setVerifyData,
  getAllVisitor,
  refresh,
  onToggleExpand,
  index,
}) => {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleAllowVisitor = async () => {
    if (verifyData.reason === "" || verifyData.reason === null) {
      return toastDisplayer(
        "error",
        "Please provide a reason for rejecting the visitor request."
      );
    }

    setIsLoading(true);

    const decision = await visitorDecision(verifyData);

    if (decision.hasError === true) {
      setIsLoading(false);
      return toastDisplayer("error", `${decision.error}`);
    }

    setStatus("rejected");
    setIsLoading(false);
    setTimeout(() => {
      setStatus(null);
      onHide();
      toastDisplayer(
        "success",
        `${verifyData.visitor_name} is rejected successfully.`
      );
      if (refresh === true) {
        getAllVisitor();
        onToggleExpand(index);
      }
      if (refresh === false) {
        return navigate("/Verify-Visitors");
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
      {isLoading && (
        <div className="Myloader">
          <CustomLoader />
        </div>
      )}
      <Popup
        visible={isVisible}
        onHiding={onHide}
        width={355}
        height={"auto"}
        showCloseButton={false}
        dragEnabled={false}
        showTitle={false}
      >
        {status === "rejected" && (
          <div className="verification-popup-main">
            <div className="statusGifHeader">
              <span>Rejected Successfully</span>
            </div>

            <div className="statusGif">
              <img src={rejectGif} height={"75px"} width={"75px"} />
            </div>
          </div>
        )}

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
                  className="required"
                />
              </div>
            </div>
            <div className="popup-footer">
              <Button
                text={rejectEntry}
                height={44}
                onClick={handleAllowVisitor}
                className="full-width-button"
                stylingMode="outlined"
              />
            </div>
          </>
        )}
      </Popup>
    </>
  );
};

export default RejectEntryPopup;
