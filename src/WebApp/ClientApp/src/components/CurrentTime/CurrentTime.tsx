import { useEffect, useState } from "react";
import { TimeFormat } from "../../utils/getTimes";
import myStyle from "./CurrentTime.module.scss";

const CurrentTime = () => {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const Timer = setTimeout(() => {
      setTime(TimeFormat(new Date()));
    }, 1000);
    return () => clearTimeout(Timer);
  }, [time]);
  // return <div className={myStyle.realTime}>{time}</div>;
  return (
    <div className={myStyle.container}>
      <div className={myStyle.line}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: 200,
            fontSize: 20,
          }}
        >
          현재시간
        </div>
      </div>
      <div className={myStyle.inner}>{time}</div>
    </div>
  );
};

export default CurrentTime;
