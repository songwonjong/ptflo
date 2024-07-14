import axios from "axios";
import requestHandler from "../RequestHandler/RequestHandler";
import exceldownloadimg from "../../Image/2/exceldownload.png"
import { LogInsert } from "../../Layout/CustomHeader/CustomHeader";
import moment from "moment";
import { useEffect, useState } from "react";

export const ExcelExport = ({ from, to, eqp }: any) => {
  const [userInfo, setUserInfo] = useState<any>('');

  useEffect(() => {
    const userinfo = localStorage.getItem("user-Info");
    if (typeof userinfo === 'string') {
      setUserInfo(JSON.parse(userinfo))
    }
  }, []);

  const a = () => {
    if (!from || !to || !eqp || eqp === "''" || eqp === "") {
      alert("설비 정보가 필요합니다.");
      return;
    }

    // axios({
    //   url: "/api/Excel/AlarmstatisticsExcel",
    //   method: "GET",
    //   params: { from: from, to: to, eqp: eqp },
    //   responseType: "blob", // important
    // }).then((res) => {
    //   try {
    //     // create file link in browser's memory
    //     const href = URL.createObjectURL(res.data);
    //     // create "a" HTML element with href to file & click
    //     const link = document.createElement("a");
    //     link.href = href;
    //     link.setAttribute(
    //       "download",
    //       `알람 통계 조회__[${eqp}]__${from.split(" ")[0]}~${
    //         to.split(" ")[0]
    //       }.xlsx`
    //     ); //or any other extension
    //     document.body.appendChild(link);
    //     link.click();
    //     // clean up "a" element & remove ObjectURL
    //     document.body.removeChild(link);
    //     URL.revokeObjectURL(href);
    //   } catch (err) {}
    //   LogInsert({
    //     user_id:userInfo?userInfo.userId:"Guest",
    //     eventtime:  moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    //     eventname: "Excel Export",
    //     eventurl: "알람 통계 조회"
    //   })
    // });
  };


  return (
    <>
      <button
        // style={{marginLeft:"-380px", marginTop:"3px"}}
        className="btn insertBtn" onClick={a}>
        <img src={exceldownloadimg} style={{ height: "60%", marginBottom: "-5px", marginRight: "6px" }} />
        Export
      </button>
    </>
  );
};
