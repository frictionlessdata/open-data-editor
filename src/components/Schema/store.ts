import create from 'zustand'
import produce from 'immer'
import noop from 'lodash/noop'
import yaml from 'js-yaml'
import FileSaver from 'file-saver'
import cloneDeep from 'lodash/cloneDeep'
import createContext from 'zustand/context'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { SchemaProps } from './Schema'
import { ISchema } from '../../interfaces'
import * as settings from '../../settings'

// TODO: refactor - use slices?

const INITIAL_SCHEMA: ISchema = { fields: [] }

interface SchemaState {
  // General

  descriptor: ISchema
  checkpoint: ISchema
  onCommit: (schema: ISchema) => void
  onRevert: (schema: ISchema) => void
  isPreview?: boolean
  isUpdated?: boolean
  exportFormat: string

  // Elements

  elementType: 'field' | 'foreignKey'
  elementIndex?: number
  elementQuery?: string
  isElementGrid?: boolean
  isElementExtra?: boolean
}

interface SchemaLogic {
  // General

  setExportFormat: (format: string) => void
  togglePreview: () => void
  exporter: () => void
  importer: (file: File) => void
  // TODO: type the patch
  update: (patch: object) => void
  commit: () => void
  revert: () => void

  // Elements

  setElementType: (elementType: SchemaState['elementType']) => void
  setElementIndex: (index?: number) => void
  setElementQuery: (elementQuery?: string) => void
  toggleIsElementGrid: () => void
  toggleIsElementExtra: () => void
  addElement: () => void
  removeElement: () => void
  // TODO: type the patch
  updateElement: (patch: object) => void
}

export function makeStore(props: SchemaProps) {
  const initialState = {
    // General

    descriptor: cloneDeep(props.schema || INITIAL_SCHEMA),
    checkpoint: cloneDeep(props.schema || INITIAL_SCHEMA),
    onCommit: props.onCommit || noop,
    onRevert: props.onRevert || noop,
    exportFormat: settings.DEFAULT_EXPORT_FORMAT,

    // Elements

    elementType: 'field' as SchemaState['elementType'],
  }
  return create<SchemaState & SchemaLogic>((set, get) => ({
    ...initialState,

    // General

    setExportFormat: (exportFormat) => set({ exportFormat }),
    togglePreview: () => set({ isPreview: !get().isPreview }),
    exporter: () => {
      const { descriptor, exportFormat } = get()
      const isYaml = exportFormat === 'yaml'
      const text = isYaml ? yaml.dump(descriptor) : JSON.stringify(descriptor, null, 2)
      const blob = new Blob([text], { type: `text/${exportFormat};charset=utf-8` })
      FileSaver.saveAs(blob, `schema.${exportFormat}`)
      set({ exportFormat: settings.DEFAULT_EXPORT_FORMAT, isPreview: false })
    },
    importer: async (file) => {
      const text = (await file.text()).trim()
      const isYaml = !text.startsWith('{')
      // TODO: handle errors and validate descriptor
      const descriptor = isYaml ? yaml.load(text) : JSON.parse(text)
      set({ descriptor, isUpdated: true })
    },
    update: (patch) => {
      const { descriptor } = get()
      set({ descriptor: { ...descriptor, ...patch }, isUpdated: true })
    },
    revert: () => {
      const { onRevert, descriptor, checkpoint } = get()
      set({ descriptor: cloneDeep(checkpoint), isUpdated: false })
      onRevert(descriptor)
    },
    commit: () => {
      const { onCommit, descriptor } = get()
      set({ checkpoint: cloneDeep(descriptor), isUpdated: false })
      onCommit(descriptor)
    },

    // Elements

    setElementType: (elementType) => set({ elementType }),
    setElementIndex: (elementIndex) => set({ elementIndex }),
    setElementQuery: (elementQuery) => set({ elementQuery }),
    toggleIsElementGrid: () => set({ isElementGrid: !get().isElementGrid }),
    toggleIsElementExtra: () => set({ isElementExtra: !get().isElementExtra }),
    // TODO: finish
    addElement: () => {
      let { elementIndex } = get()
      const { descriptor, elementType } = get()
      const newDescriptor = produce(descriptor, (descriptor) => {
        if (elementType === 'field') {
          const name = `field${descriptor.fields.length}`
          descriptor.fields.push({ name, type: 'string', format: 'default' })
          elementIndex = descriptor.fields.length - 1
        } else if (elementType === 'foreignKey') {
          // TODO: catch no fields
          const name = descriptor.fields[0].name
          descriptor.foreignKeys = descriptor.foreignKeys || []
          descriptor.foreignKeys.push({
            fields: [name],
            reference: { fields: [name], resource: '' },
          })
          elementIndex = descriptor.foreignKeys.length - 1
        }
      })
      set({ descriptor: newDescriptor, elementIndex, isUpdated: true })
    },
    removeElement: () => {
      const { descriptor, elementType, elementIndex } = get()
      if (elementIndex === undefined) return
      const newDescriptor = produce(descriptor, (descriptor) => {
        if (elementType === 'field') {
          descriptor.fields.splice(elementIndex, 1)
        } else if (elementType === 'foreignKey') {
          descriptor.foreignKeys = descriptor.foreignKeys || []
          descriptor.foreignKeys.splice(elementIndex, 1)
          if (!descriptor.foreignKeys.length) delete descriptor.foreignKeys
        }
      })
      set({ descriptor: newDescriptor, elementIndex: undefined, isUpdated: true })
    },
    updateElement: (patch) => {
      const { descriptor, elementType, elementIndex } = get()
      assert(elementIndex !== undefined)
      const newDescriptor = produce(descriptor, (descriptor) => {
        if (elementType === 'field') {
          descriptor.fields[elementIndex] = {
            ...descriptor.fields[elementIndex],
            ...patch,
          }
        } else if (elementType === 'foreignKey') {
          descriptor.foreignKeys![elementIndex] = {
            ...descriptor.foreignKeys![elementIndex],
            ...patch,
          }
        }
      })
      set({ descriptor: newDescriptor, isUpdated: true })
    },
  }))
}

export const select = createSelector
export const selectors = {
  field: (state: SchemaState) => {
    const elementIndex = state.elementIndex
    assert(elementIndex !== undefined)
    const field = state.descriptor.fields[elementIndex]
    assert(field !== undefined)
    return field
  },
  fieldNames: (state: SchemaState) => {
    return state.descriptor.fields.map((field) => field.name)
  },
  foundFieldItems: (state: SchemaState) => {
    const items = []
    for (const [index, field] of state.descriptor.fields.entries()) {
      if (state.elementQuery && !field.name.includes(state.elementQuery)) continue
      items.push({ index, field })
    }
    return items
  },
  foreignKey: (state: SchemaState) => {
    const elementIndex = state.elementIndex
    assert(elementIndex !== undefined)
    assert(state.descriptor.foreignKeys !== undefined)
    const foreignKey = state.descriptor.foreignKeys[elementIndex]
    assert(foreignKey !== undefined)
    return foreignKey
  },
  foreignKeyNames: (state: SchemaState) => {
    return (state.descriptor.foreignKeys || []).map((fk) => fk.fields.join(','))
  },
  foundForeignKeyItems: (state: SchemaState) => {
    const items = []
    for (const [index, fk] of (state.descriptor.foreignKeys || []).entries()) {
      const name = fk.fields.join(',')
      if (state.elementQuery && !name.includes(state.elementQuery)) continue
      items.push({ index, foreignKey: fk })
    }
    return items
  },
}
export const { Provider, useStore } = createContext<SchemaState & SchemaLogic>()
