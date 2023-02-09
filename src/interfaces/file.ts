import { IResource } from './resource'
import { IReport } from './report'

export interface IFileItem {
  path: string
  type: string
}

export interface IFile extends IFileItem {
  record?: IRecord
}

export interface IRecordItem {
  path: string
  type: string
  updated: string
  tableName?: string
}

export interface IRecord extends IRecordItem {
  resource: IResource
  report: IReport
}
