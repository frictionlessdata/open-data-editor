import Box from '@mui/material/Box'
import Columns from '../../Parts/Grids/Columns'
import MenuPanel from '../../Parts/Panels/Menu'
import EditorHelp from '../Base/Help'
import CkanSection from './Sections/Ckan'
import GithubSection from './Sections/Github'
import ZenodoSection from './Sections/Zenodo'
import { useStore } from './store'
import * as types from '../../../types'

const MENU_ITEMS: types.IMenuItem[] = [
  { section: 'ckan', name: 'Ckan' },
  { section: 'github', name: 'Github' },
  { section: 'zenodo', name: 'Zenodo' },
]

export default function Layout() {
  const section = useStore((state) => state.descriptor.type)
  const helpItem = useStore((state) => state.helpItem)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <Box sx={{ height: '100%' }}>
      <Columns spacing={3} layout={[9, 3]}>
        <MenuPanel
          menuItems={MENU_ITEMS}
          selected={section}
          onSelect={(newSection) => {
            if (section === newSection) return
            updateHelp(newSection)
            // @ts-ignore
            updateDescriptor({ type: newSection })
          }}
        >
          <CkanSection />
          <GithubSection />
          <ZenodoSection />
        </MenuPanel>
        <EditorHelp helpItem={helpItem} />
      </Columns>
    </Box>
  )
}
