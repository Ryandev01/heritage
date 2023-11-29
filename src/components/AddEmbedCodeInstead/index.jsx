import React from "react";
import styled from "styled-components";
import { getSupportEmail } from "../../utils/storage/storage";
import { RobotoNormalLicorice16px2 } from "../styledMixins";


function AddEmbedCodeInstead() {
  return (
    <AddEmbedCodeInstead1>
      <AddEmbedCodeInstead2>{getSupportEmail() || ''}</AddEmbedCodeInstead2>
    </AddEmbedCodeInstead1>
  );
}

const AddEmbedCodeInstead1 = styled.div`
  position: absolute;
  width: 223px;
  height: 30px;
  top: 38px;
  left: 217px;
  display: flex;
  border: 1px none;
`;

const AddEmbedCodeInstead2 = styled.div`
  ${RobotoNormalLicorice16px2}
  flex: 1;
  width: 223px;
  letter-spacing: 0.5px;
  line-height: 24px;
`;

const AddEmbedCodeInstead3 = styled.div`
  position: absolute;
  width: 223px;
  height: 30px;
  top: 38px;
  left: 217px;
  display: flex;
  border: 1px none;
`;

const AddEmbedCodeInstead4 = styled.div`
  ${RobotoNormalLicorice16px2}
  flex: 1;
  width: 223px;
  letter-spacing: 0.5px;
  line-height: 24px;
`;

export default AddEmbedCodeInstead;
