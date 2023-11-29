import { css } from "styled-components";

export const ValignTextMiddle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
export const RalignText = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

export const RobotoLightMerino50px = css`
  color: var(--merino);
  font-family: var(--font-family-roboto);
  font-size: var(--font-size-l);
  font-weight: 300;
  font-style: normal;
`;

export const RobotoMediumMerino20px = css`
  color: var(--merino-2);
  font-family: var(--font-family-roboto);
  font-size: var(--font-size-m);
  font-weight: 500;
  font-style: normal;
`;

export const RobotoNormalLicorice16px = css`
  color: var(--licorice);
  font-family: var(--font-family-roboto);
  font-size: var(--font-size-s);
  font-weight: 400;
  font-style: normal;
`;
