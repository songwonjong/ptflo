import { action, makeObservable, observable, runInAction, computed } from "mobx";
import axios from "axios";
import requestHandler from "../components/RequestHandler/RequestHandler";

export type ErrorMonitoringType = {
  equipType: string,
  equipCode: string, 
  equipName: string,
  message: string, 
  dataCode: string, 
  alarmValue: string, 
  startTime: string, 
  endTime: string, 
  operationSec: string,
  errorFlag: string,
};
export type monitoringFlagType ="Total" | "Operation" ;


class MonitoringInfoStore {
  ErrorMonitoringList: ErrorMonitoringType[] = [
  //   {
  //   equipCode : "",
  //   equipName : "",
  //   message : "",
  //   dataCode : "",
  //   alarmValue : "",
  //   startTime : "",
  //   endTime : "",
  //   operationSec : "",
  // }
];
  clickedProcess: string="";
  monitoringFlag: monitoringFlagType="Total";

  constructor() {
    makeObservable(this, {
      clickedProcess: observable,
      setClickedProcess: action,
      getClickedProcess: computed,

      ErrorMonitoringList: observable,
      setErrorMonitoringList: action,
      getErrorMonitoringList: computed,

      monitoringFlag: observable,
      setMonitoringFlag: action,
      getMonitoringFlag: computed,

    });
  }
  initStart = async () => {
    // await this.setTotalError();
    await this.setErrorMonitoringList();
  };

  setErrorMonitoringList = async () => {

    const params={};

    requestHandler<any>("get", "/Monitoring/ErrorMonitoringList",params).then((result) => {
        if (result) {
          this.ErrorMonitoringList = result.data;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  get getErrorMonitoringList() {
    return this.ErrorMonitoringList;
  }

  setClickedProcess = async (process: string) => {
    try {
      this.clickedProcess = process;
    } catch (err) {
      console.error(err);
    }
  };

  get getClickedProcess() {
    return this.clickedProcess;
  }

  setMonitoringFlag = async (flag: monitoringFlagType) => {
    try {
      this.monitoringFlag = flag;
    } catch (err) {
      console.error(err);
    }
  };

  get getMonitoringFlag() {
    return this.monitoringFlag;
  }


  





}

export const MonitoringStore = new MonitoringInfoStore();
