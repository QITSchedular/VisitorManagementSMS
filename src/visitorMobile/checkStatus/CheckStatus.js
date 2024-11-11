import React, { useEffect, useState } from "react";
import "./checkstatus.scss";
import { Button, TextBox } from "devextreme-react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkCompanyByQr, checkUserStatus } from "../../api/common";
import { toastDisplayer } from "../../components/toastDisplayer/toastdisplayer";

const CheckStatus = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [companyId, setCompanyId] = useState();
  const queryParams = new URLSearchParams(location.search);
  // const cmpId = queryParams.get("cmpId");

  // useEffect(() => {
  //   if (cmpId) {
  //     const getCmpData = async () => {
  //       const data = await checkCompanyByQr(cmpId);
  //       const response = data.responseData;
  //       setCompanyId(response.Data[0].transid);
  //     };
  //     getCmpData();
  //   }
  // }, [cmpId]);

  // const cmpId = queryParams.get("cmpId");

  const [cmpId, setcmpId] = useState(
    localStorage.getItem("cmpId") || queryParams.get("cmpId")
  );

  useEffect(() => {
    if (cmpId && cmpId != "null") {
      localStorage.setItem("cmpId", cmpId);
      const getCmpData = async () => {
        const data = await checkCompanyByQr(cmpId);
        const response = data.responseData;
        if (!data.hasError) setCompanyId(response.Data[0].transid);
      };
      getCmpData();
    } else {
      navigate("/welcomevisitor?cmpId=");
    }
  }, [cmpId]);

  const handlePreviousBtn = () => {
    navigate(`/welcomevisitor?cmpId=${cmpId}`);
  };
  const handleChangeInput = (e) => {
    setEmail(e);
  };
  const handleContinue = async () => {
    if (!email) {
      return toastDisplayer("error", `Email address is required.`);
    }
    const company_id = 1;
    const checkStatus = await checkUserStatus(email, companyId);

    if (checkStatus.hasError === true) {
      return toastDisplayer("error", `${checkStatus.error}`);
    }
    if (checkStatus.responseData.status === "O") {
      return toastDisplayer("error", `The ${email} has already checked out.`);
    }
    const status = checkStatus.responseData.status;
    if (status === "I") {
      return toastDisplayer(
        "success",
        `The ${email} has already been checked in.`
      );
    }
    navigate(`/statusPage?status=${status}&cmpId=${cmpId}`);
  };

  return (
    <div className="CheckStatus">
      <div className="backbtn">
        <i
          className="ri-arrow-left-line"
          style={{ fontSize: "20px" }}
          onClick={handlePreviousBtn}
        ></i>
      </div>
      <div className="inner-container ">
        <div className="upper">
          <span>Check Status !</span>
          <span> Fill in the details </span>
        </div>
        <div className="lower">
          <TextBox
            label="Email"
            labelMode="static"
            stylingMode="outlined"
            height={"56px"}
            className="step-textbox"
            onValueChange={handleChangeInput}
          />
        </div>
      </div>
      <div className="status-btn">
        <Button
          text="Check Status"
          height={"44px"}
          width={"100%"}
          onClick={handleContinue}
        />
      </div>
    </div>
  );
};

export default CheckStatus;
