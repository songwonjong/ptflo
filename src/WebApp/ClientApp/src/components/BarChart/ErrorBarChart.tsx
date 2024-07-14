import { FunctionComponent } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";

interface props {
  colors: string[];
  data: any[];
  dataKeyBar: string;
  dataKeyLine: string;
  word: string;
  width: string;
  height: string;
}

const CustomizedLabel: FunctionComponent<any> = (props: any) => {
  const { x, y, stroke, value, word } = props;
  return (
    <>
      <svg>
        <g>
          <rect
            x={x + 10}
            y={y - 16}
            rx="15"
            width="80"
            height="30"
            fill="gray"
          ></rect>
          <text
            x={x + 50}
            y={y}
            style={{ fill: "white" }}
            dominant-baseline="middle"
            text-anchor="middle"
          >
            {value + word}
          </text>
        </g>
      </svg>
    </>
  );
};

const renderCustomizedLabelA: FunctionComponent<any> = (props: any) => {
  const { x, y, width, height, value, fill, word } = props;
  const radius = 5;

  return (
    <>
      <g>
        <rect x={x} y={y - 15} rx="15" width="80" height="28" fill={fill} />
        <text
          x={x + 40}
          y={y}
          fill="white"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {/* {value + "분"} */}
        </text>
      </g>
    </>
  );
};
const renderCustomizedLabelB: FunctionComponent<any> = (props: any) => {
  const { x, y, width, height, value, fill, word } = props;
  const radius = 5;

  return (
    <g>
      <rect x={x} y={y - 15} rx="15" width="80" height="28" fill={fill} />
      <text
        x={x + 40}
        y={y - 0}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {value}
      </text>
    </g>
  );
};

export const BarChart = ({
  width,
  height,
  colors,
  data,
  dataKeyBar,
  dataKeyLine,
  word,
}: props) => {
  return (
    <ResponsiveContainer width={width} aspect={3.5} height={height}>
      <ComposedChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#e5e5e5" />
        <XAxis dataKey="scope" stroke="black" />
        <YAxis stroke="white" />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKeyBar} fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % 10]} />
          ))}
          <LabelList dataKey={dataKeyBar} content={renderCustomizedLabelB} />
        </Bar>

        {/* <Line type="monotone" dataKey={dataKeyLine} stroke="red">
          <LabelList content={<CustomizedLabel word={word} />} />
        </Line> */}
      </ComposedChart>
    </ResponsiveContainer>
  );
};
