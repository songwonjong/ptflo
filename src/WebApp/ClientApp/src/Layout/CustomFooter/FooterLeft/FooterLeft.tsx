import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../components/CustomButton";
//import CustomMenu from "../../../components/CustomMenu";
import { Buildings, Mechines } from "../../../stores/TestData";
import DetailButtonLayout from "./DetailButtonLayout";
import myStyle from "./FooterLeft.module.scss";

export type DataType = {
  where: "floor" | "equipment";
  args1_Data: string;
  args2_Datas: string[];
};
const FooterLeft = () => {
  const navigate = useNavigate();

  const LocationUrl = (
    where: "floor" | "equipment",
    args1: string,
    args2: string
  ) => {
    switch (where) {
      case "floor":
        return navigate(`/floor/${args1}/${args2}`);
      case "equipment":
        return navigate(
          `/equipment/${args1}/${args2.toString().split("#")[1]}`
        );
      default:
        return;
    }
  };

  const buildRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<DataType>();

  const RefFuc = (e: any) => {
    buildRef.current?.childNodes.forEach(function (item: any) {
      item.style.backgroundColor = "";
      item.style.border = "";
    });
    machineRef.current?.childNodes.forEach(function (item: any) {
      item.style.backgroundColor = "";
      item.style.border = "";
    });
    e.target.parentNode.style.borderRadius = "10px";
    e.target.parentNode.style.border = "1px solid #4FD3C4";
  };

  return (
    <div className={myStyle.container}>
      <div className={myStyle.detail}>
        {data && (
          <DetailButtonLayout data={data} onClickUrlParams={LocationUrl} />
        )}
      </div>
      <div className={myStyle.list}>
        <div ref={buildRef} className={myStyle.buildings}>
          {Object.entries(Buildings).map((b, idx) => (
            <div key={idx} className={myStyle.btn}>
              <CustomButton
                text={`${b[0]}동`}
                color="primary"
                onClick={(e) => {
                  RefFuc(e);
                  setData({
                    where: "floor",
                    args1_Data: b[0],
                    args2_Datas: Object.keys(b[1]),
                  });
                }}
              />
            </div>
          ))}
        </div>
        <div ref={machineRef} className={myStyle.machines}>
          {Object.entries(Mechines).map((m, idx) => (
            <div key={idx} className={myStyle.btn}>
              <CustomButton
                text={m[1].label}
                color="primary"
                onClick={(e) => {
                  RefFuc(e);
                  setData({
                    where: "equipment",
                    args1_Data: m[0],
                    args2_Datas: [...m[1].data],
                  });
                }}
              />
            </div>
          ))}
        </div>
      </div>
      {/* <div className={myStyle.buildingNames}>
          {Object.entries(Buildings).map((i: any, idx: number) => (
            <div key={idx} className={myStyle.button}>
              <CustomMenu
                text={`${i[0]}동`}
                menuItem={Object.keys(i[1])}
                menuItemClick={(e) => LocationUrl("floor", i[0], e)}
                anchorOrigin={{
                  vertical: "center",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              />
            </div>
          ))}
        </div>
        <div className={myStyle.machines}>
          {Object.entries(Mechines).map((i: any, idx: number) => (
            <div key={idx} className={myStyle.button}>
              <CustomMenu
                text={i[1].label}
                menuItem={i[1].data}
                menuItemClick={(e) =>
                  LocationUrl("equipment", i[0], e.toString().split("#")[1])
                }
                anchorOrigin={{
                  vertical: "center",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              />
            </div>
          ))}
        </div> */}
    </div>
  );
};

export default FooterLeft;
