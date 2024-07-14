import React from 'react';
import black from '../../asset/img/newPtflo/black-link.png';
import calendar from '../../asset/img/newPtflo/calendar-fill.svg';
import envelope from '../../asset/img/newPtflo/envelope-fill.svg';
import geoalt from '../../asset/img/newPtflo/geo-alt-fill.svg';
import pencil from '../../asset/img/newPtflo/pencil-fill.svg';
import person from '../../asset/img/newPtflo/person-fill.svg';
import telephone from '../../asset/img/newPtflo/telephone-fill.svg';

const Contact: React.FC = () => {
    return (
        <article className="AboutMe_AboutMe" id="about-me">
            <div className="AboutMe_content">
                <div className="SectionTitle_SectionTitle">
                    <div className="SectionTitle_text" style={{ color: "#000000", borderBottomColor: "#cccccc" }}>ABOUT ME</div>
                    <div className="SectionTitle_link-wrapper">
                        <img className="SectionTitle_link" src={black} alt="" />
                    </div>
                </div>
                <div className="AboutMe_basic-infos">
                    <div className="AboutMe_basic-info-wrapper">
                        <div className="AboutMe_basic-info">
                            <div className="AboutMe_icon-img-wrapper">
                                <img className="AboutMe_icon-img" src={person} alt="" />
                            </div>
                            <div className="AboutMe_field">
                                <div className="AboutMe_field-label">이름</div>
                                <div className="AboutMe_field-value">송원종</div>
                            </div>
                        </div>
                    </div>
                    <div className="AboutMe_basic-info-wrapper">
                        <div className="AboutMe_basic-info">
                            <div className="AboutMe_icon-img-wrapper">
                                <img className="AboutMe_icon-img" src={calendar} alt="" />
                            </div>
                            <div className="AboutMe_field">
                                <div className="AboutMe_field-label">생년월일</div>
                                <div className="AboutMe_field-value">95.04.13</div>
                            </div>
                        </div>
                    </div>
                    <div className="AboutMe_basic-info-wrapper">
                        <div className="AboutMe_basic-info">
                            <div className="AboutMe_icon-img-wrapper">
                                <img className="AboutMe_icon-img" src={geoalt} alt="" />
                            </div>
                            <div className="AboutMe_field">
                                <div className="AboutMe_field-label">주소지</div>
                                <div className="AboutMe_field-value">경기도 수원특례시</div>
                            </div>
                        </div>
                    </div>
                    <div className="AboutMe_basic-info-wrapper">
                        <div className="AboutMe_basic-info">
                            <div className="AboutMe_icon-img-wrapper">
                                <img className="AboutMe_icon-img" src={telephone} alt="" />
                            </div>
                            <div className="AboutMe_field">
                                <div className="AboutMe_field-label">연락처</div>
                                <div className="AboutMe_field-value">
                                    <a className="AboutMe_email" href="tel:010-2936-2584">010-2936-2584</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="AboutMe_basic-info-wrapper">
                        <div className="AboutMe_basic-info">
                            <div className="AboutMe_icon-img-wrapper">
                                <img className="AboutMe_icon-img" src={envelope} alt="" />
                            </div>
                            <div className="AboutMe_field">
                                <div className="AboutMe_field-label">이메일</div>
                                <div className="AboutMe_field-value">
                                    <a className="AboutMe_email" href="mailto:thddnjswhd45@gmail.com">thddnjswhd45@gmail.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="AboutMe_basic-info-wrapper">
                        <div className="AboutMe_basic-info">
                            <div className="AboutMe_icon-img-wrapper">
                                <img className="AboutMe_icon-img" src={pencil} alt="" />
                            </div>
                            <div className="AboutMe_field">
                                <div className="AboutMe_field-label">학력</div>
                                <div className="AboutMe_field-value">
                                    남서울대학교<br />(정보통신공학과)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="AboutMe_contact-description">
                    *  문의는 <br className="AboutMe_newline" />위 연락처/이메일로 부탁드립니다.
                </div>
            </div>
        </article>

    );
}

export default Contact;