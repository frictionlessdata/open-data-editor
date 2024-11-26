import welcomescreenImg from '@client/assets/welcomescreen.png'
import * as store from '@client/store'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Link from '@mui/material/Link'
import { styled, useTheme } from '@mui/material/styles'
import * as React from 'react'
import SimpleButton from '../../Parts/Buttons/SimpleButton'
import { useTranslation, Trans } from 'react-i18next'

export default function WelcomeBanner() {
  const hideWelcomeScreen = store.useStore((state) => state.hideWelcomeScreen)

  const [checked, setChecked] = React.useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked) // this is to be replaced by the store.
  }

  const handleGetStarted = () => {
    store.setHideWelcomeScreen(checked)
    store.closeDialog()
  }

  const theme = useTheme()

  const { t } = useTranslation()

  const StyledButton = styled(SimpleButton)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '18px 0',
    lineHeight: 1.5,
    backgroundColor: theme.palette.OKFNBlack.main,
    '&:hover': {
      backgroundColor: theme.palette.OKFNBlue.main,
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#00D1FF',
    },
    '&:focus': {
      boxShadow: '0 0 0 0 rgba(0,123,255,.5)',
    },
  })

  return (
    <Dialog open={!hideWelcomeScreen} sx={{ margin: '0', padding: '0' }}>
      <DialogContent
        sx={{
          padding: '0',
          paddingTop: '0',
          paddingLeft: '0',
          marginRight: '0',
          paddingRight: '0',
          marginBottom: '0',
          paddingBottom: '0',
        }}
      >
        <Box sx={{ backgroundColor: '#F3F4F6', padding: '56px 52px' }}>
          <img src={welcomescreenImg} alt="Welcome Screen" />
        </Box>
        <Box sx={{ padding: '32px' }}>
          <Box
            sx={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1D1916',
              paddingBottom: '20px',
            }}
          >
            <div>{t('welcome-to-ODE')}</div>
          </Box>
          <Box
            sx={{
              fontSize: '18px',
              color: '#6B7380',
              fontWeight: '400',
              whiteSpace: 'pre-wrap',
            }}
          >
            <div>
              <Trans i18nKey="welcomebanner-description" components={{ 1: <small /> }} />
              <b>
                {' '}
                <Link
                  href="https://blog.okfn.org/"
                  target="_blank"
                  color="inherit"
                  underline="none"
                >
                  {t('link-check-blog')}
                </Link>
              </b>
            </div>
          </Box>
          <Box
            sx={{
              marginTop: '48px',
            }}
          >
            <StyledButton
              fullWidth
              label={t('get-started')}
              sx={{ my: 0.5 }}
              onClick={handleGetStarted}
              variant="contained"
              aria-label="accept"
            />
          </Box>
          <Box
            sx={{
              textAlign: 'center',
              fontSize: '12px',
              color: (theme) => theme.palette.OKFNCoolGray400.main,
              marginTop: '24px',
            }}
          >
            <Checkbox
              sx={{
                color: '#4C5564',
                '&.Mui-checked': {
                  color: '#4C5564',
                },
              }}
              checked={checked}
              onChange={handleChange}
            />{' '}
            {t('welcomebanner-dont-show-again')}
          </Box>
          <Box sx={{ textAlign: 'center', fontSize: '12px', color: '#BBB' }}>
            {t('powered-by-frictionless')}{' '}
            <Link href="https://frictionlessdata.io/" target="_blank" underline="none">
              Frictionless
            </Link>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
