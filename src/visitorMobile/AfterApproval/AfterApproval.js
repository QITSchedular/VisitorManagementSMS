import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import success from "../../assets/images/success.gif";
import "./afterApproval.scss";
import { Button } from "devextreme-react";

const AfterApproval = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  // const cmpId = queryParams.get("cmpId");
  const [cmpId, setcmpId] = useState(
    localStorage.getItem("cmpId") || queryParams.get("cmpId")
  );
  const { state } = location;
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/welcomevisitor?cmpId=${cmpId}`);
    }, 4600);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="AfterApproval">
      <div className="center-conatier">
        <div className="text">
          <span>{state?.Message}</span>
          {/* <span>Sent for Approval</span> */}
        </div>
        <div className="gif">
          <img src={success} alt="success" />
        </div>
        {/* {currentStatus !== "A" && ( */}
        <div className="button">
          <Button
            text="Go back to home page"
            height={"44px"}
            width={"100%"}
            stylingMode="outlined"
            onClick={() => navigate(`/welcomevisitor?cmpId=${cmpId}`)}
          />
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default AfterApproval;
