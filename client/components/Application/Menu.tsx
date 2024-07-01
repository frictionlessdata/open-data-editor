import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import SelectField from '../Parts/Fields/Select'
import LightTooltip from '../Parts/Tooltips/Light'
import Columns from '../Parts/Grids/Columns'
import * as menu from '../Parts/Bars/Menu'
import * as store from '@client/store'

export default function Menu() {
  const folder = store.useStore((state) => state.config?.folder || '')
  const projectName = store.useStore((state) => state.config?.project.name)
  const name = projectName || folder.split(/[\\/]/g).slice(-1)[0] || ''

  // @ts-ignore
  const openDirectoryDialog = window?.opendataeditor?.openDirectoryDialog
  const handleOpen = async () => {
    if (!openDirectoryDialog) return
    const fullpath = await openDirectoryDialog()
    if (fullpath) await store.openProject(fullpath)
  }

  return (
    <menu.MenuBar fullWidth>
      <Columns layout={[9, 3]} spacing={1}>
        <SelectField
          margin="none"
          value={name}
          options={[name, folder]}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" disableTypography>
                Project:
              </InputAdornment>
            ),
          }}
        />
        <LightTooltip title="Select a new folder to open a project">
          <Button
            color="inherit"
            variant="outlined"
            fullWidth
            onClick={handleOpen}
            sx={{ height: '100%', borderColor: '#bbb !important' }}
          >
            Open
          </Button>
        </LightTooltip>
      </Columns>
    </menu.MenuBar>
  )
}
