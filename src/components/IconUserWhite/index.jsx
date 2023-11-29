import React from "react";
import styled from "styled-components";
import { RobotoMediumWhite14px, ValignTextMiddle } from "../styledMixins";


function IconUserWhite() {
  return (
    <IconUserWhite1>
      <StateLayer>
        <Iconssettings24px>
          <MA>MA</MA>
        </Iconssettings24px>
      </StateLayer>
    </IconUserWhite1>
  );
}

const IconUserWhite1 = styled.div`
  display: flex;
  margin-top: -1px;
  flex-direction: column;
  width: fit-content;
  align-items: flex-start;
  gap: 10px;
  border-radius: 100px;
  overflow: hidden;
  border: 1px solid;
  border-color: var(--white);
`;

const StateLayer = styled.div`
  display: flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 8px;
  border: 1px none;
`;

const Iconssettings24px = styled.div`
  display: flex;
  min-width: 24px;
  height: 24px;
  border: 1px none;
`;

const MA = styled.div`
  ${ValignTextMiddle}
  ${RobotoMediumWhite14px}
            margin-top: -3.5px;
  width: 24px;
  height: 31px;
  text-align: center;
  letter-spacing: 0.5px;
  line-height: 24px;
`;

const IconUserWhite2 = styled.div`
  display: flex;
  margin-top: -1px;
  flex-direction: column;
  width: fit-content;
  align-items: flex-start;
  gap: 10px;
  border-radius: 100px;
  overflow: hidden;
  border: 1px solid;
  border-color: var(--white);
`;

const StateLayer1 = styled.div`
  display: flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 8px;
  border: 1px none;
`;

const Iconssettings24px1 = styled.div`
  display: flex;
  min-width: 24px;
  height: 24px;
  border: 1px none;
`;

const MA1 = styled.div`
  ${ValignTextMiddle}
  ${RobotoMediumWhite14px}
            margin-top: -3.5px;
  width: 24px;
  height: 31px;
  text-align: center;
  letter-spacing: 0.5px;
  line-height: 24px;
`;

export default IconUserWhite;
