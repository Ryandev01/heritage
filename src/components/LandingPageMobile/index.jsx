import React from "react";
import SearchField from "../SearchField";
import Frame2608168 from "../Frame2608168";
import Frame2608169 from "../Frame2608169";
import Frame2608170 from "../Frame2608170";
import Frame2608171 from "../Frame2608171";
import UserMenu from "../UserMenu";
import styled from "styled-components";
import "./LandingPageMobile.css";

function LandingPageMobile(props) {
  const { overlapGroup2, image2, icon, iconSettings } = props;

  return (
    <div className="container-center-horizontal">
      <div className="landing-page-mobile screen">
        <OverlapGroup2 style={{ backgroundImage: `url(${overlapGroup2})` }}>
          <Rectangle69></Rectangle69>
          <Frame2608173>
            <Image2 src={image2} alt="image 2" />
            <SearchField />
            <Inventory>
              <Frame2608168 />
              <Frame2608169 />
            </Inventory>
            <Inventory1>
              <Frame2608170 />
              <Frame2608171 />
            </Inventory1>
          </Frame2608173>
        </OverlapGroup2>
        <UserMenu />
        <Icon src={icon} alt="icon" />
        <IconSettings src={iconSettings} alt="icon-settings" />
      </div>
    </div>
  );
}

const OverlapGroup2 = styled.div`
  width: 834px;
  height: 1194px;
  z-index: 1;
  position: relative;
  background-size: cover;
  background-position: 50% 50%;
`;

const Rectangle69 = styled.div`
  position: absolute;
  width: 834px;
  height: 1194px;
  top: 0;
  left: 0;
  border: 1px none;
  mix-blend-mode: multiply;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.1899999976158142) 0%, rgb(0, 0, 0) 100%);
`;

const Frame2608173 = styled.div`
  position: absolute;
  width: 834px;
  top: 301px;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 532px;
  border: 1px none;
`;

const Image2 = styled.img`
  width: 72px;
  height: 93px;
  margin-left: 22px;
  object-fit: cover;
`;

const Inventory = styled.div`
  display: flex;
  position: relative;
  margin-top: 123px;
  width: 834px;
  align-items: center;
  justify-content: center;
  gap: 50px;
  border: 1px none;
`;

const Inventory1 = styled.div`
  display: flex;
  position: relative;
  margin-top: 52px;
  width: 834px;
  align-items: center;
  justify-content: center;
  gap: 50px;
  border: 1px none;
`;

const Icon = styled.img`
  position: fixed;
  width: 34px;
  height: 34px;
  top: 25px;
  left: 671px;
  z-index: 4;
`;

const IconSettings = styled.img`
  position: fixed;
  width: 40px;
  height: 40px;
  top: 24px;
  left: 716px;
  z-index: 3;
`;

export default LandingPageMobile;
