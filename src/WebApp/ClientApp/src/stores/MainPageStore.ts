import { action, makeObservable, observable, runInAction, computed } from "mobx";
import axios from "axios";
import requestHandler from "../components/RequestHandler/RequestHandler";

// export type ErrorMonitoringType = {
//   equipType: string,
//   equipCode: string, 
//   equipName: string,
//   message: string, 
//   dataCode: string, 
//   alarmValue: string, 
//   startTime: string, 
//   endTime: string, 
//   operationSec: string,
//   errorFlag: string,
// };
// export type monitoringFlagType ="Total" | "Operation" ;

export type protflioType = {
    id: string,
    contents: string,
    index: string,
}

class MainPageStore {
    //   ErrorMonitoringList: ErrorMonitoringType[] = [
    //   //   {
    //   //   equipCode : "",
    //   //   equipName : "",
    //   //   message : "",
    //   //   dataCode : "",
    //   //   alarmValue : "",
    //   //   startTime : "",
    //   //   endTime : "",
    //   //   operationSec : "",
    //   // }
    // ];
    //   clickedProcess: string="";
    //   monitoringFlag: monitoringFlagType="Total";

    portfolio: protflioType[] = [{
        id: "",
        contents: "",
        index: "",
    }]

    constructor() {
        makeObservable(this, {
            portfolio: observable,
            setPortfolio: action,
            getPortfolio: computed,


        });
    }
    initStart = async () => {
        await this.setPortfolio();
    };



    setPortfolio = async () => {

        const params = {};

        requestHandler<any>("get", "/MainPage/portfolio", params).then((result) => {
            if (result) {
                console.log(result.data);
                this.portfolio = result.data;
            }
        })
            .catch((error) => {
                console.error(error);
            });
    };

    get getPortfolio() {
        return this.portfolio;
    }

    //   setClickedProcess = async (process: string) => {
    //     try {
    //       this.clickedProcess = process;
    //     } catch (err) {
    //       console.error(err);
    //     }
    //   };

    //   get getClickedProcess() {
    //     return this.clickedProcess;
    //   }

    //   setMonitoringFlag = async (flag: monitoringFlagType) => {
    //     try {
    //       this.monitoringFlag = flag;
    //     } catch (err) {
    //       console.error(err);
    //     }
    //   };

    //   get getMonitoringFlag() {
    //     return this.monitoringFlag;
    //   }



}

export const MainPageInfoStore = new MainPageStore();
