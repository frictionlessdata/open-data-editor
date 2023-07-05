import { Meta, StoryObj } from '@storybook/react'
import SelectDialog from '../../../src/client/components/Parts/Dialogs/Select'

type Story = StoryObj<typeof SelectDialog>
const meta: Meta<typeof SelectDialog> = {
  component: SelectDialog,
}

export default meta

// Data

const items = ['path1.csv', 'path2.csv', 'path3.csv']

// Stories

export const Default: Story = {
  args: {
    items,
    onConfirm: console.log,
    onCancel: console.log,
  },
}
