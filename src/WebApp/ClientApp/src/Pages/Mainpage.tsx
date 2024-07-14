import React, { useEffect, useState } from "react";
import Head from './MainPages/Head';
import Masthead from './MainPages/Masthead';
import Portfolio from './MainPages/Portfolio';
import About from './MainPages/About';
import Contact from './MainPages/Contact';
import Footer from './MainPages/Footer';
import TechStack from './MainPages/TechStack';

import '../styles.css'
import { MainPageInfoStore, protflioType } from "../stores/MainPageStore";
import { observer } from "mobx-react";
import Project from "./MainPages/Project";

const MainPage = observer(() => {
  // const [portfolioData, setPortfolioData] = useState<protflioType[]>([]);

  const { portfolio } = MainPageInfoStore;
  useEffect(() => {
    MainPageInfoStore.initStart();
    // setPortfolioData(MainPageInfoStore.portfolio);
  }, []);

  return (
    <div>
      <Head />
      <body id="page-top">
        {/* Navigation */}
        <Masthead />
        <Contact />
        <TechStack />
        <Project />
        {/* <Portfolio portfolio={portfolio} /> */}
        {/* <Footer /> */}
      </body>
    </div>
  );
});

export default MainPage;
