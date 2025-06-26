import React, { useState } from "react";
import "./HomeComp.scss";
import Header from "../Header/Header";
import SideBar from "../SideBar/SideBar";
import MainPageComp from "../MainPageComp";

const HomeComp = () => {
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [activeChild, setActiveChild] = useState(null);

  const resetToHome = () => {
    setSelectedTitle(null);
    setSelectedChild(null);
    setActiveItem(null);
    setActiveChild(null);
  };

  const resetToTitle = () => {
    setSelectedChild(null);
    setActiveChild(null);
  };

  return (
    <div className="homeCompContaine">
      <Header />
      <div className="homeBody">
        <SideBar
          setSelectedTitle={setSelectedTitle}
          setSelectedChild={setSelectedChild}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          activeChild={activeChild}
          setActiveChild={setActiveChild}
          resetToHome={resetToHome}
          resetToTitle={resetToTitle}
        />
        <MainPageComp
          selectedTitle={selectedTitle}
          selectedChild={selectedChild}
          setSelectedTitle={setSelectedTitle} // Added
          setSelectedChild={setSelectedChild}
          resetToHome={resetToHome}
          resetToTitle={resetToTitle}
        />
      </div>
    </div>
  );
};

export default HomeComp;
