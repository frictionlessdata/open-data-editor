import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { IResource } from '../../interfaces'
import { Provider, makeStore } from './store'
import Actions from './Actions'
import Editor from './Editor'

// TODO: remove borderTop hack

export interface ResourceProps {
  descriptor?: IResource
  onCommit?: (descriptor: IResource) => void
  onRevert?: (descriptor: IResource) => void
}

export default function Resource(props: ResourceProps) {
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
