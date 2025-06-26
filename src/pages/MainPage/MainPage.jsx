import React, { useEffect, useRef } from "react";
import HomeComp from "../../components/mainPageComps/HomeComps/HomeComp";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const MainPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const hasShownMessage = useRef(false); 
  useEffect(() => {
    const welcomeMessage = location.state?.welcomeMessage;
    if (welcomeMessage && !hasShownMessage.current) {
      enqueueSnackbar(welcomeMessage, { variant: "success" });
      hasShownMessage.current = true; 

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, enqueueSnackbar, navigate, location.pathname]);

  return (
    <div className="main-page">
      <HomeComp />
    </div>
  );
};

export default MainPage;