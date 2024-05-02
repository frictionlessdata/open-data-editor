import * as React from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import SimpleButton from '../Buttons/SimpleButton'
import Columns from '../Grids/Columns'

export interface NoteDialogProps {
  open?: boolean
  title?: string
  description?: string
  Icon?: React.ElementType
  label?: string
  maxWidth?: 'md' | 'xl'
  onConfirm?: () => void
  onCancel?: () => void
  ctrlEnter?: boolean
  children?: React.ReactNode
}

export default function NoteDialog(props: NoteDialogProps) {
  const handleCancel = () => props.onCancel && props.onCancel()
  const handleConfirm = () => props.onConfirm && props.onConfirm()
  return (
    <Dialog
      fullWidth
      maxWidth={props.maxWidth}
      open={!!props.open}
      onClose={handleCancel}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      onKeyDown={(event) => {
        if ((!props.ctrlEnter || event.ctrlKey) && event.key === 'Enter') handleConfirm()
      }}
    >
      <DialogTitle
        id="dialog-title"
        sx={{
          paddingBottom: 1,
          marginBottom: 2,
          borderBottom: 'solid 1px #ddd',
          backgroundColor: '#fafafa',
        }}
      >
        {props.title || 'Dialog'}
      </DialogTitle>
      <DialogContent sx={{ paddingTop: 0, paddingBottom: 0 }}>
        {props.description && (
          <Box sx={{ marginBottom: 1, opacity: 0.6 }}>{props.description}</Box>
        )}
        {props.children}
      </DialogContent>
      <Box sx={{ paddingX: 3, paddingY: 1 }}>
        <Columns spacing={2}>
          <SimpleButton
            fullWidth
            color="info"
            label={props.label || 'Confirm'}
            sx={{ my: 0.5 }}
            onClick={handleConfirm}
            aria-label="accept"
            variant="contained"
          />
        </Columns>
      </Box>
    </Dialog>
  )
}
