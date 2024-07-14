import './popup.css';
import { useEffect, useState } from 'react';
import requestHandler from '../../components/RequestHandler/RequestHandler';
import { AxiosResponse } from "axios";
// import './LoginPopup.scss';

type loginValue = {
  id: string;
  password: string;
};
const LoginPopup = (props: {
  open?: any;
  close: () => void;
  children?: any;
  eventHandler: (row: any) => void;
}) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open, close } = props;


  useEffect(() => {
  }, []);


  const popupParams = ()=>{
    // close();
    props.eventHandler(loginValue);
  }

  const [loginValue, setLoginValue] = useState<loginValue>({
    id: "",
    password: "",
  });

  const handleKeyPress = (e:any) => {
    if(e.key === 'Enter') {
      popupParams();
    }
  }

  const inputValue = (e: any) => {
    const { name, value } = e.target;
    setLoginValue({
      ...loginValue,
      [name]: value,
    });
  };
  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open ? 'openModal modal1' : 'modal'}>
      {open ? (
        <section>
          <header>
            로그인
            <button className="close" onClick={close}>
              &times;
            </button>
          </header>
          <main>
            <div className='popupDiv1'>
              <div>
                사용자명
                <input
                  className='popupInput'
                  placeholder='사용자명'
                  // value={loginValue.id}
                  name='userid'
                  onChange={(e)=>{inputValue(e)}}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div>
                비밀번호
                <input
                  className='popupInput'
                  placeholder='비밀번호'
                  type='password'
                  name='password'
                  onChange={(e)=>{inputValue(e)}}
                  onKeyPress={handleKeyPress}
                  // value={loginValue.password}
                />
              </div>
            </div>
          </main>
          <footer>
            <button className='popupBtn' onClick={popupParams}>
              확인
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};

export default LoginPopup;
