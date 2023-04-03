import * as React from 'react'
import Resource from '../../../Editors/Resource'
import { useStore } from '../store'

export default function MetadataPanel() {
  const resource = useStore((state) => state.resource)
  const updateState = useStore((state) => state.updateState)
  if (!resource) return null
  return (
    <Resource
      isShallow
      resource={resource}
      onChange={(resource) => updateState({ resource })}
    />
  )
}
