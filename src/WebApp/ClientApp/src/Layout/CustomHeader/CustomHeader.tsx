import { observer } from "mobx-react";
import { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import ErrorBox from "../../components/ErrorBox";
import myStyle from "./CustomHeader.module.scss";
import img from "./DeajuLogo.png";
import loginImg from "./login.png";
import Clock from 'react-live-clock';
import CustomButton from "../../components/CustomButton/CustomButton";
import LoginPopup from "./LoginPopup";
import requestHandler from '../../components/RequestHandler/RequestHandler';
import { AxiosResponse } from "axios";
import Alert from "../../components/Alert";
import { ConfirmBox, CustomBox, CustomMsgBox } from "../../components/Alert/Alert";
import { useIsFocused } from '@react-navigation/native';
import { useNavigate } from "react-router-dom";
import MenuLink from "../../components/MenuLink";
import { viewerList, optimizerList, adminList, viewerListM, } from "../../utils/urls";
import viewerImg from "../../Image/2/viewer.png"
import optimizerImg from "../../Image/2/optimizer.png"
import adminImg from "../../Image/2/admin.png"
import ImgCustomButton from "../../components/ImgCustomButton";
import LoginImg from "../../Image/2/login.png";
import { Link } from "react-router-dom";
import moment from "moment";

interface Props {
  errors: any[];
}
interface CategoryData {
  name: string;
  icon?: string;
  link: JSX.Element;
}

const CustomHeader = ({ errors }: Props) => {
  const params = useParams();
  const { builing, floor, equipment, equipNum } = params;
  let location = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  var logFlag = localStorage.getItem("user-Info")?"LogOut":"LogIn";

  const [userInfo, setUserInfo] = useState<any>();

  useEffect(() => {
    const userinfo = localStorage.getItem("user-Info");
    if(typeof userinfo === 'string'){
      setUserInfo(JSON.parse(userinfo))
    }
  }, []);
  useEffect(() => {
    // handleMouseClick;
    logFlag = localStorage.getItem("user-Info")?"LogIn":"LogOut";
    
  }, []);
  
  const [popupOpen, setPopupOpen] = useState(false);
  
  const openPopup = () => {
    if(localStorage.getItem("user-Info")){
      //로그아웃 해야함
      CustomMsgBox("로그아웃 하시겠습니까?", (yn: boolean) => {
        if (!yn) return;
        localStorage.removeItem("auth-token");
        localStorage.removeItem("user-Info");
        localStorage.removeItem("user-auth");
        navigate("/");
        window.location.reload();
      })
    }else{
      setPopupOpen(true);
    }
    
  };
  const closePopup = () => {
    setPopupOpen(false);
  };

  const searchParam = useRef<any>();

  const authMenu = (userId : string) => {
    searchParam.current = {
      userId : userId
    };
    requestHandler<any>("get", "/User/menuauth", searchParam.current).then((result) => {
      if(result.data){
        localStorage.setItem(
          "user-auth",
          JSON.stringify(result.data)
        );
      }
      closePopup();
      window.location.reload();
    });
  };
  

  const setLogin = (e:any) => {

    // JWT => Auth Logic 구현 안되어 있음
    requestHandler<AxiosResponse<any>>("post", "/user/login", {
      corpCode: "DJ",
      userId: e.userid,
      userPwd: e.password,
    }).then((result: any) => {
      // return;
      if (result.data.passwordchk != 1){
        CustomBox("패스워드가 잘못되었습니다.");
      }else if (result.data) {
        const user = result.data;
        localStorage.setItem("auth-token", user.token);
        localStorage.setItem("menu-auth", JSON.stringify(user.menuAuthDic));
        localStorage.setItem(
          "user-Info",
          JSON.stringify({ userId: user.userId, userAuth: user.userAuth, userNm: user.userNm })
        );

        authMenu(user.userId);
        LogInsert({
          user_id:user.userId,
          eventtime:  moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          eventname: "로그인",
          eventurl: "로그인"
        })
        // CustomBox("로그인하였습니다.");
        // onChange(true);
        // close();
      } else {
        alert("아이디 또는 패스워드가 잘못되었습니다.");
      }
    });
  
  };

  
  const cateGoryList: CategoryData[] = [
    {
      name: "Viewer",
      link: <MenuLink category="Viewer" list={viewerListM} key={"Viewer"} />,
      icon: viewerImg,
    },
    {
      name: "Optimizer",
      link: <MenuLink category="Optimizer" list={optimizerList} key={"Optimizer"} />,
      icon: optimizerImg,
    },
    {
      name: "Admin",
      link: <MenuLink category="admin" list={adminList} key={"admin"} />,
      icon: adminImg,
    },
  ]

  const [isOpen, setOpen] = useState<boolean>(false);
  const [menuLink, setMenuLink] = useState("Main");
  const [pageTitle, setPageTitle] = useState("Main");

  const handleMouseEnter = () => {
    setOpen(true);
  };
  const handleMouseLeave = () => {
    setOpen(false);
  };
  const handleMouseClick = (e: any) => {
    // 추후 대메뉴(현황분석, 이력관, 시스템관리 추가)
    LogInsert({
      user_id:userInfo ? userInfo.userId:"Guest",
      eventtime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      eventname: e.target.innerText,
      eventurl: e.target.innerText
    })
    setMenuLink(e.target.innerText);
    // setPageTitle("")
  };

  // userAuth
  return (
    <div className={myStyle.container}>
      <div>
      <div className={myStyle.menuGuide}>
        <span onClick={()=>{navigate("/")}} style={{cursor:"pointer"}}>
          <img src={img} alt="대주전자재료" onClick={()=>{navigate("/")}} style={{width:"55px", height:"55px", marginLeft:"20px"}}/>
        </span>
        <div onClick={()=>{navigate("/")}} style={{display:"flex", flexDirection:"column", marginLeft:"10px"}}>
          <span style={{fontSize:"30px", cursor:"pointer"}}>
          DAEJOO
        </span>
        <span style={{fontSize:"30px", cursor:"pointer"}}>
          Smart Factory
          </span>
        </div>
      {/* <a className={myStyle.imageWrapper} href="/">
        <img src={img} alt="대주전자재료" onClick={()=>{navigate("/")}}/>
      </a> */}
          <div
            className={myStyle.menuLabelBox}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {cateGoryList.map((val, idx) => (
              val.name !== 'Admin'?
              <span className={myStyle.menuimg} key={`category_${idx}`}>
                <img src={val.icon} style={{height:"45px"}}></img>&nbsp;{val.name}
              </span>
              : 
              userInfo  ?
              <span className={myStyle.menuimg} key={`category_${idx}`}>
                <img src={val.icon} style={{height:"45px"}}></img>&nbsp;{val.name}
              </span>
              :
              null
            ))}
          </div>
          <div className={myStyle.menuDept}>
          <ImgCustomButton
            type="submit"
            onClick={() => openPopup()}
            color={"primary"}
            img={LoginImg}
            text={logFlag}
          />
          </div>
      </div>
      <div
        className={`${myStyle.contentMap}  ${
          isOpen ? myStyle.contentMapOpen : ""
          // myStyle.contentMapOpen
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleMouseClick}
      >
        <span className={myStyle.manuLinkTitle}>메뉴 리스트</span>
        <div className={myStyle.menuLinkList}>
          {cateGoryList.map((d) => {
            if(d.name ==='Admin'){
              if(userInfo ){
                return d.link;  
              } 
            }else{
              return d.link;
            }
          
          })}
        </div>
        <span style={{width:"8%"}}></span>
      </div>
        <LoginPopup
          open={popupOpen}
          close={closePopup}
          eventHandler={(e) => {setLogin(e)}}
        />
        {/* <div className={myStyle.alarm}>
          {errors?.reverse().map((i: any, idx: number) =>
            idx > 3 ? null : (
              <div key={idx} className={myStyle.err}>
                <ErrorBox where="errorInHeader" value={i} />
              </div>
            )
          )}
        </div> */}
      </div>
    </div>
  );
};
export default CustomHeader;

  // LogInsert
  export const LogInsert = (e:any) => {
    const searchParam = {
      user_id:e.user_id,
      eventtime:e.eventtime,
      eventname:e.eventname,
      eventurl:e.eventurl,
    };
    requestHandler<any>("put", "/Admin/LogInsert", searchParam).then((result) => {      
    });
  }