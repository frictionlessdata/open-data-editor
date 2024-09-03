import * as React from 'react'
import noop from 'lodash/noop'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import CheckIcon from '@mui/icons-material/Check'
import HistoryIcon from '@mui/icons-material/History'
import IconButton from '../../Parts/Buttons/Icon'
import Columns from '../Grids/Columns'
import LightTooltip from '../Tooltips/Light'
import { useKeyPress } from 'ahooks'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'

export interface ActionBarProps {}

export function ActionBar(props: React.PropsWithChildren<ActionBarProps>) {
  return (
    <Toolbar
      disableGutters
      sx={{ borderTop: 'solid 1px #ddd', backgroundColor: '#fafafa', paddingX: 2 }}
    >
      <ActionBarItems {...props} />
    </Toolbar>
  )
}

function ActionBarItems(props: React.PropsWithChildren<ActionBarProps>) {
  return <Columns spacing={2}>{props.children}</Columns>
}

export interface ButtonProps {
  label?: string
  color?: 'success' | 'warning' | 'error' | 'info'
  updated?: boolean
  disabled?: boolean
  onClick?: () => void
}

export function SaveAsButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  let title = 'Save to another location [Ctrl+J]'
  if (props.disabled) title = 'Saving to another location is not available'
  useKeyPress(['ctrl.j'], (event) => {
    event.preventDefault()
    if (!props.disabled) {
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          label={props.label || 'Save Changes'}
          Icon={SaveAltIcon}
          variant="outlined"
          disabled={props.disabled}
          onClick={() => onClick()}
          sx={{ backgroundColor: 'white', color: (theme) => theme.palette.OKFNCoolGray.main, borderColor: (theme) => theme.palette.OKFNCoolGray.main, '&:hover': {
            borderColor: (theme) => theme.palette.OKFNCoolGray.main
          } }}
        />
      </Box>
    </LightTooltip>
  )
}

export function PublishButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  let title = 'Publish on the web [Ctrl+K]'
  if (props.disabled) title = 'Publishing on the web is not available'
  useKeyPress(['ctrl.k'], (event) => {
    event.preventDefault()
    if (!props.disabled) {
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          label={props.label || 'Publish'}
          Icon={ElectricBoltIcon}
          variant="outlined"
          disabled={props.disabled}
          onClick={() => onClick()}
          sx={{ backgroundColor: 'white', textTransform: 'none', color: (theme) => theme.palette.OKFNCoolGray.main, borderColor: (theme) => theme.palette.OKFNCoolGray.main, '&:hover': {
            borderColor: (theme) => theme.palette.OKFNCoolGray.main
          }  }}
        />
      </Box>
    </LightTooltip>
  )
}

export function RevertButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  let title = 'Revert the changes [Ctrl+Q]'
  if (!props.updated) title = 'No changes to revert'
  useKeyPress(['ctrl.q'], (event) => {
    event.preventDefault()
    if (props.updated) {
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          label={props.label || 'Revert'}
          Icon={HistoryIcon}
          color={props.updated ? 'warning' : undefined}
          variant={props.updated ? 'contained' : 'outlined'}
          disabled={!props.updated}
          onClick={() => onClick()}
          sx={{ backgroundColor: !props.updated ? 'white' : undefined }}
        />
      </Box>
    </LightTooltip>
  )
}

export function SaveButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  let title = 'Save the changes [Ctrl+S]'
  if (!props.updated) title = 'No changes to save'
  useKeyPress(['ctrl.s'], (event) => {
    event.preventDefault()
    if (props.updated) {
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          label={props.label || 'Save changes'}
          Icon={CheckIcon}
          variant={props.updated ? 'contained' : 'outlined'}
          disabled={!props.updated}
          onClick={() => onClick()}
          sx={{ backgroundColor: !props.updated ? 'white' : undefined, textTransform: 'none' }}
        />
      </Box>
    </LightTooltip>
  )
}
