import React from "react";
import TextField from "../TextField";
import Button from "../Button";

import TextInput from '../TextInput';
import styled from "styled-components";
import { RobotoMediumBlack30px, RobotoNormalLicorice16px3, ValignTextMiddle } from "../styledMixins";

type Group2608847Props = {
  className?: any, textField1Props: any, textField2Props: any
}

function Group2608847(props: Group2608847Props) {
  const { className, textField1Props, textField2Props } = props;

  return (
    <Group26088471 className={`group-2608847 ${className || ""}`}>
      <SignInToNeomHeritage className="sign-in-to-neom-heritage">SIGN IN TO NEOM HERITAGE</SignInToNeomHeritage>
      <EnterYourDetailsBelow className="enter-your-details-below">Enter your details below</EnterYourDetailsBelow>
      <TextInput label={textField1Props.children} />
      <TextInput label={textField2Props.children} type='password' />
      <Button label="SIGN IN" />
    </Group26088471>
  );
}

const Group26088471 = styled.div`
  width: 450px;
  position: relative;
  align-self: center;
  margin-top: 214px;
  margin-left: 16.5px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-height: 372px;

  &.group-2608847.group-2608847-1 {
    margin-top: 345px;
    align-self: unset;
    margin-left: unset;
  }
`;

const SignInToNeomHeritage = styled.div`
  ${ValignTextMiddle}
  ${RobotoMediumBlack30px}
            width: 435px;
  height: 126px;
  margin-right: 4px;
  letter-spacing: 5px;
`;

const EnterYourDetailsBelow = styled.div`
  ${ValignTextMiddle}
  ${RobotoNormalLicorice16px3}
            height: 20px;
  margin-bottom: -4px;
  align-self: flex-start;
  margin-top: 11px;
  margin-left: 11.5px;
  letter-spacing: 0.5px;
  line-height: 24px;
  white-space: nowrap;
`;

export default Group2608847;
