import '@inovua/reactdatagrid-community/index.css'
import * as React from 'react'
import SpinnerCard from '../../Parts/Cards/Spinner'
import Box from '@mui/material/Box'
import InputDialog from '../../Parts/Dialogs/Input'
import Typography from '@mui/material/Typography'
import InovuaDatagrid from '@inovua/reactdatagrid-community'
import { TypeDataGridProps } from '@inovua/reactdatagrid-community/types'
import { TypeComputedProps } from '@inovua/reactdatagrid-community/types'
import { createColumns } from './columns'
import * as settings from './settings'
import * as types from '../../../types'
import debounce from 'lodash/debounce'
import './assets/styles.css'
import { useTheme } from '@mui/material/styles'

export type ITableEditor = TypeComputedProps | null
export interface TableEditorProps extends Partial<TypeDataGridProps> {
  source: types.ITableLoader | types.IRow[]
  schema: types.ISchema
  report?: types.IReport
  history?: types.IHistory
  selection?: types.ITableSelection
}

export default function TableEditor(props: TableEditorProps) {
  const { source, schema, report, history, selection, ...others } = props
  const [dialog, setDialog] = React.useState<IDialog | undefined>()

  const theme = useTheme()
  const colorPalette = theme.palette

  const columns = React.useMemo(
    () => createColumns(schema, report, history, selection, colorPalette),
    [schema, report, history, selection]
  )
  const [rowsPerPage, setRowsPerPage] = React.useState(20)

  const [rowHeight] = React.useState(40)

  React.useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      resizeTable()
    }, 300)

    const tableElement = document.querySelector('.InovuaReactDataGrid__column-layout')

    tableElement ? new ResizeObserver(debouncedHandleResize).observe(tableElement) : null

    return () => {
      tableElement
        ? new ResizeObserver(debouncedHandleResize).observe(tableElement)
        : null
    }
  })

  const renderColumnContextMenu = React.useCallback(
    (menuProps: { items: any[] }, context: any) => {
      menuProps.items = menuProps.items.filter((x) => x.label !== 'Columns' && x !== '-')
      menuProps.items.push({
        itemId: 'rename',
        label: 'Rename',
        disabled: history?.changes.length,
        onClick: () => {
          setDialog({
            type: 'columnRename',
            name: context.cellProps.name,
            index: context.cellProps.columnIndex,
          })
        },
      })
      return undefined
    },
    [history?.changes.length]
  )

  function resizeTable() {
    // using a query selector here and not a ref because the tableRef selects the whole
    // table including the bottom pagination bar, so we would still need to use a querySelector
    // for selecting the pagination bar to get its height
    // see: https://github.com/okfn/opendataeditor/pull/364#discussion_r1589574167
    const tableElement = document.querySelector('.InovuaReactDataGrid__column-layout')
    const tableHeight = tableElement?.clientHeight as number
    // - 1 because we dont include header row
    setRowsPerPage(Math.floor(tableHeight / rowHeight) - 1)
  }

  return (
    <>
      <ColumnRenameDialog dialog={dialog} onClose={() => setDialog(undefined)} />
      <InovuaDatagrid
        onReady={resizeTable}
        idProperty="_rowNumber"
        dataSource={source}
        columns={columns}
        pagination={true}
        loadingText={<Typography>Loading...</Typography>}
        renderLoadMask={LoadMask}
        defaultActiveCell={settings.DEFAULT_ACTIVE_CELL}
        style={{ height: '100%', border: 'none' }}
        limit={rowsPerPage}
        onLimitChange={setRowsPerPage}
        rowHeight={rowHeight}
        showColumnMenuLockOptions={false}
        showColumnMenuGroupOptions={false}
        enableColumnAutosize={false}
        renderColumnContextMenu={renderColumnContextMenu}
        {...others}
      />
    </>
  )
}

type IDialog = IColumnRenameDialog

type IColumnRenameDialog = {
  type: 'columnRename'
  name: string
  index: number
}

function ColumnRenameDialog(props: { dialog?: IDialog; onClose: () => void }) {
  if (props.dialog?.type !== 'columnRename') return null

  const [name, setName] = React.useState(props.dialog.name)

  return (
    <InputDialog
      open={true}
      value={name}
      description="Edit the column name"
      onChange={setName}
      title="Rename Column"
      onCancel={props.onClose}
      disabled={!name || name === props.dialog.name}
    />
  )
}

function LoadMask(props: { visible: boolean; zIndex: number }) {
  if (!props.visible) return null
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        opacity: 0.6,
        background: 'rgba(121, 134, 203, 0.25)',
        zIndex: props.zIndex,
      }}
    >
      <SpinnerCard message="Loading" />
    </Box>
  )
}
