import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  TooltipProps,
  ReferenceArea,
  Legend,
} from "recharts";
import {
  chartMainColor,
  upRefColor,
  lwRefColor,
  upRefColorWarn,
  lwRefColorWarn,
} from "../../Styles/CustomStyles";
import myStyle from "./CustomMultiLineChart.module.scss";
import moment from "moment";

interface Props {
  data: any;
  valueKey: string;
  xName: string;
  upperValue?: number;
  lowerValue?: number;
  multiUpper?:number[];
  multiUpperWarn?:number[];
  multiDown?:number[];
  multiDownWarn?:number[];
}
const CustomMultiLineChart = ({
  data,
  xName,
  valueKey,
  upperValue,
  lowerValue,
  multiUpper,
  multiDown,
  multiUpperWarn,
  multiDownWarn

}: Props) => {
  var multiColor:number = 0xf5f5f5;

  const DomainRange = (data: any, type: "dataMin" | "dataMax") => {
    var allData: number[] = [];
    data.map((x : any)=>{
      x.datas.map((y:any)=>{
        allData=[...allData, y.nowData,upperValue,lowerValue];
      })
    })
    if (type === "dataMax") {
      //return Math.floor(value + (value * 1.1 - value));
      return Math.floor(Math.max(...allData) * 1.1);
    } else if (type === "dataMin") {
      //return Math.floor(value - (value * 1.1 - value));
      if((Math.min(...allData)) > 0){
        return Math.floor(0.9 * Math.min(...allData));
      }
      else{
        return Math.floor(1.1 * Math.min(...allData));
      }
    }
  };

  const CustomTooltip = (tooltipProps: TooltipProps<any, any>) => {

    if (tooltipProps.active && tooltipProps.payload) {
      let color :string;
      tooltipProps.payload.map((x, idx)=>{
        x.color =
          Number(x.value) <= Number(lowerValue)
            ? lwRefColor
            : Number(x.value) >= Number(upperValue)
            ? upRefColor
            : "#1b1b1b";
      })

      return (
        <>
          <div className={myStyle.myContainer}>
            <div className={myStyle.dataLine}>
              <div className={myStyle.nowValue}>
                <div className={myStyle.valueTitle}>데이터 명</div>
                <div className={myStyle.titleUnder}>&nbsp;</div>
                {tooltipProps.payload.map(x=>(
                  <div className={myStyle.value} style={{ color : x.color, width:`${x.name.length*20}px`, paddingLeft:"15px"}}>
                    <div>{x.name}</div>
                  </div>
                ))}
              </div>



              <div className={myStyle.nowValue}>
                <div className={myStyle.valueTitle}>하한값 </div>
                <div className={myStyle.titleUnder}>위험</div>
                {tooltipProps.payload.map(x=>(
                  <div className={myStyle.value} style={{ color : lwRefColor}}>
                    {x.payload.dData}
                  </div>
                ))}
              </div>





              <div className={myStyle.nowValue}>
                <div className={myStyle.valueTitle}>하한값</div>
                <div className={myStyle.titleUnder}>경고</div>
                {tooltipProps.payload.map(x=>(
                  <div className={myStyle.value} style={{ color : lwRefColor}}>
                    {x.payload.dDataWarn}
                  </div>
                ))}
              </div>
              <div className={myStyle.nowValue}>
                <div className={myStyle.valueTitle}>현재값</div>
                <div className={myStyle.titleUnder}>&nbsp;</div>
                {tooltipProps.payload.map(x=>(
                  <div className={myStyle.value} style={{ color : x.color }}>
                    {x.payload.nowData}
                  </div>
                ))}
              </div>
              <div className={myStyle.nowValue}>
                <div className={myStyle.valueTitle}>상한값</div>
                <div className={myStyle.titleUnder}>경고</div>
                {tooltipProps.payload.map(x=>(
                  <div className={myStyle.value} style={{ color : upRefColor}}>
                    {x.payload.uDataWarn}
                  </div>
                ))}
              </div>



              <div className={myStyle.nowValue}>
                <div className={myStyle.valueTitle}>상한값</div>
                <div className={myStyle.titleUnder}>위험</div>
                {tooltipProps.payload.map(x=>(
                  <div className={myStyle.value} style={{ color : upRefColor}}>
                    {x.payload.uData}
                  </div>
                ))}
              </div>

            </div>




            <div className={myStyle.timeBar}>
              <div className={myStyle.title}>시간</div>
              <div className={myStyle.value}>
                {tooltipProps.label}
              </div>
            </div>
          </div>

        </>
      );
    }
    return null;
  };



  const [zoomData, setZoomData] = useState<any>();
  const [refAreaLeft, setRefAreaLeft] = useState<string>("");
  const [refAreaRight, setRefAreaRight] = useState<string>("");

  useEffect(() => {
    setZoomData(data);
  }, [data])



  const zoom = () => {
    let newRefAreaLeft = refAreaLeft;
    let newRefAreaRight = refAreaRight;

    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      setRefAreaLeft("");
      setRefAreaRight("");
      return;
    }
    

    
    if (new Date(refAreaLeft) > new Date(refAreaRight)) {
      [newRefAreaLeft, newRefAreaRight] = [refAreaRight, refAreaLeft];
      zoomOut();
      setRefAreaLeft("");
      setRefAreaRight("");
      return;
    }
    const newData : any[] = [];

    zoomData.map((el : any) => {

      const filtered = el.datas.filter((val : any) => {
        return new Date(val.time) >= new Date(newRefAreaLeft) && new Date(val.time) <= new Date(newRefAreaRight)
      })

      if(filtered.length>0){
        newData.push({
          checked:el.checked,
          datas:filtered,
          id:el.id,
        })
      }
    })
    if(newData.length>0){
      setZoomData(newData);
    }

    setRefAreaLeft("");
    setRefAreaRight("");


  }

  const zoomOut = () => {
    setZoomData(data);
  }
  const clickChart = () => {
    
  }


  useEffect(() => {
  }, [refAreaLeft, refAreaRight])


  useEffect(() => {
    setZoomData(data);
  }, [])
  return (
    <>
    {/* <button onClick={() => zoomOut()}>Zoom Out</button> */}
    <ResponsiveContainer width="99%" height="90%" >
      <LineChart 
      data={data} 
      onMouseDown={(e: any) => setRefAreaLeft(e.activeLabel)}
      onMouseMove={(e: any) => refAreaLeft && setRefAreaRight(e.activeLabel)}
      onMouseUp={zoom}
      >
        {/* <XAxis
        allowDataOverflow
          tickCount={2}
          dataKey={xName.toString()}
          stroke={chartMainColor}
          allowDuplicatedCategory={false}

          // domain={["auto","auto"]}
        />
        <YAxis
        allowDataOverflow
          stroke={chartMainColor}
          tickCount={6}
          domain={[
            (dataMin: number) => DomainRange(data, "dataMin"),
            (dataMax: number) => DomainRange(data, "dataMax"),
            // (dataMin: number) => 0,
            // (dataMax: number) => 900,
          ]}
        /> */}
                          <XAxis
                    allowDataOverflow
                    tickCount={2}
                    dataKey={xName.toString()}
                    stroke={chartMainColor}
                    allowDuplicatedCategory={false}
                    // domain={["auto","auto"]}

                  />
                  <YAxis
                    allowDataOverflow
                    stroke={chartMainColor}
                    tickCount={9}
                    domain={[
                      (dataMin: number) => DomainRange(data, "dataMin"),
                      (dataMax: number) => DomainRange(data, "dataMax"),
              // (dataMin: number) => 0,
              // (dataMax: number) => 900,
                    ]}
                    yAxisId={"0"}
                  />
        { 
          zoomData && zoomData.length>0?
            zoomData.map((x : any, idx:number)=>(
              <>
              
                  {/* <XAxis
                    allowDataOverflow
                    tickCount={2}
                    dataKey={xName.toString()}
                    stroke={chartMainColor}
                    allowDuplicatedCategory={false}
                    // domain={["auto","auto"]}
                  />
                  <YAxis
                    allowDataOverflow
                    stroke={chartMainColor}
                    tickCount={6}
                    domain={[
                      (dataMin: number) => DomainRange(data, "dataMin"),
                      (dataMax: number) => DomainRange(data, "dataMax"),
              // (dataMin: number) => 0,
              // (dataMax: number) => 900,
                    ]}
                    yAxisId={idx+""}
                  /> */}
                <Line
                  type="monotone"
                  dataKey="nowData"
                  data={x.datas}
                  name={x.id}
                  key={x.id}
                  stroke={"#"+(multiColor -(0x152051 * idx)).toString(16)}
                  strokeWidth={2.5}
                  />
                  
                   <Legend
                   name={x.id}
                   type="monotone" 
                   stroke={"#"+(multiColor -(0x152051 * idx)).toString(16)} />

              </>
            ))
          :null
        }
        {/* <Line (multiColor - 0x101010).toString(16)
          type="monotone"
          dataKey={"nowData2"}
          stroke={chartMainColor}
          strokeWidth={2.5}
        /> */}
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={upperValue} stroke={upRefColor} strokeWidth={2}/>
        <ReferenceLine y={lowerValue} stroke={lwRefColor} strokeWidth={2}/>
        {
          multiUpper && multiUpper.length>0 && multiUpper?.map((el) => {
            return <ReferenceLine y={el} stroke={upRefColor} strokeWidth={2}/>
          })
        }
        {
          multiDown && multiDown.length>0 && multiDown?.map((el) => {
            return <ReferenceLine y={el} stroke={lwRefColor} strokeWidth={2}/>
          })
        }


        {
          multiUpperWarn && multiUpperWarn.length>0 && multiUpperWarn?.map((el) => {
            return <ReferenceLine y={el} stroke={upRefColorWarn} strokeWidth={2}/>
          })
        }
        {
          multiDownWarn && multiDownWarn.length>0 && multiDownWarn?.map((el) => {
            return <ReferenceLine y={el} stroke={lwRefColorWarn} strokeWidth={2}/>
          })
        }
        {
          refAreaLeft !=="" && refAreaRight!=="" ? (
            new Date(refAreaLeft) > new Date(refAreaRight)?
              <ReferenceArea
                yAxisId="0"
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.5}
                fill="#9999ff"
              />:
              <ReferenceArea
                yAxisId="0"
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.5}
                fill="red"
              />
            ) : 
            null
        }
      </LineChart>
    </ResponsiveContainer>
    </>
  );
};

export default CustomMultiLineChart;
