import { useEffect } from "react";
import modalStyle from "./ModalBase.module.scss";

const ModalBase = (props: {
  title?: string;
  onCloseClick?: () => void;
  children?: any;
  size?: "small" | "medium" | "wide";
}) => {
  useEffect(() => {
    document.addEventListener(
      "keyup",
      (event) => {
        if (event.key !== "Escape") return;
        props.onCloseClick!();
      },
      false
    );
  }, []);

  return (
    <div className={modalStyle.modal}>
      <div className="container">
        <div className="header">
          <h4>{props.title}</h4>
          <span onClick={props.onCloseClick}>&times;</span>
        </div>
        <div className="body">{props.children}</div>
      </div>
    </div>
  );
};
export default ModalBase;
