import * as React from 'react'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'

// TODO: clean the code up

interface ExportButtonProps {
  format: string
  options: string[]
  isPreview?: boolean
  onPreview?: () => void
  onExport: () => void
  setFormat: (format: string) => void
  variant?: 'outlined' | 'contained'
}

export default function ExportButton(props: ExportButtonProps) {
  const variant = props.variant || 'contained'
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  // Handle

  const handleMenuItemClick = (
    _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index)
    setOpen(false)
    props.setFormat(props.options[index])
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }
    setOpen(false)
  }

  // Render

  return (
    <React.Fragment>
      <ButtonGroup
        fullWidth
        color="info"
        variant={variant}
        ref={anchorRef}
        aria-label="split button"
      >
        <Button
          onClick={() => props.onExport()}
          sx={{ width: '60%' }}
          title={`Export as ${props.options[selectedIndex].toUpperCase()}`}
        >
          Export
        </Button>
        <Button
          sx={{ width: '30%' }}
          color={props.isPreview ? 'warning' : 'info'}
          title={
            props.onPreview
              ? `Preview as ${props.options[selectedIndex].toUpperCase()}`
              : 'Change format'
          }
          onClick={() => (props.onPreview || handleToggle)()}
        >
          {props.options[selectedIndex]}
        </Button>
        <Button
          size="small"
          sx={{ width: '10%' }}
          title="Change format"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement="top-end"
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {props.options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option.toUpperCase()}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  )
}
