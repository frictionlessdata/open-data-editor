import * as React from 'react'
import camelCase from 'lodash/camelCase'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Columns'
import VerticalTabs from '../../Parts/Tabs/Vertical'
import EditorHelp from '../../Parts/Editor/Help'
import Chart from './Sections/Chart'
import Channel from './Sections/Channel'
import { useStore } from './store'
import Transform from './Sections/Transform/Transform'

const LABELS = ['Chart', 'Channels', 'Transforms']

export default function Layout() {
  const theme = useTheme()
  const helpItem = useStore((state) => state.helpItem)
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <Box sx={{ height: theme.spacing(42) }}>
      <Columns spacing={3} layout={[9, 3]}>
        <VerticalTabs
          labels={LABELS}
          onChange={(index) => updateHelp(camelCase(LABELS[index]))}
        >
          <Chart />
          <Channel />
          <Transform />
        </VerticalTabs>
        <EditorHelp helpItem={helpItem} />
      </Columns>
    </Box>
  )
}
