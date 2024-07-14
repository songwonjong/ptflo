import { useEffect, useState } from "react";
import CustomButton from "../../../../components/CustomButton";
import { divitionArr } from "../../../../utils/arrayDivision";
import { DataType } from "../FooterLeft";
import myStyle from "./DetailButtonLayout.module.scss";

interface Props {
  data: DataType;
  onClickUrlParams: (
    where: "floor" | "equipment",
    args1: string,
    args2: string
  ) => void;
}

const DetailButtonLayout = ({ data, onClickUrlParams }: Props) => {
  const [newArr, setNewArr] = useState<any>([]);

  useEffect(() => {
    setNewArr(divitionArr(data?.args2_Datas, 6));
  }, [data]);

  return (
    <div className={myStyle.container}>
      {[...newArr].map((arr: any[], idx: number) => (
        <div key={idx} className={myStyle.inner}>
          {[...arr].map((i: string, idx: number) => (
            <div className={myStyle.btn} key={idx}>
              <CustomButton
                text={i}
                color="primary"
                onClick={() => onClickUrlParams(data.where, data.args1_Data, i)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DetailButtonLayout;
