import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../Parts/Columns'
import InputField from '../../../Parts/Fields/InputField'
import EditorItem from '../../../Parts/Editor/EditorItem'
import EditorList from '../../../Parts/Editor/EditorList'
import EditorListItem from '../../../Parts/Editor/EditorListItem'
import EditorSearch from '../../../Parts/Editor/EditorSearch'
import { useStore, selectors, select } from '../store'

export default function License() {
  const index = useStore((state) => state.licenseState.index)
  return index === undefined ? <LicenseList /> : <LicenseItem />
}

function LicenseList() {
  const isGrid = useStore((state) => state.licenseState.isGrid)
  const query = useStore((state) => state.licenseState.query)
  const licenseItems = useStore(selectors.licenseItems)
  const updateLicenseState = useStore((state) => state.updateLicenseState)
  const addLicense = useStore((state) => state.addLicense)
  return (
    <EditorList
      kind="license"
      query={query}
      isGrid={isGrid}
      onAddClick={() => addLicense()}
      onGridClick={() => updateLicenseState({ isGrid: !isGrid })}
      SearchInput={
        <EditorSearch
          value={query || ''}
          onChange={(query) => updateLicenseState({ query })}
        />
      }
    >
      {licenseItems.map(({ index, license }) => (
        <EditorListItem
          key={index}
          index={index}
          kind="license"
          name={license.name}
          type="license"
          isGrid={isGrid}
          onClick={() => updateLicenseState({ index })}
          title="View License"
        />
      ))}
    </EditorList>
  )
}

function LicenseItem() {
  const { license } = useStore(selectors.license)
  const isExtras = useStore((state) => state.licenseState.isExtras)
  const removeLicense = useStore((state) => state.removeLicense)
  const updateLicenseState = useStore((state) => state.updateLicenseState)
  return (
    <EditorItem
      kind="license"
      name={license.name}
      isExtras={isExtras}
      onExtrasClick={() => updateLicenseState({ isExtras: !isExtras })}
      onRemoveClick={() => removeLicense()}
      onBackClick={() => updateLicenseState({ index: undefined, isExtras: false })}
    >
      <Columns spacing={3}>
        <Box>
          <Name />
          <Title />
        </Box>
        <Box>
          <Path />
        </Box>
      </Columns>
    </EditorItem>
  )
}

function Name() {
  const name = useStore(select(selectors.license, ({ license }) => license.name))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateLicense = useStore((state) => state.updateLicense)
  return (
    <InputField
      label="Name"
      value={name}
      onFocus={() => updateHelp('resource/licenses/name')}
      onChange={(name) => updateLicense({ name })}
    />
  )
}

function Title() {
  const title = useStore(select(selectors.license, ({ license }) => license.title))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateLicense = useStore((state) => state.updateLicense)
  return (
    <InputField
      label="Title"
      value={title || ''}
      onFocus={() => updateHelp('resource/licenses/title')}
      onChange={(value) => updateLicense({ title: value || undefined })}
    />
  )
}

function Path() {
  const path = useStore(select(selectors.license, ({ license }) => license.path))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateLicense = useStore((state) => state.updateLicense)
  return (
    <InputField
      label="Path"
      value={path || ''}
      onFocus={() => updateHelp('resource/licenses/path')}
      onChange={(path) => updateLicense({ path })}
    />
  )
}
