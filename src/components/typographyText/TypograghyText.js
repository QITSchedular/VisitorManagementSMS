import React from "react";
import "./styles.scss";

export const HeaderText = ({ text }) => {
  return <div className="typ-header-text">{text}</div>;
};

export const SubText = ({ text }) => {
  return <div className="typ-sub-text">{text}</div>;
};
export const FormText = ({ text }) => {
  return <div className="form-text">{text}</div>;
};

export const PopupHeaderText = ({ text }) => {
  return <div className="popup-header-text">{text}</div>;
};
export const PopupSubText = ({ text }) => {
  return <div className="popup-sub-text">{text}</div>;
};
