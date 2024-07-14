import axios from "axios";
import requestHandler from "../RequestHandler/RequestHandler";
import exceldownloadimg from "../../Image/2/exceldownload.png"
import { LogInsert } from "../../Layout/CustomHeader/CustomHeader";
import moment from "moment";
import { useEffect, useState } from "react";

export const DataTrendExcelExport = ({ from, to, process, eqp, data }: any) => {
  const [userInfo, setUserInfo] = useState<any>('');


  const test= async ()=>{
    var test = data.dropDownMultiBox.replace(/\"/gi, "").replace(/\'/gi, "").split(",");
    const param = {
      dataCode : test,
      equipCode : eqp,
      from : moment(from).format(`yyyy-MM-DD 00:00:00`).toString(),
      to : moment(to).format(`yyyy-MM-DD 23:59:59`).toString(),
    };


    await requestHandler<any>("post", "/Optimizer/DataTrendListClick", param).then((res) => {      
      
      let index = -1;
      let strTmp = '124rgwareg';
      const dataArray : any[] = [];
      const upData : any[] = [];
      const upDataWarn : any[] = [];
      const downData : any[] = [];
      const downDataWarn : any[] = [];
      // const emptyArray : any[] =[];
      // emptyArray.push(
      //   {
      //     id: "",
      //     checked: false,
      //     datas: [
      //       {
      //         time:"",
      //         uData:"",
      //         uDataWarn:"",
      //         dData:"",
      //         dDataWarn:"",
      //         nowData:"",
      //       }
      //     ]
      //   }
      // )
      // if(res.data.length === 0){
      //   return;
      // }
      
      res.data.map((el : any) => {
        if(el.id !== strTmp){
          strTmp = el.id;
          index++;
          upData.push(el.uData);
          upDataWarn.push(el.uDataWarn);
          downData.push(el.dData);
          downDataWarn.push(el.dDataWarn);
          dataArray.push(
            {
              id: el.id,
              checked: false,
              datas: [
              ]
            }
          )
        }
        dataArray[index].datas.push({
          time: el.time,
          uData: el.uData,
          uDataWarn: el.uDataWarn,
          dData: el.dData,
          dDataWarn: el.dDataWarn,
          nowData: el.nowData,
        })
      })


    })
  }

  useEffect(() => {
    const userinfo = localStorage.getItem("user-Info");
    if(typeof userinfo === 'string'){
      setUserInfo(JSON.parse(userinfo))
    }
  }, []);
  
  const a = () => {
    if (!from || !to || !eqp || eqp === "''" || eqp === ""||data==="") {
      alert("설비 정보가 필요합니다.");
      return;
    }
    var dataCodeList = data.dropDownMultiBox.replace(/\"/gi, "").replace(/\'/gi, "").split(",");
    const param = {
      dataCode : data.dropDownMultiBox,
      eqp : eqp.dropDownBoxEquip,
      from : moment(from).format(`yyyy-MM-DD 00:00:00`).toString(),
      to : moment(to).format(`yyyy-MM-DD 23:59:59`).toString(),
    };

    
    axios({
      url: "/api/Excel/DataTrendExcel",
      method: "GET",
      params: { from: param.from, to: param.to, eqp: param.eqp ,dataList: param.dataCode},
      responseType: "blob", // important
    }).then((res) => {
      try {
        // create file link in browser's memory
        const href = URL.createObjectURL(res.data);
        // create "a" HTML element with href to file & click
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute(
          "download",
          `데이터 트렌드 리포트__[${param.eqp}]__${param.from.split(" ")[0]}~${
            param.to.split(" ")[0]
          }.xlsx`
        ); //or any other extension
        document.body.appendChild(link);
        link.click();
        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      } catch (err) {}
      LogInsert({
        user_id:userInfo?userInfo.userId:"Guest",
        eventtime:  moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        eventname: "Excel Export",
        eventurl: "데이터 트렌드 조회"
      })
    });
  };
  
  return (
    <>
      <button 
      // style={{marginLeft:"-380px", marginTop:"3px"}}
      className="popupBtn" onClick={a}>
      {/* <img src={exceldownloadimg} style={{height:"60%", marginBottom: "-5px",marginRight:"6px"}}/> */}
        Export
      </button>
    </>
  );
};
