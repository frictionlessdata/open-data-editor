import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../Parts/Grids/Columns'
import InputField from '../../../Parts/Fields/Input'
import EditorItem from '../../Base/Item'
import EditorList from '../../Base/List'
import EditorListItem from '../../Base/ListItem'
import EditorSearch from '../../Base/Search'
import { useStore, selectors, select } from '../store'
import validator from 'validator'

export default function Contributors() {
  const index = useStore((state) => state.contributorState.index)
  return index === undefined ? <ContributorList /> : <ContributorItem />
}

function ContributorList() {
  const isGrid = useStore((state) => state.contributorState.isGrid)
  const query = useStore((state) => state.contributorState.query)
  const contributorItems = useStore(selectors.contributorItems)
  const updateContributorState = useStore((state) => state.updateContributorState)
  const addContributor = useStore((state) => state.addContributor)
  const removeContributor = useStore((state) => state.removeContributor)
  return (
    <EditorList
      kind="contributor"
      query={query}
      isGrid={isGrid}
      onAddClick={() => addContributor()}
      onGridClick={() => updateContributorState({ isGrid: !isGrid })}
      SearchInput={
        <EditorSearch
          value={query || ''}
          onChange={(query) => updateContributorState({ query })}
        />
      }
    >
      {contributorItems.map(({ index, contributor }) => (
        <EditorListItem
          key={index}
          kind="contributor"
          name={contributor.title}
          type="contributor"
          isGrid={isGrid}
          onClick={() => {
            updateContributorState({ index })
          }}
          onRemoveClick={() => removeContributor(index)}
        />
      ))}
    </EditorList>
  )
}

function ContributorItem() {
  const title = useStore(
    select(selectors.contributor, (contributor) => contributor.title)
  )
  const isExtras = useStore((state) => state.contributorState.isExtras)
  const updateContributorState = useStore((state) => state.updateContributorState)
  return (
    <EditorItem
      kind="contributor"
      name={title}
      isExtras={isExtras}
      onExtrasClick={() => updateContributorState({ isExtras: !isExtras })}
      onBackClick={() => updateContributorState({ index: undefined, isExtras: false })}
    >
      <Columns spacing={3}>
        <Box>
          <Title />
          <Email />
        </Box>
        <Box>
          <Path />
          <Role />
        </Box>
      </Columns>
    </EditorItem>
  )
}

function Title() {
  const title = useStore(
    select(selectors.contributor, (contributor) => contributor.title)
  )
  const updateHelp = useStore((state) => state.updateHelp)
  const updateContributor = useStore((state) => state.updateContributor)
  return (
    <InputField
      label="Title"
      value={title || ''}
      onFocus={() => updateHelp('package/contributors/title')}
      onChange={(title) => updateContributor({ title })}
    />
  )
}

function Email() {
  const email = useStore(
    select(selectors.contributor, (contributor) => contributor.email)
  )
  const updateHelp = useStore((state) => state.updateHelp)
  const updateContributor = useStore((state) => state.updateContributor)
  const [isValid, setIsValid] = React.useState(isValidEmail())
  function isValidEmail() {
    return email ? validator.isEmail(email) : true
  }
  return (
    <InputField
      error={!isValid}
      label="Email"
      value={email || ''}
      onFocus={() => updateHelp('package/contributors/email')}
      onBlur={() => {
        setIsValid(isValidEmail())
      }}
      onChange={(value) => updateContributor({ email: value })}
      helperText={!isValid ? 'Email is not valid.' : ''}
    />
  )
}

function Path() {
  const path = useStore(select(selectors.contributor, (contributor) => contributor.path))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateContributor = useStore((state) => state.updateContributor)
  return (
    <InputField
      label="Path"
      value={path || ''}
      onFocus={() => updateHelp('package/contributors/path')}
      onChange={(path) => updateContributor({ path })}
    />
  )
}

function Role() {
  const role = useStore(select(selectors.contributor, (contributor) => contributor.role))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateContributor = useStore((state) => state.updateContributor)
  return (
    <InputField
      label="Role"
      value={role || ''}
      onFocus={() => updateHelp('package/contributors/role')}
      onChange={(role) => updateContributor({ role })}
    />
  )
}
