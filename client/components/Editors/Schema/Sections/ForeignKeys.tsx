import Box from '@mui/material/Box'
import Columns from '../../../Parts/Grids/Columns'
import InputField from '../../../Parts/Fields/Input'
import SelectField from '../../../Parts/Fields/Select'
import EditorItem from '../../Base/Item'
import EditorList from '../../Base/List'
import EditorListItem from '../../Base/ListItem'
import { useStore, selectors, select } from '../store'
import { useTranslation } from 'react-i18next'
import EditorHelp from '../../Base/Help'
import NothingToSee from '@client/components/Parts/Cards/NothingToSee'

export default function ForeignKey() {
  const index = useStore((state) => state.foreignKeyState.index)
  return index === undefined ? <ForeignKeyList /> : <ForeignKeyItem />
}

function ForeignKeyList() {
  const query = useStore((state) => state.foreignKeyState.query)
  const foreignKeyItems = useStore(selectors.foreignKeyItems)
  const updateForeignKeyState = useStore((state) => state.updateForeignKeyState)
  const addForeignKey = useStore((state) => state.addForeignKey)
  const removeForeignKey = useStore((state) => state.removeForeignKey)
  const helpItem = useStore((state) => state.helpItem)
  const { t } = useTranslation()
  return (
    <EditorList
      kind="foreign key"
      query={query}
      onAddClick={foreignKeyItems.length > 0 ? addForeignKey : null}
    >
      <EditorHelp helpItem={helpItem} withIcon />
      {foreignKeyItems.length > 0 ? (
        foreignKeyItems.map(({ index, foreignKey }) => (
          <EditorListItem
            key={index}
            kind="foreign key"
            name={foreignKey.fields.join(',')}
            type="fk"
            onClick={() => updateForeignKeyState({ index })}
            onRemoveClick={() => removeForeignKey(index)}
          />
        ))
      ) : (
        <NothingToSee buttonText={t('add-foreign-key')} onAddClick={addForeignKey} />
      )}
    </EditorList>
  )
}

function ForeignKeyItem() {
  const fields = useStore(select(selectors.foreignKey, (foreignKey) => foreignKey.fields))
  const isExtras = useStore((state) => state.foreignKeyState.isExtras)
  const updateForeignKeyState = useStore((state) => state.updateForeignKeyState)
  const updateHelp = useStore((state) => state.updateHelp)
  const helpItem = useStore((state) => state.helpItem)
  return (
    <EditorItem
      kind="foreignKey"
      name={fields.join(',')}
      isExtras={isExtras}
      onExtrasClick={() => updateForeignKeyState({ isExtras: !isExtras })}
      onBackClick={() => {
        updateForeignKeyState({ index: undefined, isExtras: false })
        updateHelp('schema/foreignKeys')
      }}
    >
      <EditorHelp helpItem={helpItem} withIcon />
      <Columns spacing={3}>
        <Box>
          <SourceField />
          <TargetField />
        </Box>
        <Box>
          <TargetResource />
        </Box>
      </Columns>
    </EditorItem>
  )
}

function SourceField() {
  const fields = useStore(select(selectors.foreignKey, (foreignKey) => foreignKey.fields))
  const fieldNames = useStore(selectors.fieldNames)
  const updateForeignKey = useStore((state) => state.updateForeignKey)
  const updateHelp = useStore((state) => state.updateHelp)
  const { t } = useTranslation()
  return (
    <SelectField
      label={t('source-field')}
      value={fields[0]}
      options={fieldNames}
      onFocus={() => updateHelp('schema/foreignKey/sourceField')}
      onChange={(name) => updateForeignKey({ fields: [name] })}
    />
  )
}

function TargetField() {
  const reference = useStore(
    select(selectors.foreignKey, (foreignKey) => foreignKey.reference)
  )
  const updateForeignKey = useStore((state) => state.updateForeignKey)
  const updateHelp = useStore((state) => state.updateHelp)
  const { t } = useTranslation()
  return (
    <SelectField
      label={t('target-field')}
      value={reference.fields[0]}
      options={reference.fields}
      onFocus={() => updateHelp('schema/foreignKey/targetField')}
      onChange={(name) =>
        updateForeignKey({ reference: { ...reference, fields: [name] } })
      }
    />
  )
}

function TargetResource() {
  const reference = useStore(
    select(selectors.foreignKey, (foreignKey) => foreignKey.reference)
  )
  const updateForeignKey = useStore((state) => state.updateForeignKey)
  const { t } = useTranslation()
  return (
    <InputField
      disabled
      label={t('target-resource')}
      value={reference.resource}
      onChange={(resource) => updateForeignKey({ reference: { ...reference, resource } })}
    />
  )
}
