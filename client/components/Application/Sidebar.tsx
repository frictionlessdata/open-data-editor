import Box from '@mui/material/Box'
import Browser from './Browser'
import LowerMenu from './LowerMenu'
import { useTheme } from '@mui/material/styles'
import sidebarLogo from '../../assets/ODE_sidebar_logo.svg'

export default function Sidebar() {
  const theme = useTheme()
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + 8)})`

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: 'solid 1px #ddd',
        width: '284px',
        padding: '24px',
      }}
    >
      <Box sx={{ height: '32px' }}>
        {' '}
        <img src={sidebarLogo} alt="" />
      </Box>
      <Box sx={{ height: contentHeight }}>
        <Browser />
      </Box>
      <LowerMenu />
    </Box>
  )
}
