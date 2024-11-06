import Typography from '@mui/material/Typography'
import Button, { ButtonProps } from '@mui/material/Button'

interface SimpleButtonProps extends ButtonProps {
  label?: string
  small?: boolean
  hoverBgColor?: string
}

export default function SimpleButton(props: SimpleButtonProps) {
  const { label, hoverBgColor, ...others } = props

  const buttonTextColor = props.color === 'OKFNWhite' ? 'gray': 'white'
  return (
    <Button
      fullWidth={!props.small}
      color={props.color}
      {...others}
      sx={{ padding: '14px 24px', borderRadius: '9px', border: props.label === 'Cancel' ? '1px solid #D3D7D8' : 0, boxShadow: 'none', '&:hover': {
        backgroundColor: (theme) => (hoverBgColor === 'OKFNBlue' || hoverBgColor === 'OKFNRed400' )? theme.palette[hoverBgColor].main : 'unset'
      } }}
    >
      {(
        <Typography sx={{ textTransform: 'capitalize', fontWeight: 700, color: (theme) => props.disabled ? theme.palette.OKFNGray700.main : buttonTextColor, }}>
          {label}
        </Typography>
      )}
    </Button>
  )
}
