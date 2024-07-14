import myStyle from "./MenuLink.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { HistoryTabContext } from "../../Layout/FullLayout/FullLayout";
import { EquipManage } from "../../stores/EquipStateManage";

export interface ILinkInfo {
  category: string;
  label: string;
  url: string;
}

interface IMenuLink {
  category: string;
  list: ILinkInfo[];
}

const MenuLink = ({ category, list }: IMenuLink) => {
  const navigate = useNavigate();
  const { setClickedEquipCode, getClickedEquipCode,setClickedProcess } = EquipManage;
  // useHistoty(Tap)=> 추후 login auth 정보 추가
  const myAuthPage = (
    addHistory: (url: string, label: string) => void,
    url: string,
    label: string
  ) => {
    addHistory(url, label);
    navigate(url);
    setClickedEquipCode('RT012');
    setClickedProcess({data: '합성 공정'});
  };

  return (
    <HistoryTabContext.Consumer>
      {({ addHistory }) => (
        <div className={myStyle.menuLinkBox}>
          {list.map((d, idx) => {
            return (
              <Link
                className={myStyle.menuLinkBoxItem}
                key={`menu_link_${category}_${idx}`}
                to={d.url}
                onClick={() => {
                  // addHistory(d.url, d.label);
                  myAuthPage(addHistory, d.url, d.label);
                }}
              >
                <span>{d.label}</span>
              </Link>
              // <div
              //   className={myStyle.menuLinkBoxItem}
              //   key={`menu_link_${category}_${idx}`}
              //   onClick={() => {
              //     myAuthPage(addHistory, d.url, d.label);
              //   }}
              // >
              //   <Link to={d.url}>{d.label}</Link>
              // </div>
            );
          })}
        </div>
      )}
    </HistoryTabContext.Consumer>
  );
};
export default MenuLink;
