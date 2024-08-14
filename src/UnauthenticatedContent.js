import { Routes, Route, Navigate } from "react-router-dom";
import { SingleCard } from "./layouts";
import {
  LoginForm,
  ResetPasswordForm,
  ChangePasswordForm,
  CreateAccountForm,
  OtpVerificationForm,
  FillDetailsForm,
  QRCodeForm,
  ResetLinkPassword,
} from "./components";
import { Welcome } from "./visitorMobile/welcome/welcome";
import { Step1 } from "./visitorMobile/welcomeDetails/step1";
import { CheckOut } from "./visitorMobile/checkout/CheckOut";
import { CheckInOtp } from "./visitorMobile/OtpVerify/CheckInOtp";
import { Step3 } from "./visitorMobile/step3/step3";
import { Step4 } from "./visitorMobile/step4/Step4";
import CheckStatus from "./visitorMobile/checkStatus/CheckStatus";
import AfterApproval from "./visitorMobile/AfterApproval/AfterApproval";
import StatusPage from "./visitorMobile/checkStatus/StatusPage";
import { CheckIn } from "./visitorMobile/checkIn/CheckIn";

export default function UnauthenticatedContent() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <SingleCard title="Sign In">
            <LoginForm />
          </SingleCard>
        }
      />
      <Route
        path="/create-account"
        element={
          <SingleCard title="Sign Up">
            <CreateAccountForm />
          </SingleCard>
        }
      />
      <Route
        path="/reset-password"
        element={
          <SingleCard
            title="Reset Password"
            description="Please enter the email address that you used to register, and we will send you a link to reset your password via Email."
          >
            <ResetPasswordForm />
          </SingleCard>
        }
      />

      <Route
        path="/otp-verification"
        element={
          <SingleCard>
            <OtpVerificationForm />
          </SingleCard>
        }
      />
      <Route
        path="/fill-details"
        element={
          <SingleCard>
            <FillDetailsForm />
          </SingleCard>
        }
      />
      <Route
        path="/qr-code"
        element={
          <SingleCard>
            <QRCodeForm />
          </SingleCard>
        }
      />
      <Route
        path="/change-password"
        element={
          <SingleCard>
            <ChangePasswordForm />
          </SingleCard>
        }
      />
      <Route path="/welcomevisitor/" element={<Welcome />} />
      <Route path="/welcomestep1" element={<Step1 />} />
      <Route path="/Checkout" element={<CheckOut />} />
      <Route path="/CheckIn" element={<CheckIn />} />
      <Route path="/checkinotp" element={<CheckInOtp />} />
      <Route path="/welcomestep3" element={<Step3 />} />
      <Route path="/welcomestep4" element={<Step4 />} />
      <Route path="/checkstatus" element={<CheckStatus />} />
      <Route path="/Success" element={<AfterApproval />} />
      <Route path="/statusPage" element={<StatusPage />} />
      <Route path="/reset-pwd-link" element={<ResetLinkPassword />} />
      <Route path="*" element={<Navigate to={"/login"} />}></Route>
    </Routes>
  );
}
