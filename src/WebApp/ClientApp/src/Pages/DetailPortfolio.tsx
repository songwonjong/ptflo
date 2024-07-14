import React, { useEffect } from "react";
import Head from './MainPages/Head';
import '../styles.css'
import './MainPages/Common.css'
import myface from '../asset/img/profile/myface.jpg'
import beakyung from '../asset/img/beakyung.jpg'
import beakyung1 from '../asset/img/beakyung1.jpg'
import beakyung2 from '../asset/img/beakyung2.jpg'
import beakyung3 from '../asset/img/beakyung3.jpg'

interface Props {
    // portfolio: protflioType[];
}

const DetailPortfolio = ({ }: Props) => {

    useEffect(() => {
        window.scrollTo(0, 0);
    })

    return (
        <div>
            <Head />
            <body id="page-top" style={{
                backgroundImage: ` url(${beakyung1})`, backgroundAttachment: "fixed", backgroundSize: "cover"
                , backgroundPositionX: "center", fontFamily: 'Arita-dotum-Medium'
            }}>
                <header className="masthead  text-center" style={{ backgroundColor: "rgba( 255, 255, 255, 0.9 ) ", paddingBottom: "0.5rem" }}>
                    <div className="container  " style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", padding: " 0vw 8vw" }}>
                        <img src={beakyung3} style={{ width: "70%", marginRight: "1vw" }}></img>
                        <div style={{ fontSize: "20pt", }}>
                            이름 : 송원종<br />
                            나이 : 28세<br />
                            경력 : 3년3개월<br />
                            <div style={{ fontSize: "25pt", fontWeight: "bold", color: "rgb(45, 55, 85)" }}>
                                <br />
                                '잔잔한 호수같은<br /> 침착함의 소유자'
                                <br />
                                {/* '잔잔한 호수같은 침착함, 끈기, 끊기지 않는 호기심' */}
                            </div>
                            <div style={{ fontSize: "13pt" }}>
                                <br />
                                3년 경력의 풀스택 개발자입니다.<br />
                                공장관리 시스템인 MES 를 기반으로 한<br />
                                Web 개발 및 유지보수를 하였습니다.<br />
                                주로 많은 양의 데이터를 읽거나 다루면서
                                <br />Sql에 관한 스킬을 얻었으며<br />
                                데이터를 정리하고 고객의 요구사항에 맞춰
                                페이지를 만들기 위해 저는 TypeScript를 사용한 React를 포함하여 BootStrap, Css를
                                많이 사용하였고 자신있는 기술이 되었습니다.
                            </div>
                        </div>

                    </div>

                </header>
                <section className="page-section portfolio" id="portfolio" style={{ backgroundColor: "rgba( 255, 255, 255, 0.9 )", paddingTop: "2rem" }}>
                    <div className="container" style={{ padding: "0vw 8vw" }}>
                        <h3 className=" text-start text-uppercase text-secondary mb-0" style={{ color: "rgb(45, 55, 85)" }}>
                            강점
                        </h3>
                        저는 돌발상황에서 흔들리지 않습니다.<br />
                        이전 회사에서 갑작스럽게 프로젝트 기한이 줄어들거나 인원이 감축되어 예상치 못한 상황에 당면한적이 많았습니다.
                        이러한 경우 저는 기한내에 끝낼 수 있도록 침착하게 계획을 세워 보고한 후 프로젝트를 마감하였습니다.<br />
                        <br />저는 문제를 끝까지 해결하는 것을 좋아합니다. <br />
                        시작은 질문에 답변해줄 선임이 없어 직접 해결하였지만 저의 끈기는 그 과정을 즐기게 만들어 주었습니다.
                        시간적 문제로 야근을 하는 일이 잦았지만, 쌓인 경험들은 저의 자양분이 되었습니다.<br />
                        <br />끊기지 않는 호기심은 저의 가장 큰 강점입니다.<br />
                        이전 회사에 입사했을 당시 저는 Frontend개발자의 업무를 맡았고 그와 관련된 기술만 알고 있었습니다. 하지만 업무를 수행하면서 Backend와 SQL의 개발에 대해 호기심이 생겼고, 해당 업무 개발자에게 배우며 다른 기술들도 사용할 수 있게 되었습니다. 이후 저는 더 간단하게 코드를 작성할 수 있게 되었습니다.
                        <br />
                        <br />
                        <h3 className=" text-start text-uppercase text-secondary mb-0" style={{ color: "rgb(45, 55, 85)" }}>
                            관심있는 트렌드
                        </h3>
                        이직을 준비하게 되면서 저의 우선순위는 제가 장기근속 할 수 있는 기업을 찾는 것이었습니다.<br />
                        여러 가지 기업을 조사하며 지속가능한환경과 ESG 경영이라는 현대 기업들이 해결해야 할 가장 큰 과제에 대해 알게 되었습니다. 위 두 가지의 경영 트렌드는 비 재무적 성과를 띄고 있지만 고객의 선택을 받을 수 있다는 것이 가장 큰 핵심이라고 생각합니다.
                        현대 사회에서 미래에 기업이 살아남기 위해 지속가능한환경에 대한 개발과 ESG 경영은 필수적입니다.
                        제가 선호하는 기업은 지속 가능한 경영과 환경에 노력을 기울이는 현재 당면한 과제를 해결하기 위해 지속해서 방법론을 연구하는 기업입니다.
                        현대 기업들의 경영 트렌드를 빠르게 파악하고,
                        고객의 인식을 긍정적으로 바꾸는 지속 가능한 환경 방침이 있는 기업은 제가 꼭 입사하고 싶은 기업이 되었습니다.
                        <br />
                        <br />
                        <h3 className=" text-start text-uppercase text-secondary mb-0" style={{ color: "rgb(45, 55, 85)" }}>
                            첫 회사를 다니며 느낀점
                        </h3>

                        첫 취직 후 업무처리를 하며 가장 크게 느낀 점은
                        리팩토링과 코드의 재사용에 대한 중요성을 많이 느꼈던 것 같다.<br />
                        MES 라는 시스템을 기반으로 한 프로젝트들의 특성상
                        비슷한 페이지와 기능을 필요도하는 경우가 많았고,
                        같은 일을 두세 번 반복하는 경우가 많이 생겼다.
                        그러한 경우를 줄이기 위해 재사용을 쉽게하기 위한 리팩토링을 많이 했었고
                        주석을 자세하게 달아두려고 노력했다.
                        결과적으로 그것이 추가적인 요구사항에 대응하는 것에도 많은 이득을 주었다.
                        물론 처음 코딩을 할때부터 완벽한 코드를 짜는건 불가능 하겠지만 하나씩 수정하여
                        최대한 코드를 줄이고 다른 사람들이 봤을때도 깔끔하다는 생각이 드는 코드를 짜는것이
                        저의 목표가 되었습니다.

                        <br />
                        <br />
                        <h3 className=" text-start text-uppercase text-secondary mb-0" style={{ color: "rgb(45, 55, 85)" }}>
                            문제 해결 또는 갈등 극복 경험
                        </h3>
                        저는 대부분의 프로젝트의 개발을 혼자 했었습니다.<br />
                        그렇기 때문에 프로젝트 진행 시 PM과의 갈등만 있었습니다.
                        제가 프로젝트를 진행할 때 황당한 요청을 받았던 적이 있습니다.<br />
                        동일한 테이블을 사용하는 서로 다른 페이지 중에서 하나의 페이지만 데이터를 수정할 수 있는 조건을 삭제해달라는 요청사항 이였습니다.
                        해당 데이터는 다른 테이블과 밀접한 연관이 있었고 요청대로 진행할시 분명 문제가 발생할 것이라 예상하였습니다.<br />
                        저는 요청사항대로 코드를 수정할 수 없는 이유와 예시를 만들고 요청에 대해서
                        문제가 발생하지 않는 선에서 최대한으로 할 수 있는 변경사항을 확인하여 PM과 상의하였고
                        해당 설명을 들은 PM은 최대한의 변경을 하는 것으로 결정하여 문제를 방지할 수 있었습니다.
                    </div>
                </section>
            </body>

        </div>
    );
};

export default DetailPortfolio;
