import * as React from 'react'
import * as menu from '../../Parts/Bars/Menu'
import { useStore } from './store'

export default function Menu() {
  const panel = useStore((state) => state.panel)
  const updateState = useStore((state) => state.updateState)
  return (
    <menu.MenuBar>
      <menu.EditorButton
        active={panel === 'editor'}
        onClick={() =>
          updateState({
            panel: panel !== 'editor' ? 'editor' : undefined,
          })
        }
      />
      <menu.MetadataButton
        active={panel === 'metadata'}
        onClick={() =>
          updateState({
            panel: panel !== 'metadata' ? 'metadata' : undefined,
          })
        }
      />
      <menu.ReportButton
        active={panel === 'report'}
        onClick={() => updateState({ panel: panel !== 'report' ? 'report' : undefined })}
      />
      <menu.SourceButton
        active={panel === 'source'}
        onClick={() => updateState({ panel: panel !== 'source' ? 'source' : undefined })}
      />
    </menu.MenuBar>
  )
}
