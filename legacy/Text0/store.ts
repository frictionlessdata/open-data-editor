import * as React from 'react'
import * as zustand from 'zustand'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile, IResource, ITextContent } from '../../../interfaces'
import { TextProps } from './Text'

export interface State {
  file: IFile
  client: Client
  panel?: 'metadata' | 'changes'
  dialog?: 'saveAs'
  revision: number
  content?: ITextContent
  resource: IResource
  updateState: (patch: Partial<State>) => void
  loadContent: () => Promise<void>
  updateContent: (text: string) => void
  saveAs: (path: string) => Promise<void>
  revert: () => void
  save: () => Promise<void>
}

export function makeStore(props: TextProps) {
  return createStore<State>((set, get) => ({
    ...props,
    revision: 0,
    // TODO: review case of missing record (not indexed)
    resource: cloneDeep(props.file.record!.resource),
    updateState: (patch) => {
      const { revision } = get()
      if ('resource' in patch) patch.revision = revision + 1
      set(patch)
    },
    loadContent: async () => {
      const { client, file } = get()
      const { text } = await client.textRead({ path: file.path })
      const content = { modified: text, original: text }
      set({ content })
    },
    updateContent: (text) => {
      const { content, revision } = get()
      content!.modified = text
      set({ content, revision: revision + 1 })
    },
    saveAs: async (path) => {
      const { client, content } = get()
      await client.textWrite({ path, text: content!.modified })
    },
    revert: () => {
      const { file, content } = get()
      // TODO: review case of missing record (not indexed)
      const newResource = cloneDeep(file.record!.resource)
      const newContent = { ...content!, modified: content!.original }
      set({ resource: newResource, content: newContent, revision: 0 })
    },
    // TODO: needs to udpate file object as well
    save: async () => {
      const { file, client, content, resource } = get()
      await client.fileUpdate({ path: file.path, resource })
      await client.textWrite({ path: file.path, text: content!.modified })
      const newContent = { ...content!, original: content!.modified }
      set({ content: newContent, revision: 0 })
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
    return state.revision > 0
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
