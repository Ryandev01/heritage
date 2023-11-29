import React from "react";
import styled from "styled-components";
import { RobotoNormalLicorice16px, ValignTextMiddle } from "../styledMixins";


function TextField3(props) {
  const { children, className } = props;

  return (
    <TextField className={`text-field-6 ${className || ""}`}>
      <Content className="content-2">
        <LabelText className="label-text-5">
          <span>
            <span className="spandvvel roboto-normal-licorice-16px">{children}</span>
          </span>
        </LabelText>
      </Content>
    </TextField>
  );
}

const TextField = styled.div`
  height: 40px;
  margin-top: 29px;
  display: flex;
  padding: 0 16px;
  align-items: flex-start;
  min-width: 439px;
  background-color: var(--white);
  border-radius: 4px;
  border: 1px solid;
  border-color: var(--gray-nurse);

  &.text-field-6.text-field-7 {
    margin-top: 22px;
  }

  &.text-field-6.text-field-9 {
    margin-top: 22px;
  }
`;

const Content = styled.div`
  margin-top: -8px;
  display: flex;
  align-items: flex-start;
  min-width: 404px;
  border: 1px none;
`;

const LabelText = styled.div`
  ${ValignTextMiddle}
  ${RobotoNormalLicorice16px}
            width: 404px;
  height: 56px;
  margin-top: -1px;
  letter-spacing: 0.5px;
  line-height: 24px;
`;

export default TextField3;
