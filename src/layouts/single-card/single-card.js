import React from "react";
import ScrollView from "devextreme-react/scroll-view";
import "./single-card.scss";

export default function SingleCard({ title, description, children }) {
  return (
    <ScrollView
      height={"100vh"}
      width={"100%"}
      className={"with-footer single-card"}
    >
      <div
      // className={"dx-card content"}
      // style={{ width: "100vw", padding: "0", height: "100vh" }}
      >
        {children}
      </div>
    </ScrollView>
  );
}
