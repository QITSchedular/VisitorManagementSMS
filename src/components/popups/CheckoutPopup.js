import { Button, Popup } from "devextreme-react";
import React from "react";
import {
  PopupHeaderText,
  PopupSubText,
} from "../typographyText/TypograghyText";
import successGif from "../../assets/images/success.gif";

const CheckoutPopup = ({
  header,
  subHeader,
  approval,
  discard,
  saveFunction,
  isVisible,
  onHide,
  status,
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
        {status === "success" && (
          <div className="verification-popup-main">
            <div className="statusGifHeader">
              <span>Sent Successfully</span>
            </div>

            <div className="statusGif">
              <img src={successGif} height={"75px"} width={"75px"} />
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
                onClick={handleSubmit}
                // disabled={isDisabled}
              />
            </div>
          </>
        )}
      </Popup>
    </>
  );
};

export default CheckoutPopup;
