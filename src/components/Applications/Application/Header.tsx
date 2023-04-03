import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import SettingsIcon from '@mui/icons-material/Settings'
import GithubIcon from '@mui/icons-material/GitHub'
import HelpIcon from '@mui/icons-material/Help'
import Status from '../../Controllers/Status'
import { useStore } from './store'

export default function Header() {
  const theme = useTheme()
  const height = theme.spacing(8)
  const file = useStore((state) => state.file)
  const client = useStore((state) => state.client)
  return (
    <Box sx={{ height, flexGrow: 1 }}>
      <AppBar position="static" color="secondary" elevation={0}>
        <Toolbar disableGutters>
          <Grid container>
            <Grid item xs={4} lg={3}>
              <Typography
                variant="h5"
                sx={{ ml: 2, mt: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                <strong>
                  Frictionless Application{' '}
                  <Chip
                    size="small"
                    label="beta"
                    variant="outlined"
                    sx={{ color: 'white', borderRadius: 1 }}
                  />
                </strong>
              </Typography>
            </Grid>
            <Grid item xs={5} lg={7}>
              <Status file={file} client={client} />
            </Grid>
            <Grid item xs={3} lg={2}>
              <Grid container justifyContent="flex-end">
                <Button disabled title="Open Settings" color="inherit">
                  <SettingsIcon />
                </Button>
                <Button
                  title="Report Issue"
                  color="inherit"
                  href="https://github.com/frictionlessdata/application/issues"
                  target="_blank"
                >
                  <GithubIcon />
                </Button>
                <Button
                  title="Open Documentation"
                  color="inherit"
                  href="https://application.frictionlessdata.io"
                  target="_blank"
                >
                  <HelpIcon />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
