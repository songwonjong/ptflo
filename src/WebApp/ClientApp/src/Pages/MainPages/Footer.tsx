// Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="footer text-center">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 mb-5 mb-lg-0">
                        <h4 className="text-uppercase mb-4">Mail</h4>
                        <p className="lead mb-0">thddnjswhd45@gmail.com
                            <br /> </p>
                    </div>
                    <div className="col-lg-4 mb-5 mb-lg-0">
                        <h4 className="text-uppercase mb-4">Around the Web</h4>
                        <ul className="list-inline mb-0">
                            <li className="list-inline-item">
                                <a className="btn btn-outline-light btn-social mx-1" href="#!"><i className="fab fa-fw fa-facebook-f"></i></a>
                            </li>
                            <li className="list-inline-item">
                                <a className="btn btn-outline-light btn-social mx-1" href="#!"><i className="fab fa-fw fa-twitter"></i></a>
                            </li>
                            <li className="list-inline-item">
                                <a className="btn btn-outline-light btn-social mx-1" href="#!"><i className="fab fa-fw fa-linkedin-in"></i></a>
                            </li>
                            <li className="list-inline-item">
                                <a className="btn btn-outline-light btn-social mx-1" href="#!"><i className="fab fa-fw fa-dribbble"></i></a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-lg-4">
                        <h4 className="text-uppercase mb-4">About Freelancer</h4>
                        <p className="lead mb-0">Freelance is a free to use, MIT licensed Bootstrap theme created by <a href="http://startbootstrap.com">Start Bootstrap</a>.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;