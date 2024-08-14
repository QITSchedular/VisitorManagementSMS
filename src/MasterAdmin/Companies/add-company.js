import React, { useState } from "react";
import Breadcrumbs from "../../components/breadcrumbs/BreadCrumbs";
import {
  FormText,
  HeaderText,
} from "../../components/typographyText/TypograghyText";
import {
  PatternRule,
  Validator,
  RequiredRule,
} from "devextreme-react/validator";
import { Button, TextBox, SelectBox } from "devextreme-react";
import { useAuth } from "../../contexts/auth";
import { registerUserApi } from "../../api/registorApi";
import { toast } from "react-toastify";
import { toastDisplayer } from "../../components/toastDisplayer/toastdisplayer";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../../components/customerloader/CustomLoader";
const CreateNewCompany = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState({
    // e_mail: "",
    // password: "",
    // bname: "",
    // blocation: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    phone1: "",
    websitelink: "",
    createdby: user.cmpid,
  });
  const handleChange = (name, value) => {
    setCompanyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleClick = async () => {
    const requiredFields = ["e_mail", "password", "bname", "blocation"];
    const hasEmptyField = requiredFields.find((field) => !companyData[field]);
    if (!hasEmptyField) {
      setLoading(true);
      var res = await registerUserApi(companyData);
      setLoading(false);
      if (res.hasError) {
        return toastDisplayer("error", res.error);
      } else {
        toastDisplayer("success", "Company created successfully.");
        navigate("/Company");
      }
    }
  };
  return (
    <>
      {loading && (
        <div className="Myloader">
          <CustomLoader />
        </div>
      )}
      <form onSubmit={handleClick}>
        <div className="content-block">
          <div className="navigation-header-main">
            <div className="title-section">
              <HeaderText text="Create New Company" />
            </div>
            <div className="title-section-btn">
              <Button
                text="Save Details"
                width={140}
                height={44}
                className="button-with-margin"
                // onClick={handleClick}
                useSubmitBehavior={true}
              />
            </div>
          </div>
        </div>

        <Breadcrumbs />
        <div className="profile">
          <div className="content-block dx-card">
            <div className="edit-profile-section">
              <div className="profile-section-header">
                <FormText text="Companies Details" />
              </div>
              <div className="profile-section-editor">
                <TextBox
                  label="Name of the Company"
                  labelMode="static"
                  stylingMode="outlined"
                  className="step-textbox required"
                  height={"56px"}
                  width={"468px"}
                  placeholder="What’s the company name? "
                  onValueChange={(e) => handleChange("bname", e)}
                >
                  <Validator>
                    <RequiredRule message="Company name is required." />
                  </Validator>
                </TextBox>
                <TextBox
                  label="Mobile Number"
                  labelMode="static"
                  stylingMode="outlined"
                  className="step-textbox"
                  height={"56px"}
                  width={"468px"}
                  placeholder="Enter Mobile Number "
                  onValueChange={(e) => handleChange("phone1", e)}
                >
                  <Validator>
                    <PatternRule
                      message="Invalid mobile number"
                      pattern="^\d{10}$"
                    />
                  </Validator>
                </TextBox>
              </div>
              <div className="profile-section-editor">
                <TextBox
                  label="Email Address"
                  labelMode="static"
                  stylingMode="outlined"
                  className="step-textbox required"
                  height={"56px"}
                  width={"468px"}
                  placeholder="Enter Email address"
                  onValueChange={(e) => handleChange("e_mail", e)}
                >
                  <Validator>
                    <RequiredRule message="Email is required." />
                  </Validator>
                </TextBox>
                <TextBox
                  label="Password"
                  labelMode="static"
                  stylingMode="outlined"
                  className="step-textbox required"
                  height={"56px"}
                  width={"468px"}
                  placeholder="Enter Password"
                  onValueChange={(e) => handleChange("password", e)}
                >
                  <Validator>
                    <RequiredRule message="Password is required." />
                  </Validator>
                </TextBox>
              </div>
              <div className="profile-section-editor">
                <TextBox
                  label="Website Link "
                  labelMode="static"
                  stylingMode="outlined"
                  className="step-textbox"
                  height={"56px"}
                  width={"468px"}
                  placeholder="Website Link"
                  onValueChange={(e) => handleChange("websitelink", e)}
                />
              </div>
            </div>
          </div>
          <div className="content-block dx-card">
            <div className="edit-profile-section">
              <div className="profile-section-header">
                <FormText text="Registered Address" />
              </div>
              <div className="profile-section-editor">
                <TextBox
                  label="Company Address"
                  labelMode="static"
                  stylingMode="outlined"
                  className="step-textbox required"
                  height={"56px"}
                  width={"468px"}
                  placeholder="Company Address"
                  onValueChange={(e) => handleChange("blocation", e)}
                >
                  <Validator>
                    <RequiredRule message="Company address is required." />
                  </Validator>
                </TextBox>
                <TextBox
                  label="City"
                  labelMode="static"
                  stylingMode="outlined"
                  className="step-textbox"
                  height={"56px"}
                  width={"468px"}
                  placeholder="Enter City"
                  onValueChange={(e) => handleChange("city", e)}
                />
              </div>
              <div className="profile-section-editor">
                <TextBox
                  label="Pincode"
                  labelMode="static"
                  stylingMode="outlined"
                  className="step-textbox"
                  height={"56px"}
                  width={"468px"}
                  placeholder="Enter Pincode"
                  onValueChange={(e) => handleChange("zipcode", e)}
                />
                <TextBox
                  label="State"
                  labelMode="static"
                  stylingMode="outlined"
                  className="step-textbox"
                  height={"56px"}
                  width={"468px"}
                  placeholder="Enter State"
                  onValueChange={(e) => handleChange("state", e)}
                />
                {/* <SelectBox
                label="State"
                placeholder="Select State"
                labelMode="static"
                stylingMode="outlined"
                height={"56px"}
                width={"468px"}
                onValueChange={(e) => handleChange("phone1", e)}
                ></SelectBox> */}
              </div>
              <div className="profile-section-editor">
                <TextBox
                  label="Country"
                  labelMode="static"
                  stylingMode="outlined"
                  className="step-textbox"
                  height={"56px"}
                  width={"468px"}
                  placeholder="Enter Country"
                  onValueChange={(e) => handleChange("country", e)}
                />
                {/* <SelectBox
                label="Country"
                placeholder="Select Country"
                labelMode="static"
                stylingMode="outlined"
                height={"56px"}
                width={"468px"}
                onValueChange={(e) => handleChange("phone1", e)}
              ></SelectBox> */}
              </div>
            </div>
          </div>
          <div className="content-block dx-card">
            <div className="edit-profile-section">
              <div className="profile-section-header">
                <FormText text="Subscription Details" />
              </div>
              <div className="profile-section-editor">
                <SelectBox
                  label="Plan"
                  placeholder="Select Plan"
                  labelMode="static"
                  stylingMode="outlined"
                  height={"56px"}
                  width={"468px"}
                ></SelectBox>
                <TextBox
                  label="Number of users"
                  labelMode="static"
                  stylingMode="outlined"
                  className="step-textbox"
                  height={"56px"}
                  width={"468px"}
                  placeholder="Number of users"
                />
              </div>
              <div className="profile-section-editor">
                <SelectBox
                  label="Status"
                  placeholder="Select Status"
                  labelMode="static"
                  stylingMode="outlined"
                  height={"56px"}
                  width={"468px"}
                ></SelectBox>
                <SelectBox
                  label="Valid Till"
                  placeholder="Select Date"
                  labelMode="static"
                  stylingMode="outlined"
                  height={"56px"}
                  width={"468px"}
                ></SelectBox>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateNewCompany;
