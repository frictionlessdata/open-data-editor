import * as React from 'react'
import Box from '@mui/material/Box'
import Report from '../../../Parts/Report'
import { useStore } from '../store'

export default function ReportPanel() {
  const report = useStore((state) => state.report)
  if (!report) return null
  return (
    <Box>
      <Report report={report} />
    </Box>
  )
}
