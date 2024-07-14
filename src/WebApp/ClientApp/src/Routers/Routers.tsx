import { Navigate, Route, Routes } from "react-router-dom";
import FullLayout from "../Layout/FullLayout";
import Alert from "../components/Alert";
import { MonitoringStore } from "../stores/MonitoringInfoStore";
import { useEffect } from "react";
import MainPage from "../Pages/Mainpage";
import DetailPortfolio from "../Pages/DetailPortfolio";
import DetailBoard from "../Pages/DetailAbout";

// import { Redirect } from "react-router-dom";

const Routers = () => {

  useEffect(() => {
    // MonitoringStore.initStart();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/DetailPortfolio" element={<DetailPortfolio />} />
        <Route path="/DetailBoard" element={<DetailBoard />} />
        {/* <Route path="optimizer/alarmhistoylist" element={<AlarmHistoryList />} /> */}

      </Routes>
      <Alert />
    </>
  );
};

export default Routers;
