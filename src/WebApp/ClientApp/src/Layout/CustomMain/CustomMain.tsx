import { Outlet } from "react-router-dom";
import ErrorBox from "../../components/ErrorBox";
import ErrorListBox from "../../components/ErrorListBox";
import { ErrorType } from "../../stores/ErrorManagerStore";
import CustomMenuList from "../CustomMenuList/CustomMenuList";
import myStyle from "./CustomMain.module.scss";
import { useEffect, useState, useRef } from "react";
import backgroundImg from "./../../Image/backgroundimg.png"



interface Props {
  //from FullLayout.tsx
}
type btnValue = {
  searchBtn: string,
  insertBtn: string,
  updateBtn: string,
  deleteBtn: string,
};

const CustomMain = ({ }: Props) => {
  const setIndex = (e: any) => {
    Array.from(e.currentTarget.parentNode.children).map(
      (i: any) => (i.style.zIndex = 0)
    );
    e.currentTarget.style.zIndex = 3;
  };
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      try {
        // search();
        // searchSpare();
        // console.log("search");
      } catch {
        console.log("Main Page Error. Restart");
      } finally {
        // console.log("Main Page Search")
        setCount(count > 10 ? 0 : count + 1);
      }
      // console.log(new Date())
    }, 10000);
    return () => clearInterval(id);
  }, [count]);
  return (
    <>
      <div style={{ backgroundColor: "#191929", backgroundImage: `url(${backgroundImg})`, backgroundSize: "cover", width: "100%", height: "100%", position: "fixed", zIndex: "-10" }}>
      </div>
      <div className={myStyle.container} >
        {/* <CustomMenuList /> */}
        <div className={myStyle.main}>
          <Outlet />
        </div>
      </div>
    </>
  );
};
export default CustomMain;
