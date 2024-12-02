import * as store from '@client/store'
import AddEmptyFolderDialog from './Dialogs/AddEmptyFolder'
import { AssistantDialog } from './Dialogs/Assistant'
import CloseWithUnsavedChangesDialog from './Dialogs/CloseWithUnsavedChanges'
import ConfigDialog from './Dialogs/Config'
import { CreateFolderDialog } from './Dialogs/CreateFolder'
import { DeleteFileDialog } from './Dialogs/DeleteFile'
import OpenLocationDialog from './Dialogs/OpenLocation'
import PublishDialog from './Dialogs/Publish'
import { RenameFileDialog } from './Dialogs/RenameFile'
import { SaveChangesDialog } from './Dialogs/SaveChanges'
import UnsavedChangesDialog from './Dialogs/UnsavedChanges'
import { UploadFileDialog } from './Dialogs/UploadFile'
import WelcomeBannerDialog from './Dialogs/WelcomeBanner'

export default function Dialog() {
  const dialog = store.useStore((state) => state.dialog)
  if (!dialog) return null

  // @ts-ignore
  const Dialog = DIALOGS[dialog]
  if (!Dialog) return null

  return <Dialog />
}

const DIALOGS = {
  addEmptyFolder: AddEmptyFolderDialog,
  assistant: AssistantDialog,
  closeWithUnsavedChanges: CloseWithUnsavedChangesDialog,
  config: ConfigDialog,
  configProject: ConfigDialog,
  deleteFilesFolders: DeleteFileDialog,
  publish: PublishDialog,
  unsavedChanges: UnsavedChangesDialog,
  welcomeBanner: WelcomeBannerDialog,
  fileUpload: UploadFileDialog,
  openLocation: OpenLocationDialog,
  renameFile: RenameFileDialog,
  saveChanges: SaveChangesDialog,
} as const
