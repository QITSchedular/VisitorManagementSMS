import React, { useEffect, useRef, useState } from "react";
import "./profile.scss";
import HeaderTab from "../../components/HeaderTab/HeaderTab";
import { LoadPanel, TextBox, SelectBox } from "devextreme-react";
import {
  GetCmpDept,
  GetCmpDetail,
  GetUserDetail,
  requestAddressFromPin,
  UpdateCmpData,
  UpdateUserData,
} from "../../api/userAPI";
import { useAuth } from "../../contexts/auth";
import { toastDisplayer } from "../../components/toastDisplayer/toastdisplayer";
import qrcode from "qrcode";
import { Button } from "devextreme-react/button";
import CustomLoader from "../../components/customerloader/CustomLoader";
import {
  PatternRule,
  RequiredRule,
  Validator,
} from "devextreme-react/validator";
import { forgetPasswordChk, forgetPasswordRequestLink } from "../../api/common";
import { useNavigate } from "react-router-dom";
import { FormText } from "../../components/typographyText/TypograghyText";
import AddAPhotoOutlinedIcon from "@mui/icons-material/Print";
import qitlogo from "../../assets/images/QIT_LOGO.png";
import {
  GetSuperAdminDetail,
  UpdateSuperAdminData,
} from "../../api/masterAdmin";
export default function Profile() {
  const { user, authRuleContext, signOut, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState(false);
  const [activePage, setActivePage] = useState();
  const activePageText = "Profile";
  const [isProfExpand, setIsProfExpand] = useState(false);
  const [isCmpExpand, setIsCmpExpand] = useState(false);
  const [isValidLogo, setIsValidLogo] = useState(false);
  const [formData, setFormData] = useState(null);
  const [userFormData, setUserFormData] = useState(null);
  const [isCmp, setIsCmp] = useState(
    user.userrole == "COMPANY" ? true : user.userrole == "MA" ? true : false
  );
  const Genders = ["Male", "Female"];
  const [deptData, setDeptData] = useState([]);
  const [HeaderTabText, setHeaderTabtext] = useState([
    "Notification",
    "Profile",
  ]);
  useEffect(() => {
    if (authRuleContext) {
      const chkGeneralSetting = authRuleContext.filter(
        (item) => item.text == "General Settings"
      );
      if (chkGeneralSetting.length > 0) {
        setHeaderTabtext((prevData) => {
          const isDuplicate = prevData.some(
            (item) => item === "General Settings"
          );
          if (!isDuplicate) {
            return [...prevData, "General Settings"];
          }
          return prevData;
        });
      }
      const chkConfiguration = authRuleContext.filter(
        (item) => item.text == "Configuration"
      );
      if (chkConfiguration.length > 0) {
        setHeaderTabtext((prevData) => {
          const isDuplicate = prevData.some((item) => item === "Configuration");
          if (!isDuplicate) {
            return [...prevData, "Configuration"];
          }
          return prevData;
        });
      }
    }
  }, [authRuleContext]);
  const loadDeptData = async () => {
    setLoading(true);
    const response = await GetCmpDept(user.cmpid);
    if (response.hasError === true) {
      setLoading(false);
      // return toastDisplayer("error", getOtpFromID.errorMessage);
      return toastDisplayer("error", response.errorMessage);
    } else {
      setDeptData(response.responseData?.Data);
      setLoading(false);
      return toastDisplayer("suceess", "OTP send successfully");
    }
  };

  const getProfileData = async () => {
    setLoading(true);
    if (user.userrole == "MA") {
      const response = await GetSuperAdminDetail(1);
      if (response.hasError === true) {
        setLoading(false);
        return toastDisplayer("error", response.errorMessage);
      } else {
        setLoading(false);
        setCompanyData(response.responseData?.Data);

        var dataRes = response.responseData?.Data;
        setFormData(response.responseData?.Data);
      }
    } else {
      const response = await GetCmpDetail(user.cmpid);
      if (response.hasError === true) {
        setLoading(false);
        return toastDisplayer("error", response.errorMessage);
      } else {
        setCompanyData(response.responseData?.Data);

        var dataRes = response.responseData?.Data;
        setFormData(response.responseData?.Data);

        if (canvasRef.current) {
          qrcode.toCanvas(
            canvasRef.current,
            process.env.REACT_APP_URL +
            "#/welcomevisitor/?cmpId=" +
            dataRes.qrstring,
            (error) => {
              if (error) {
                console.error("Error while genratting  QR code:", error);
              }
            }
          );
          setLoading(false);
        }
        setLoading(false);
        // return toastDisplayer("suceess", "OTP send successfully");
      }
    }
  };

  // GetSuperAdminDetail

  const getUserProfileData = async () => {
    setLoading(true);
    const response = await GetUserDetail(user.cmpid, user.transid);
    if (response.hasError === true) {
      setLoading(false);
      return toastDisplayer("error", response.errorMessage);
    } else {
      // setCompanyData(response.responseData);

      // var dataRes = response.responseData;
      setUserFormData(response.responseData?.Data);
      setLoading(false);
    }
    // return toastDisplayer("suceess", "OTP send successfully");
  };

  const canvasRef = useRef(null);

  useEffect(() => {
    getProfileData();
    if (user.userrole != "MA") {
      loadDeptData();
    }
    if (user.userrole == "USER" || user.userrole == "ADMIN") {
      getUserProfileData();
    }
  }, []);

  const handleProfExpand = () => {
    setIsProfExpand(!isProfExpand);
  };
  const handleCmpExpand = () => {
    setIsCmpExpand(!isCmpExpand);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const [uploadedFileName, setUploadedFileName] = useState("");
  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      // setUploadedFileName(file.name);
      // const base64 = await convertToBase64(file);
      // setFormData((prevState) => ({
      //   ...prevState,
      //   ["cmplogo"]: base64,
      // }));
      // Create an image element to load the file and check dimensions
      const img = new Image();
      const reader = new FileReader();

      // Read the file as a Data URL
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        img.src = event.target.result;

        img.onload = () => {
          const width = img.width;
          const height = img.height;

          if (width <= 500 && height <= 500 && width >= 150 && height >= 60) {
            setIsValidLogo(false);
            convertToBase64(file).then((base64) => {
              setUploadedFileName(file.name);
              setFormData((prevState) => ({
                ...prevState,
                ["cmplogo"]: base64,
              }));
            });
          } else {
            setIsValidLogo(true);
            return toastDisplayer(
              "error",
              "The company logo dimensions must between 500 x 500 pixels."
            );
          }
        };
      };
    } catch (error) {
      console.log("error : ", error);
      // return toastDisplayer(
      //   "error",
      //   error
      // );
    }
  };

  const handleInputChange = (fieldName, e) => {
    if (fieldName == "gender") {
      setUserFormData((prevState) => ({
        ...prevState,
        [fieldName]: e.selectedItem,
      }));
      setFormData((prevState) => ({
        ...prevState,
        [fieldName]: e.selectedItem,
      }));
      return;
    }
    setUserFormData((prevState) => ({
      ...prevState,
      [fieldName]: e,
    }));
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: e,
    }));
  };

  const handleSaveData = async () => {
    if (user.userrole == "COMPANY") {
      formData.sender_email = user.e_mail;
      formData.sender_role = user.userrole;
      formData.company_id = user.cmpid;
      setFormData(companyData);
      setLoading(true);
      const response = await UpdateCmpData(formData);
      if (response.hasError === true) {
        setLoading(false);
        return toastDisplayer("error", response.errorMessage);
      } else {
        setUser((prevState) => ({
          ...prevState,
          ["cmpLogo"]: formData.cmplogo,
        }));
        getProfileData();
        setLoading(false);
        return toastDisplayer("success", "Profile data has been updated.");
      }
    } else if (user.userrole == "MA") {
      // formData.sender_email = user.e_mail;
      // formData.sender_role = user.userrole;
      // formData.company_id = user.cmpid;
      // setFormData(companyData);
      setLoading(true);
      const response = await UpdateSuperAdminData(formData);
      if (response.hasError === true) {
        setLoading(false);
        return toastDisplayer("error", response.errorMessage);
      } else {
        setUser((prevState) => ({
          ...prevState,
          ["cmpLogo"]: formData.cmplogo,
        }));
        getProfileData();
        setLoading(false);
        return toastDisplayer("success", "Profile data has been updated.");
      }
    } else {
      setLoading(true);
      // userFormData["company_id"] = user.cmpid;
      const reqPayload = {
        transid: userFormData.transid,
        username: userFormData.username,
        phone: userFormData.phone,
        department_id: userFormData.cmpdeptid,
        gender: userFormData.gender,
        company_id: user.cmpid,
        sender_email: user.e_mail,
        sender_role: user.userrole,
      };
      const response = await UpdateUserData(reqPayload);
      if (response.hasError === true) {
        setLoading(false);
        return toastDisplayer("error", response.errorMessage);
      } else {
        getUserProfileData();
        setLoading(false);
        return toastDisplayer("success", "Profile data has been updated.");
      }
    }
  };

  const handleCancelEdit = () => {
    getProfileData();
    // setFormData(companyData);
  };

  const navigate = useNavigate();

  const resetPWDClick = async () => {
    if (user.userrole == "COMPANY") {
      signOut();
      navigate("/reset-password", { state: { Email: user.e_mail } });
    }
    if (user.userrole == "MA") {
      signOut();
      navigate("/reset-password", { state: { Email: user.e_mail } });
    }

    if (user.userrole == "ADMIN" || user.userrole == "USER") {
      var res = await forgetPasswordRequestLink(
        user.e_mail,
        userFormData?.username
      );
      if (res.hasError) {
        return toastDisplayer("error", res.errorMessage);
      } else {
        return toastDisplayer(
          "success",
          "Request link send successfully for forget password"
        );
      }
    }
  };

  const handleDownload = () => {
    // const canvas = canvasRef.current;
    // const imageUrl = canvas.toDataURL("image/png");
    // const link = document.createElement("a");
    // link.href = imageUrl;
    // // link.download = "qrcode.png";
    // // link.click();
    // const printWindow = window.open("", "", "width=800,height=600");
    // printWindow.document.open();
    // printWindow.document.write(link);
    // printWindow.document.close();

    // setTimeout(() => {
    //   printWindow.print();
    //   printWindow.close();
    // }, 1000);
    const canvas = canvasRef.current;
    const imageUrl = canvas.toDataURL("image/png");

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.open();

    printWindow.document.write(`
    <html>
      <head>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            display:flex;
            align-items: center;
            justify-content: center;
          }
          img {
            display: block;
            width: 80%;
            height: 80%;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <img src="${imageUrl}" />
      </body>
    </html>
  `);

    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
  };

  const handleGetAddress = async (pinCode) => {
    setLoading(true);
    if (pinCode.length === 6) {
      const getAddress = await requestAddressFromPin(pinCode);
      console.log(getAddress);
      const add = getAddress[0].PostOffice[0];
      handleInputChange("country", add.Country);
      handleInputChange("state", add.State);
      handleInputChange("city", add.District);
    }
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <div className="Myloader">
          <CustomLoader />
        </div>
      )}

      <HeaderTab
        HeaderTabText={HeaderTabText}
        HeaderText={activePage}
        setActivePage={setActivePage}
        activePageText={activePageText}
      />
      <div className="profile">
        <div className="content-block dx-card">
          <div className="upper-section">
            {user.userrole == "MA" ? (
              <div className={"form-avatar"}>
                <img
                  alt={"Profile"}
                  src={formData?.cmplogo == null ? qitlogo : formData?.cmplogo}
                />
              </div>
            ) : (
              <div className={"form-avatar"}>
                {/* <img alt={"Profile"} src={"ProfileQr"} /> */}
                <canvas ref={canvasRef}></canvas>
                <div className="download-overlay" onClick={handleDownload}>
                  <span className="download-text">
                    <AddAPhotoOutlinedIcon />
                  </span>
                </div>
              </div>
            )}
            <div className="profileHeader">
              <div className="about-profile">
                {user.userrole == "COMPANY" ? (
                  <>
                    <span className="portal-name">Company Portal</span>

                    <div className="name-address">
                      <span className="bname">{companyData.bname}</span>
                      {companyData.blocation != null &&
                        companyData.blocation != "" ? (
                        <>
                          <span>|</span>
                          <span className="cityTxt">
                            {companyData.blocation}
                            {/* {companyData.state != null ? (
                              <>,{companyData.state}</>
                            ) : (
                              <></>
                            )} */}
                          </span>
                        </>
                      ) : (
                        <>
                          {companyData.state != null ? (
                            <>
                              <span>|</span>
                              <span className="cityTxt">
                                {companyData.state}
                              </span>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </div>
                  </>
                ) : user.userrole == "MA" ? (
                  <>
                    <span className="portal-name">Super Admin Portal</span>
                    <div className="name-address">
                      <span className="bname">{userFormData?.bname}</span>

                      <span>|</span>
                      <span className="cityTxt">{userFormData?.blocation}</span>
                    </div>
                  </>
                ) : (
                  <>
                    {user.userrole == "ADMIN" ? (
                      <>
                        <span className="portal-name">Manager Portal</span>
                      </>
                    ) : (
                      <>
                        <span className="portal-name">Employee Portal</span>
                      </>
                    )}
                    <div className="name-address">
                      <span className="bname">{userFormData?.username}</span>

                      <span>|</span>
                      <span className="cityTxt">
                        {
                          deptData?.find(
                            (e) => e.transid == userFormData?.cmpdeptid
                          )?.deptname
                        }
                      </span>
                    </div>
                  </>
                )}
                <Button
                  className="forget-pass"
                  stylingMode="text"
                  onClick={resetPWDClick}
                  style={{ cursor: "pointer" }}
                >
                  Reset Password
                </Button>
              </div>
              <div className="save-btn-section">
                <Button
                  text={"Cancel"}
                  height={44}
                  stylingMode="outlined"
                  width={100}
                  onClick={handleCancelEdit}
                />
                <Button
                  text={"Save"}
                  height={44}
                  width={100}
                  onClick={handleSaveData}
                />
              </div>
            </div>
          </div>
        </div>
        {user.userrole == "COMPANY" ? (
          <></>
        ) : user.userrole == "USER" ? (
          <>
            <div className="content-block dx-card">
              <div className="edit-profile-section">
                <div className="profile-section-header">
                  <span>Your profile</span>
                  {/* {isProfExpand ? (
                    <Button icon="chevronup" onClick={handleProfExpand} />
                  ) : (
                    <Button icon="chevrondown" onClick={handleProfExpand} />
                  )} */}
                </div>
                <>
                  <form>
                    <div className="profile-section-editor">
                      <TextBox
                        label="User Name"
                        labelMode="static"
                        stylingMode="outlined"
                        className="step-textbox"
                        height={"56px"}
                        width={"304px"}
                        value={userFormData?.username}
                        onValueChanged={(e) =>
                          handleInputChange("username", e.value)
                        }
                      />
                      <TextBox
                        label="Email Address"
                        labelMode="static"
                        stylingMode="outlined"
                        className="step-textbox"
                        height={"56px"}
                        width={"304px"}
                        readOnly={true}
                        value={userFormData?.e_mail}
                      />
                      <TextBox
                        label="Mobile Number"
                        labelMode="static"
                        stylingMode="outlined"
                        className="step-textbox"
                        height={"56px"}
                        width={"304px"}
                        value={userFormData?.phone}
                        onValueChanged={(e) =>
                          handleInputChange("phone", e.value)
                        }
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
                      <SelectBox
                        label="Select Department"
                        placeholder="Input"
                        labelMode="static"
                        stylingMode="outlined"
                        onValueChanged={(e) =>
                          handleInputChange("cmpdeptid", e.value)
                        }
                        height={"56px"}
                        width={"304px"}
                        items={deptData}
                        displayExpr={"deptname"}
                        valueExpr={"transid"}
                        value={userFormData?.cmpdeptid}
                        className="required"
                      >
                        <Validator>
                          <RequiredRule message="Department is required" />
                        </Validator>
                      </SelectBox>
                      <SelectBox
                        label="Select Gender"
                        placeholder="Input"
                        labelMode="static"
                        stylingMode="outlined"
                        items={Genders}
                        height={"56px"}
                        width={"304px"}
                        onSelectionChanged={(e) =>
                          handleInputChange("gender", e)
                        }
                        value={userFormData?.gender}
                      ></SelectBox>
                    </div>
                  </form>
                </>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
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
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                value={formData?.bname}
                onValueChanged={(e) => handleInputChange("bname", e.value)}
                readOnly={!isCmp}
              />
              <TextBox
                label="Mobile Number"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                value={formData?.phone1}
                onValueChanged={(e) => handleInputChange("phone1", e.value)}
                readOnly={!isCmp}
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
                label="Phone"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                value={formData?.phone2}
                onValueChanged={(e) => handleInputChange("phone2", e.value)}
                readOnly={!isCmp}
              />

              <TextBox
                label="Email Address"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                readOnly={true}
                value={companyData.e_mail}
              />
            </div>
            <div className="profile-section-editor">
              <TextBox
                label="Website Link "
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                value={formData?.websitelink}
                onValueChanged={(e) =>
                  handleInputChange("websitelink", e.value)
                }
                readOnly={!isCmp}
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
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                value={formData?.blocation}
                onValueChanged={(e) => handleInputChange("blocation", e.value)}
                readOnly={!isCmp}
              />

              <TextBox
                label="Pincode"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                value={formData?.zipcode}
                onValueChange={handleGetAddress}
                onValueChanged={(e) => handleInputChange("zipcode", e.value)}
                readOnly={!isCmp}
              />
            </div>
            <div className="profile-section-editor">
              <TextBox
                label="City"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                value={formData?.city}
                onValueChanged={(e) => handleInputChange("city", e.value)}
                readOnly={!isCmp}
              />
              <TextBox
                label="State"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                value={formData?.state}
                onValueChanged={(e) => handleInputChange("state", e.value)}
                readOnly={!isCmp}
              />
            </div>
            <div className="profile-section-editor">
              <TextBox
                label="Country"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                value={formData?.country}
                onValueChanged={(e) => handleInputChange("country", e.value)}
                readOnly={!isCmp}
              />
              {isCmp && (
                <span style={{ width: "50%" }}>
                  <label
                    className="uplaod_btn"
                    htmlFor="file_upload"
                    style={
                      isValidLogo ? { border: "1px dashed red" } : undefined
                    }
                  >
                    <i className="ri-upload-2-fill"></i>
                    {uploadedFileName ? (
                      <p>{uploadedFileName}</p>
                    ) : (
                      "Upload company logo."
                    )}
                  </label>
                  <input
                    type="file"
                    id="file_upload"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                    accept="image/png, image/jpeg"
                  />
                  <span className="cmplogo_span">
                    * company logo should be sized between 500x500px
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
        {/*<div className="content-block dx-card">
          <div className="edit-profile-section">
            <div className="profile-section-header">
              <FormText text="Subscription Details" />
            </div>
            <div className="profile-section-editor">
              <TextBox
                label="Plan"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                // value={formData.bname}
                // onValueChanged={(e) => handleInputChange("bname", e.value)}
                // readOnly={!isCmp}
              />
              <TextBox
                label="Number of users"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                // value={formData.phone1}
                // onValueChanged={(e) => handleInputChange("phone1", e.value)}
                // readOnly={!isCmp}
              />
            </div>
            <div className="profile-section-editor">
              <TextBox
                label="Status"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                // value={formData.phone2}
                // onValueChanged={(e) => handleInputChange("phone2", e.value)}
                // readOnly={!isCmp}
              />

              <TextBox
                label="Valid Till"
                labelMode="static"
                stylingMode="outlined"
                className="step-textbox"
                height={"56px"}
                width={"304px"}
                // readOnly={true}
                // value={companyData.e_mail}
              />
            </div>
          </div>
        </div>*/}
      </div>
    </>
  );
}

const colCountByScreen = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
};
