import * as React from 'react'
import { StoreProvider, createStore } from './store'
import { Client } from '../../../client'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../../themes'
import { IRecord } from '../../../interfaces'
import Layout from './Layout'

export interface DatasetProps {
  client: Client
  record: IRecord
  isMetadata?: boolean
}

export default function Dataset(props: DatasetProps) {
  const store = React.useMemo(() => createStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
