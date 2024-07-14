import myStyle from "./CustomArticle.module.scss";
import { FaAngleDoubleRight } from "react-icons/fa";

type Position = "left" | "top" | "topLeft";
interface Props {
  title: string;
  titlePosition: Position;
  children: React.ReactNode;
  require?: any;
}
const CustomArticle = ({ title, titlePosition, children, require }: Props) => {
  switch (titlePosition) {
    case "left":
      return (
        <div className={myStyle.leftTitleContainer}>
          <div className={myStyle.title}>
            <FaAngleDoubleRight className={myStyle.tilteIcon} />
            <div className={myStyle.titleText}>{`${title} : `}</div>
          </div>
          <div className={myStyle.childL}>{children}</div>
        </div>
      );
    case "top":
      return (
        <div className={myStyle.topTitleContainer}>
          <div className={myStyle.title}>{title}</div>
          <div className={myStyle.childL}>{children}</div>
        </div>
      );
    case "topLeft":
      return (
        <div className={myStyle.topLeftTitleContainer}>
          <div className={myStyle.title}>{`${title} ${
            require ? "*" : ""
          } `}</div>
          <div className={myStyle.childL}>{children}</div>
        </div>
      );
  }
};

export default CustomArticle;
