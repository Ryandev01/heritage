import React from "react";
import styled from "styled-components";
import { RobotoNormalLicorice16px, ValignTextMiddle } from "../styledMixins";


function TextField(props) {
  const { children, className } = props;

  return (
    <TextField1 className={`text-field ${className || ""}`}>
      <Content className="content-1">
        <LabelText className="label-text-1">{children}</LabelText>
      </Content>
    </TextField1>
  );
}

const TextField1 = styled.div`
  width: 439px;
  height: 40px;
  margin-top: 28px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  background-color: var(--white);
  border-radius: 4px;
  border: 1px solid;
  border-color: var(--gray-nurse);

  &.text-field.text-field-1 {
    margin-top: 22px;
  }

  &.text-field.text-field-3 {
    margin-top: 22px;
  }

  &.text-field.text-field-4 {
    margin-left: 10px;
    margin-right: unset;
  }

  &.text-field.text-field-5 {
    margin-left: 10px;
    margin-top: 22px;
    margin-right: unset;
  }
`;

const Content = styled.div`
  margin-left: 16px;
  margin-right: 19px;
  flex: 1;
  display: flex;
  align-items: center;
  border: 1px none;
`;

const LabelText = styled.div`
  ${ValignTextMiddle}
  ${RobotoNormalLicorice16px}
            height: 56px;
  flex: 1;
  letter-spacing: 0.5px;
  line-height: 24px;
`;

export default TextField;
