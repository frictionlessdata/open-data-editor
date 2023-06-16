import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/AddBox'
import SourceIcon from '@mui/icons-material/Source'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import DropdownButton from '../../../Parts/Buttons/Dropdown'
import IconButton from '../../../Parts/Buttons/Icon'
import AddLink from '@mui/icons-material/AddLink'
import DriveFolderUploadRounded from '@mui/icons-material/DriveFolderUploadRounded'
import UploadFileRounded from '@mui/icons-material/UploadFileRounded'
import LightTooltip from '../../../Parts/Tooltips/Light'
import { useStore } from '../store'

export default function CreateButton() {
  return (
    <LightTooltip title="Upload or create new">
      <Box>
        <DropdownButton
          label="Create"
          variant="text"
          icon={<AddIcon fontSize="small" sx={{ mr: 1 }} />}
        >
          <UploadFile />
          <UploadLink />
          <UploadFolder />
          <CreateFolder />
          <CreatePackage />
        </DropdownButton>
      </Box>
    </LightTooltip>
  )
}

function UploadFile() {
  const createFiles = useStore((state) => state.createFiles)
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  return (
    <React.Fragment>
      <Button
        fullWidth
        variant="text"
        component="label"
        startIcon={<UploadFileRounded fontSize="small" sx={{ mr: 1 }} />}
      >
        Upload File
        <input
          type="file"
          hidden
          multiple
          ref={inputFileRef}
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
            if (ev.target.files) createFiles(ev.target.files)
          }}
        />
      </Button>
    </React.Fragment>
  )
}

function UploadLink() {
  const updateState = useStore((state) => state.updateState)
  return (
    <IconButton
      variant="text"
      label="Upload Link"
      Icon={AddLink}
      onClick={() => updateState({ dialog: 'uploadLink' })}
    />
  )
}

function UploadFolder() {
  const isWebkitDirectorySupported = 'webkitdirectory' in document.createElement('input')
  if (!isWebkitDirectorySupported) return null
  const createFiles = useStore((state) => state.createFiles)
  return (
    <React.Fragment>
      <Button
        variant="text"
        component="label"
        startIcon={<DriveFolderUploadRounded fontSize="small" sx={{ mr: 1 }} />}
      >
        Upload Folder
        <input
          type="file"
          hidden
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
            if (ev.target.files) createFiles(ev.target.files)
          }}
          // @ts-expect-error
          webkitdirectory=""
        />
      </Button>
    </React.Fragment>
  )
}

function CreateFolder() {
  const updateState = useStore((state) => state.updateState)
  return (
    <IconButton
      variant="text"
      label="Create Folder"
      Icon={CreateNewFolderIcon}
      onClick={() => updateState({ dialog: 'createFolder' })}
    />
  )
}

function CreatePackage() {
  const updateState = useStore((state) => state.updateState)
  return (
    <IconButton
      variant="text"
      label="Create Package"
      Icon={SourceIcon}
      onClick={() => updateState({ dialog: 'createPackage' })}
    />
  )
}
