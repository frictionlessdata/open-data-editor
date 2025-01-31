import type { ClientError } from '@client/client'
import type * as types from '@client/types'

export type IState = {
  /**
   * The list of files in the current project
   **/
  files: types.IFile[]

  /**
   * A path of the currently selected file if any is selected
   **/
  path?: string

  /**
   * A recored desribing currently selected file if any is selected
   **/
  record?: types.IRecord

  /**
   * A `frictionless-py` validation report for the currently selected file if any is selected
   **/
  report?: types.IReport

  /**
   * An error index derived from the validation report
   **/
  errorIndex?: types.IErrorIndex

  /**
   * An error row numbers derived from the validation report
   **/
  errorRowNumbers?: number[]

  /**
   * A Data Resource descriptor for the current file
   * It can be edited by a metadata editor as a part of metadata adjustment
   * The original `record.resource` is immutable and can be compared
   **/
  resource?: types.IResource

  /**
   * True if the current resource was updated
   * It is a temporaty solution bringing some source-of-truth duplication
   * until there is a proper data/metadata logic separation as per:
   * https://github.com/okfn/opendataeditor/issues/494
   **/
  isResourceUpdated?: boolean

  /**
   * True if data is loading (for example a list of files in the Browser)
   **/
  loading?: boolean

  /**
   * True if data is indexing (for example a tabular data validation and database uploading).
   * Note that it's different with loading as it's about the data in the Content component.
   **/
  indexing?: boolean

  /**
   * Currently active event for example, file creation or deletion (to show animation)
   **/
  event?: types.IEvent

  /**
   * Keeps track of the current error (global to the app)
   **/
  error?: ClientError

  /**
   * Keeps track of the displayed dialog
   **/
  dialog?: IDialog

  /**
   * Keeps track of the displayed dialog's tab
   **/
  dialogTab?: number

  /**
   * Will be opened when the main `dialog` is closed (for dialog chains)
   **/
  nextDialog?: IDialog

  /**
   * Keeps track of the selected panel
   **/
  panel?: IPanel

  /**
   * File source as text or binary data depending on the file format
   * It will be loaded only if it makes sense for this file
   **/
  source?: ISource

  /**
   * Keeps track of the table state if current file is a table
   **/
  table?: ITableState

  /**
   * Keeps track of the text state if current file is a text
   **/
  text?: ITextState

  /**
   * Records the decision of the user to show/hide the welcome screen
   **/
  hideWelcomeScreen?: boolean

  /**
   * Records the decision of the user to show/hide the Open Location dialog
   **/
  hideOpenLocationDialog?: boolean
}

export type ITableState = {
  /**
   * The number of rows in the table
   **/
  rowCount: number

  /**
   * The history object that includes all the changes done to the current table
   * The application merged these changes into the table editor via table loader
   **/
  history: types.IHistory

  /**
   * The same as history but for reverted changes
   **/
  undoneHistory: types.IHistory

  /**
   * Optional table mode, e.g. 'errors' to show only errors
   **/
  mode?: 'errors'

  /**
   * Keeps track of the URL where the table was published as a dataset (e.g. to CKAN)
   **/
  publishedUrl?: string

  /**
   * When the table is in the in-edit mode keeps track of the initial cell value
   **/
  initialEditingValue?: string | number

  /**
   * Keeps track of the current table selection in the Inovua table editor
   **/
  selection?: types.ITableSelection
}

export type ITextState = {
  /**
   * Text content for the text editor
   **/
  contents: string

  /**
   * Text versions for undo/redo functionality
   **/
  minimalVersion: number
  currentVersion: number
  maximalVersion: number
}

export type IDialog =
  | 'addEmptyFolder'
  | 'assistant'
  | 'copyFile'
  | 'copyFolder'
  | 'create'
  | 'deleteFilesFolders'
  | 'start'
  | 'publish'
  | 'chat'
  | 'unsavedChanges'
  | 'closeWithUnsavedChanges'
  | 'welcomeBanner'
  | 'fileUpload'
  | 'openLocation'
  | 'renameFile'
  | 'saveChanges'
  | 'exporter'

export type IPanel = 'metadata' | 'report' | 'changes' | 'source'

export type ISource = {
  bytes?: ArrayBuffer
  text?: string
}

export const initialState: IState = {
  files: [],
}
