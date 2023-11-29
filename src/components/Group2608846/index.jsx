import React from "react";
import AddEmbedCodeInstead from "../AddEmbedCodeInstead";
import styled from "styled-components";
import { RobotoNormalWhite16px, ValignTextMiddle } from "../styledMixins";


function Group2608846(props) {
  const { className } = props;

  return (
    <Group26088461 className={`group-2608846 ${className || ""}`}>
      <OverlapGroup className="overlap-group-3">
        <DontHaveAnAccoun className="dont-have-an-accoun">
          <span>
            <span className="span0 roboto-normal-licorice-16px">
              Don’t have an account yet or forgot your password?{" "}
            </span>
            <span className="span1 roboto-normal-licorice-16px-2">
              Contact&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              m
            </span>
          </span>
        </DontHaveAnAccoun>
        <AddEmbedCodeInstead />
      </OverlapGroup>
    </Group26088461>
  );
}

const Group26088461 = styled.div`
  display: flex;
  align-items: flex-start;
  min-width: 442px;

  &.group-2608846.group-2608846-1 {
    margin-right: 4px;
  }
`;

const OverlapGroup = styled.div`
  width: 440px;
  height: 75px;
  position: relative;
`;

const DontHaveAnAccoun = styled.p`
  ${ValignTextMiddle}
  ${RobotoNormalWhite16px}
            position: absolute;
  width: 433px;
  height: 75px;
  top: 0;
  left: 0;
  text-align: right;
  letter-spacing: 0.5px;
  line-height: 24px;
`;

export default Group2608846;
