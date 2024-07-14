import { useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  TooltipProps,
} from "recharts";
import {
  chartMainColor,
  upRefColor,
  lwRefColor,
} from "../../Styles/CustomStyles";
import myStyle from "./CustomLineChart.module.scss";

interface Props<T, K, V> {
  data: T[];
  valueKey: V;
  xName: K;
  upperValue?: number;
  lowerValue?: number;
}
const CustomLineChart = <T, K extends keyof T, V extends keyof T>({
  data,
  xName,
  valueKey,
  upperValue,
  lowerValue,
}: Props<T, K, V>) => {
  const DomainRange = (value: number, type: "dataMin" | "dataMax") => {
    if (type === "dataMax") {
      //return Math.floor(value + (value * 1.1 - value));
      return Math.floor(value * 1.1);
    } else if (type === "dataMin") {
      //return Math.floor(value - (value * 1.1 - value));
      return Math.floor(0.9 * value);
    }
  };

  const CustomTooltip = (tooltipProps: TooltipProps<any, any>) => {
    if (tooltipProps.active && tooltipProps.payload) {
      // let color :string;
      tooltipProps.payload.map(x=>{
        x.color =
          Number(x.value) <= Number(lowerValue)
            ? lwRefColor
            : Number(x.value) >= Number(upperValue)
            ? upRefColor
            : "#1b1b1b";
    })
      return (
        <div className={myStyle.tooltipLayout}>
          <div className={myStyle.time}>
            <div className={myStyle.title}>시간</div>
            <div className={myStyle.value}>
              {tooltipProps.label.split(" ")[0]}
            </div>
            <div className={myStyle.value}>
              {tooltipProps.label.split(" ")[1]}
            </div>
          </div>
          <div className={myStyle.nowValue}>
            <div className={myStyle.title}>현재값</div>
            {tooltipProps.payload.map(x=>(
              <div className={myStyle.value} style={{ color : x.color }}>
                {x.payload.nowData}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };
  return (
    <ResponsiveContainer width="70%" height="45%" >
      <LineChart data={data} style={{backgroundColor:" #292929"}}>
        <XAxis
          tickCount={2}
          dataKey={xName.toString()}
          stroke={chartMainColor}
        />
        <YAxis
          stroke={chartMainColor}
          tickCount={6}
          domain={[
            (dataMin: number) => DomainRange(dataMin, "dataMin"),
            (dataMax: number) => DomainRange(dataMax, "dataMax"),
          ]}
        />
        <Line
          type="monotone"
          dataKey={valueKey.toString()}
          stroke={chartMainColor}
          strokeWidth={2.5}
        />
        <Line
          type="monotone"
          dataKey={"nowData2"}
          stroke={chartMainColor}
          strokeWidth={2.5}
        />
        {/* <Line
          type="monotone"
          dataKey={"nowData2"}
          stroke={chartMainColor}
          strokeWidth={2.5}
        /> */}
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={upperValue} stroke={upRefColor} strokeWidth={2}/>
        <ReferenceLine y={lowerValue} stroke={lwRefColor} strokeWidth={2}/>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
