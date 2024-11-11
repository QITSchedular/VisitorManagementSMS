import React, { useState, useRef, useEffect } from "react";
import "./step3.scss";
import { Button } from "devextreme-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRegisterVisitor } from "../../Atoms/customHook";
import { toastDisplayer } from "../../components/toastDisplayer/toastdisplayer";

export const Step3 = () => {
  const navigate = useNavigate();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [imageSrcBase, setImageSrcBase] = useState(null);
  const [isCameraAvailable, setIsCameraAvailable] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [registerVisitor, setRegisterVisitor] = useRegisterVisitor();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  // const cmpId = queryParams.get("cmpId");
  const [cmpId, setcmpId] = useState(
    localStorage.getItem("cmpId") || queryParams.get("cmpId")
  );

  useEffect(() => {
    localStorage.setItem("previousPath", "/step3");
    // Check if the camera is available
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoDevices = devices.filter(
            (device) => device.kind === "videoinput"
          );
          setIsCameraAvailable(videoDevices.length > 0);
        })
        .catch((err) => {
          console.error("Error checking camera availability: ", err);
        });
    } else {
      console.error("enumerateDevices is not supported");
      toastDisplayer("error", "Camera not supported due to HTTP site");
    }
  }, []);

  const handleNoCamera = () => {
    return navigate(`/welcomestep4?cmpId=${cmpId}`);
  };

  // Start the Camera
  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            aspectRatio: { ideal: 1.777778 }, // Adjust based on your requirement
            zoom: 1, // Ensure no additional zoom is applied
          },
        }) // 9:16 aspect ratio
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Error accessing the camera: ", err);
        });
    } else {
      console.error("getUserMedia is not supported");
      toastDisplayer("error", "getUserMedia is not supported");
    }
  };

  // Stop the Camera
  const stopCamera = () => {
    let stream = videoRef.current.srcObject;
    let tracks = stream.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });

    videoRef.current.srcObject = null;
  };

  // Toggle Camera Operation
  const toggleCamera = () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      startCamera();
    }
    setIsCameraOn((prevState) => !prevState);
  };

  // Capture Photo
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageSrc = canvas.toDataURL("image/jpeg");
    setImageSrcBase(imageSrc);
    stopCamera();
    setIsCameraOn(false);
  };

  // Previous Button
  const handlePreviousBtn = () => {
    navigate(`/welcomestep1?cmpId=${cmpId}`);
  };

  // Action for continue button
  const handleActionContinue = () => {
    setRegisterVisitor((prev) => ({
      ...prev,
      vavatar: imageSrcBase,
    }));

    return navigate(`/welcomestep4?cmpId=${cmpId}`);
  };

  // useEffect(() => {
  //   const handleBackButton = (event) => {
  //     // Your custom logic here
  //     console.log("Back button pressed!");
  //     handleActionContinue();
  //   };

  //   window.onpopstate = handleBackButton;

  //   // Cleanup event listener
  //   return () => {
  //     window.onpopstate = null;
  //   };
  // }, []);

  return (
    <div className="step3">
      <div className="backbtn">
        <i
          className="ri-arrow-left-line"
          style={{ fontSize: "20px" }}
          onClick={handlePreviousBtn}
        ></i>
      </div>
      <div className="header-step">
        <div className="step-number">
          <span>Step 3/4</span>
        </div>
        <div className="welcome-text">
          <span>Click Photo</span> <span>Click the picture</span>
        </div>
      </div>
      <div className={`picture ${isCameraOn ? "fullscreen" : ""}`}>
        {isCameraOn && (
          <div className="imgcapture">
            <div className="video-wrapper">
              <video
                ref={videoRef}
                width="100%"
                height="100%"
                autoPlay
                style={{ display: isCameraOn ? "block" : "none" }}
              ></video>
              {isCameraOn && (
                <div className="photo-button" onClick={capturePhoto}>
                  <div className="circle"></div>
                  <div className="ring"></div>
                </div>
              )}
            </div>
            <canvas
              ref={canvasRef}
              width="720"
              height="1280"
              style={{ display: "none" }}
            ></canvas>
          </div>
        )}

        {!isCameraOn && imageSrcBase && (
          <div className="imgcapture">
            <img
              src={imageSrcBase}
              alt="profile"
              height="240px"
              width="140px"
            />
          </div>
        )}

        {!isCameraOn && (
          <div className="captureBtn">
            {isCameraAvailable ? (
              <Button
                text={"Click a picture"}
                width={"100%"}
                height={"44px"}
                className="clickBtn"
                onClick={toggleCamera}
              />
            ) : (
              <>
                <p className="no-camera">* Camera not available</p>

                <Button onClick={handleNoCamera} text="Go to next page" />
              </>
            )}

            {imageSrcBase && (
              <Button
                text={"Continue"}
                width={"100%"}
                height={"44px"}
                onClick={handleActionContinue}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Step3;
