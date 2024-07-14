import { toJS, computed } from "mobx";
import { observer } from "mobx-react";
import { useEffect, useState, createContext } from "react";
import ModalControl from "../ModalControl";
import { ErrorControl } from "../../stores/ErrorManagerStore";
import CustomFooter from "../CustomFooter";
import CustomHeader from "../CustomHeader";
import CustomMain from "../CustomMain";
import myStyle from "./FullLayout.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import requestHandler from "../../components/RequestHandler/RequestHandler";
import { AxiosResponse } from "axios";

export type stringKeyType = {
  [key: string]: any;
};

export const HistoryTabContext = createContext({
  historyList: [] as stringKeyType[],
  addHistory: (url: string, label: string) => { },
  removeHistory: (url: string) => { },
});

const FullLayout = observer(() => {

  useEffect(() => {
    //realTimeDBConnect()
    //실시간 디비 연결
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const [historyList, setHistoryList] = useState([] as stringKeyType[]);

  const addHistory = (url: string, label: string) => {
    const list = [...historyList];

    const index = list.findIndex((x) => x["url"] === url);
    if (index >= 0) {
      list.splice(index, 1);
    }

    list.unshift({ url: url, label: label });

    setHistoryList(list);
  };

  const removeHistory = (url: string) => {
    const list = [...historyList];

    const index = list.findIndex((x) => x["url"] === url);
    if (index >= 0) {
      list.splice(index, 1);

      if (url == location.pathname && list.length > 0) {
        // v5 => navigate.push(list[0].url)
        navigate(list[0].url);
      }
      // }
    }

    setHistoryList(list);
  };

  const state = {
    historyList: historyList,
    addHistory: addHistory,
    removeHistory: removeHistory,
  };

  return (
    <HistoryTabContext.Provider value={state}>
      <div className={myStyle.continer}>
        {/* <CustomHeader errors={toJS(existingErrors)} /> */}
        {/* <CustomHeader errors={toJS(errors)} /> */}
        <CustomMain
        />
        {/* <CustomFooter /> */}
        <ModalControl />
      </div>
    </HistoryTabContext.Provider>
  );
});

export default FullLayout;
