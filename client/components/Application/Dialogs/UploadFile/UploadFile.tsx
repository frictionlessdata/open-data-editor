import uploadFilesDialogImg from '@client/assets/dialog_upload_files.png'
import iconUploadFolderImg from '@client/assets/folder-open-big-plus.png'
import iconLinkTextField from '@client/assets/icon_link_textfield.svg'
import iconUploadFileImg from '@client/assets/icon_upload_file.png'
import DialogTabs from '@client/components//Parts/Tabs/Dialog'
import SimpleButton from '@client/components/Parts/Buttons/SimpleButton'
import Columns from '@client/components/Parts/Grids/Columns'
import { LinearProgress } from '@client/components/Progress'
import * as appStore from '@client/store'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { styled, useTheme } from '@mui/material/styles'
import * as React from 'react'
import * as store from './store'

const TAB_LABELS = ['From your computer', 'Add external data']

export function UploadFileDialog() {
  const dialog = appStore.useStore((state) => state.dialog)
  const { progress } = store.useState()

  React.useEffect(() => {
    store.resetState()
  }, [dialog])

  return (
    <Dialog
      fullWidth
      open={true}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      onClose={store.closeDialog}
    >
      <IconButton
        aria-label="close"
        onClick={store.closeDialog}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ paddingTop: 0, paddingBottom: '82px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '74px',
            paddingBottom: '33px',
          }}
        >
          <img src={uploadFilesDialogImg} alt="Image Folder Dialog" />
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <DialogTabs
            labels={TAB_LABELS}
            disabled={progress?.blocking}
            onChange={store.resetState}
          >
            <Stack spacing={2}>
              <Columns columns={2} spacing={4}>
                <LocalFileForm />
                <LocalFileForm isFolder />
              </Columns>
              <LinearProgress progress={progress} />
            </Stack>
            <Stack spacing={2}>
              <RemoteFileForm />
              <LinearProgress progress={progress} />
            </Stack>
          </DialogTabs>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

function LocalFileForm(props: { isFolder?: boolean }) {
  const theme = useTheme()
  const { progress } = store.useState()

  const borderColor = !progress?.blocking ? theme.palette.OKFNBlue.main : undefined
  const icon = props.isFolder ? iconUploadFolderImg : iconUploadFileImg
  const text = props.isFolder
    ? 'Add one or more folders'
    : 'Add one or more Excel or csv files'

  return (
    <Box>
      <FileSelectBox sx={{ ':hover': { borderColor } }}>
        <input
          type="file"
          multiple
          disabled={progress?.blocking}
          // @ts-expect-error
          webkitdirectory={props.isFolder ? '' : undefined}
          onChange={(ev) => {
            if (ev.target.files) {
              store.ingestFiles({ source: ev.target.files })
            }
          }}
        />
        <Box sx={{ padding: '32px 48px 24px 48px' }}>
          <Box>
            <img src={icon} alt="Icon Upload File" />
          </Box>
          <Box>{text}</Box>
          <StyledSelectBox
            className={!progress?.blocking ? 'file-select__button' : undefined}
          >
            Select
          </StyledSelectBox>
        </Box>
      </FileSelectBox>
    </Box>
  )
}

function RemoteFileForm() {
  const { progress } = store.useState()
  const [url, setUrl] = React.useState('')

  return (
    <Box>
      <Box sx={{ fontSize: '14px' }}>Link to the external table:</Box>
      <Box sx={{ display: 'flex' }}>
        <AddRemoteTextField
          value={url}
          invalid={progress?.type === 'error'}
          disabled={progress?.blocking}
          onChange={setUrl}
        />
      </Box>
      <SimpleButton
        label={'Add'}
        sx={{ my: 0.5, marginTop: '53px' }}
        variant="contained"
        aria-label="accept"
        hoverBgColor="OKFNBlue"
        color="OKFNBlack"
        disabled={!url}
        onClick={() => store.ingestFiles({ source: url })}
      />
    </Box>
  )
}

function AddRemoteTextField(props: {
  value?: string
  invalid?: boolean
  disabled?: boolean
  onChange(value: string): void
}) {
  return (
    <StyledTextField
      fullWidth
      size="small"
      autoFocus
      value={props.value || ''}
      disabled={props.disabled}
      error={props.invalid}
      placeholder="Enter or paste URL"
      helperText=" "
      onChange={(e) => props.onChange(e.target.value)}
      InputLabelProps={{
        sx: {
          fontSize: '14px',
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <img src={iconLinkTextField} alt="" />
          </InputAdornment>
        ),
        sx: {
          '& ::placeholder': {
            color: '#D1D4DB',
            opacity: 1, // otherwise firefox shows a lighter colorS
            fontSize: '14px',
          },
        },
      }}
    />
  )
}

const FileSelectBox = styled(Box)(() => ({
  border: '1px solid #E7E9E9',
  borderRadius: '8px',
  textAlign: 'center',
  color: '#717879',
  fontSize: '14px',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '& input': {
    position: 'absolute',
    height: '100%',
    width: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  ':hover .file-select__button': {
    backgroundColor: '#3F4345',
    color: 'white',
  },
}))

const StyledSelectBox = styled(Box)(() => ({
  marginTop: '28px',
  backgroundColor: '#FAFAFA',
  padding: '4px 10px',
  borderRadius: '4px',
  border: '0.5px solid #D3D7D8',
  lineHeight: '20px',
  boxShadow: '0px 0px 0px 0px rgba(0, 0, 0, 0.25)',
}))

// TODO: move to the common library
const StyledTextField = styled(TextField)(() => ({
  marginTop: '8px',
  fontSize: '14px',
  '& label.Mui-focused': {
    color: '#00D1FF',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#00D1FF',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'gray',
    },
    '&:hover fieldset': {
      borderColor: '#00D1FF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#00D1FF',
    },
  },
}))
