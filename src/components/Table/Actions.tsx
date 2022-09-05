import * as React from 'react'
import excel from 'xlsx'
import csv from 'papaparse'
import FileSaver from 'file-saver'
import Button from '@mui/material/Button'
import ExportButton from '../Library/Buttons/ExportButton'
import Columns from '../Library/Columns'
import { useStore } from './store'

export default function Actions() {
  return (
    <Columns spacing={3} layout={[3, 9]}>
      <Columns spacing={3}>
        <Export />
        <Source />
        <Report />
        <Errors />
      </Columns>
    </Columns>
  )
}

function Export() {
  const name = useStore((state) => state.name)
  const table = useStore((state) => state.table!)
  const [format, setFormat] = React.useState('csv')
  // TODO: move to store
  const handleExport = () => {
    if (format === 'csv') {
      const text = csv.unparse(table.rows)
      const blob = new Blob([text], { type: 'text/csv;charset=utf-8' })
      FileSaver.saveAs(blob, `${name}.csv`)
    } else if (format === 'xlsx') {
      const wb = excel.utils.book_new()
      const ws = excel.utils.json_to_sheet(table.rows)
      excel.utils.book_append_sheet(wb, ws)
      const bytes = excel.write(wb, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([bytes], { type: 'application/octet-stream' })
      FileSaver.saveAs(blob, `${name}.xlsx`)
    }
  }
  return (
    <ExportButton
      format={format}
      options={['csv', 'xlsx']}
      onExport={handleExport}
      setFormat={setFormat}
      variant="contained"
    />
  )
}

function Source() {
  const isSourceView = useStore((state) => state.isSourceView)
  const toggleSourceView = useStore((state) => state.toggleSourceView)
  return (
    <Button
      fullWidth
      variant="contained"
      title="Toogle source view"
      color={isSourceView ? 'warning' : 'info'}
      onClick={() => toggleSourceView()}
    >
      Source
    </Button>
  )
}

function Report() {
  const report = useStore((state) => state.report)
  const isReportView = useStore((state) => state.isReportView)
  const toggleReportView = useStore((state) => state.toggleReportView)
  if (!report) return null
  return (
    <Button
      fullWidth
      variant="contained"
      title="Toggle report view"
      color={isReportView ? 'warning' : report.valid ? 'success' : 'error'}
      onClick={() => toggleReportView()}
    >
      Report ({report.valid ? 'Valid' : 'Invalid'})
    </Button>
  )
}

function Errors() {
  const report = useStore((state) => state.report)
  const isErrorsView = useStore((state) => state.isErrorsView)
  const toggleErrorsView = useStore((state) => state.toggleErrorsView)
  if (!report) return null
  return (
    <Button
      fullWidth
      variant="contained"
      title="Toggle errors view"
      color={isErrorsView ? 'warning' : report.valid ? 'success' : 'error'}
      onClick={() => toggleErrorsView()}
    >
      Errors ({report.stats.errors})
    </Button>
  )
}
