import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  // color: theme.palette.getContrastText(grey[500]),
  borderRadius: 100,
  fontSize: 12,
  letterSpacing: 2,
  textAlign: 'center',
  padding: '10px, 24px, 10px, 24px',
  height: 40,
  '&:hover': {
    opacity: 0.8
  },
  '&:disabled': {
    opacity: 0.8,
    cursor: 'not-allowed',
    pointerEvents: 'all'
  },
}));

type CustomButtonProps = {
  label: string | ''
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
  className?: string,
  StartIcon?: any,
  colors?: Array<string>,
  style?:  React.CSSProperties | undefined
  type?: 'submit' | 'reset' | 'button'
  variant?: 'outlined' | 'contained' | 'text'
}

export default function CustomizedButtons(props: CustomButtonProps) {
  const { label, disabled, onClick, className, 
    StartIcon, colors, style,
    type,
    variant
   } = props;
  return (
    <Stack spacing={2} direction="row" >
      <ColorButton className={className ? className : ''}
        onClick={onClick} disabled={disabled} variant={variant || "contained"}
        startIcon={StartIcon ? <StartIcon /> : null}
        type={type ? type : 'button'}
        style={{
          backgroundColor: colors ? colors[0] : '#13100DE5',
          color: colors ? colors[1] : '#fff',
          boxShadow: colors ? colors[2] : 'initial',
          ...style
        }}
      >
          { label }
        </ColorButton>
      </Stack >
  );
}
