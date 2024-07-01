import * as store from '../store'
import delay from 'delay'
import { client } from '@client/client'
import { onFileCreate, onFileDelete } from './event'
import * as helpers from '@client/helpers'

export const getIsFolder = store.createSelector((state) => {
  return !!state.files.find((file) => file.path === state.path && file.type === 'folder')
})

export const getFolderPath = store.createSelector((state) => {
  if (!state.path) return undefined
  if (getIsFolder(state)) return state.path
  return helpers.getFolderPath(state.path)
})

export const getNotIndexedFiles = store.createSelector((state) => {
  return state.files.filter((file) => !file.name)
})

export async function loadFiles(throwError?: boolean) {
  const result = await client.fileList()

  if (result instanceof client.Error) {
    if (throwError) throw new Error(result.detail)
    return store.setState('load-files-error', (state) => {
      state.error = result
    })
  }

  store.setState('load-files', (state) => {
    state.files = result.files
  })
}

export async function addFiles(files: FileList) {
  const folder = getFolderPath(store.getState())
  const paths: string[] = []

  for (const file of files) {
    const path = file.webkitRelativePath || undefined
    const result = await client.fileCreate({ file, path, folder, deduplicate: true })

    if (result instanceof client.Error) {
      return store.setState('add-files-error', (state) => {
        state.error = result
      })
    }

    paths.push(result.path)
  }

  onFileCreate(paths)
}

export async function fetchFile(url: string) {
  const folder = getFolderPath(store.getState())
  const result = await client.fileFetch({ url, folder, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('fetch-file-error', (state) => {
      state.error = result
    })
  }

  onFileCreate([result.path])
}

export async function createFile(path: string, prompt?: string) {
  if (prompt) {
    const text = ''
    const result = await client.textCreate({ path, text, prompt, deduplicate: true })

    if (result instanceof client.Error) {
      return store.setState('create-file-error', (state) => {
        state.error = result
      })
    }

    onFileCreate([result.path])
  } else {
    const file = new File([new Blob()], path)
    const result = await client.fileCreate({ path, file, deduplicate: true })

    if (result instanceof client.Error) {
      return store.setState('create-file-error', (state) => {
        state.error = result
      })
    }

    onFileCreate([result.path])
  }
}

export async function adjustFile(name?: string, type?: string) {
  const { path } = store.getState()
  if (!path) return

  const result = await client.filePatch({ path, name, type })

  if (result instanceof client.Error) {
    return store.setState('adjust-file-error', (state) => {
      state.error = result
    })
  }

  store.setState('adjust-file-close', (state) => {
    state.path = undefined
  })

  closeFile()

  await loadFiles()
  await selectFile(path)
}

export async function copyFile(path: string, toPath: string) {
  const result = await client.fileCopy({ path, toPath, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('copy-file-error', (state) => {
      state.error = result
    })
  }

  onFileCreate([result.path])
}

export async function deleteFile(path: string) {
  const result = await client.fileDelete({ path })

  if (result instanceof client.Error) {
    return store.setState('delete-file-error', (state) => {
      state.error = result
    })
  }

  onFileDelete(path)
}

export async function moveFile(path: string, toPath: string) {
  const result = await client.fileMove({ path, toPath, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('move-file-error', (state) => {
      state.error = result
    })
  }

  onFileCreate([result.path])
}

export async function locateFile(path: string) {
  store.setState('locate-file-start', (state) => {
    state.path = path
    state.fileEvent = { type: 'locate', paths: [path] }
  })

  await delay(500)

  store.setState('locate-file-end', (state) => {
    state.fileEvent = undefined
  })
}

export async function selectFile(newPath?: string) {
  const { path, record } = store.getState()
  if (path === newPath) return

  store.setState('select-file', (state) => {
    state.path = newPath
  })

  if (!newPath) return
  if (record?.path === newPath) return
  if (getIsFolder(store.getState())) return

  await openFile(newPath)
}

export async function openFile(path: string) {
  const { fileEvent } = store.getState()

  store.setState('open-file-start', (state) => {
    state.record = undefined
    state.measure = undefined
    state.indexing = true
  })

  const result = await client.fileIndex({ path })

  if (result instanceof client.Error) {
    return store.setState('open-file-error', (state) => {
      state.error = result
    })
  }

  await loadFiles()

  store.setState('open-file-loaded', (state) => {
    state.record = result.record
    state.measure = result.measure
    state.indexing = false
  })

  if (!fileEvent) {
    store.setState('open-file-event-start', (state) => {
      state.fileEvent = { type: 'open', paths: [path] }
    })
  }

  await delay(500)

  store.setState('open-file-event-end', (state) => {
    state.fileEvent = undefined
  })
}

export function closeFile() {
  store.setState('close-file', (state) => {
    state.record = undefined
    state.measure = undefined
  })
}
