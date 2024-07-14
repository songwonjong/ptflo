import "./CustomAlarmInfo.scss"
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

const CustomAlarmInfo = (props: {
  open?: any;
  close: () => void;
  // header: any;
  children?: any;
  data?: any;
}) => {
  const { open, close, data } = props;
  // equipCode
  // equipName
  // message
  // dataCode
  // alarmValue
  // startTime
  // endTime
  // operationSec
  return (
    <div className={open ? 'openModal modal4' : 'modal'}>
      {open ? (
        <section>
          <header>
            상세정보
            <button className="close" onClick={close}>
              &times;
            </button>
          </header>
          <main>
          {/* <div>
              <div>설  비  명 : </div>
              <div>메  시  지 : </div>
              <div>시작  시간 : </div>
              <div>종료  시간 : </div>
              <div>dataCode : </div>
              <div>alarmValue : </div>
              <div>operationSec : </div>
            </div>
            <div>
              <div>{data.equipName}</div>
              <div>{data.message}</div>
              <div>{data.startTime}</div>
              <div>{data.endTime}</div>
              <div>{data.dataCode}</div>
              <div>{data.alarmValue}</div>
              <div>{data.operationSec}</div>
            </div> */}
            <div>
              <span>공&emsp;정&emsp;명</span><span>: {data.equipType}</span>
            </div>
            <div>
              <span>설&emsp;비&emsp;명</span><span>: {data.equipName}</span>
            </div>
            <div>
              <span>메&emsp;시&emsp;지</span><span>: {data.message}</span>
            </div>
            <div>
              <span>시작&emsp;시간</span><span>: {data.startTime}</span>
            </div>
            <div>
              <span>종료&emsp;시간</span><span>: {data.endTime}</span>
            </div>
            <div>
              <span>알람발생 값</span><span>: {data.alarmValue}</span>
            </div>
            <div>
              <span>경과시간(초)</span><span>: {data.operationSec}</span>
            </div>
          </main>
        </section>
       
        ) : null}
      </div>
  );
};

export default CustomAlarmInfo;
