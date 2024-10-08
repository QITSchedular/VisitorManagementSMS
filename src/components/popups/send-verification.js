import { Button, Popup } from "devextreme-react";
import React from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../typographyText/TypograghyText";
import "./send-verification.scss";
import successGif from "../../assets/images/success.gif";
import CustomLoader from "../customerloader/CustomLoader";

const SendVerification = ({
  header,
  subHeader,
  approval,
  discard,
  saveFunction,
  isVisible,
  onHide,
  statusMessage,
  loading,
}) => {
  const handleSubmit = () => {
    saveFunction();
  };

  return (
    <>
      <Popup
        visible={isVisible}
        onHiding={onHide}
        width={375}
        height={"auto"}
        showCloseButton={false}
        dragEnabled={false}
        showTitle={false}
        className="responsive-popup"
      >
        {loading && (
          <div className="Myloader">
            <CustomLoader />
          </div>
        )}
        {statusMessage === "success" && (
          <div className="verification-popup-main">
            <div className="statusGifHeader">
              <span>Sent Successfully</span>
            </div>

            <div className="statusGif">
              <img src={successGif} height={"75px"} width={"75px"} />
            </div>
          </div>
        )}
        {statusMessage == null && (
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

            <div className="verification-footer">
              <Button
                text={discard}
                width={216}
                height={44}
                onClick={onHide}
                stylingMode="outlined"
              />
              <Button
                text={approval}
                width={216}
                height={44}
                onClick={saveFunction}
                // disabled={isDisabled}
              />
            </div>
          </>
        )}
      </Popup>
    </>
  );
};

export default SendVerification;
