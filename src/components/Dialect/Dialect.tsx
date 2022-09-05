import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { IDialect } from '../../interfaces'
import { Provider, makeStore } from './store'
import Actions from './Actions'
import Editor from './Editor'

// TODO: remove borderTop hack

export interface DialectProps {
  descriptor?: IDialect
  onCommit?: (descriptor: IDialect) => void
  onRevert?: (descriptor: IDialect) => void
}

export default function Dialect(props: DialectProps) {
  const theme = useTheme()
  return (
    <Provider createStore={() => makeStore(props)}>
      <Box sx={{ height: theme.spacing(56) }}>
        <Box sx={{ height: theme.spacing(48), borderTop: 'solid 1px white' }}>
          <Editor />
        </Box>
        <Box sx={{ height: theme.spacing(8) }}>
          <Actions />
        </Box>
      </Box>
    </Provider>
  )
}
