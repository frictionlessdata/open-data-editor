import * as React from 'react'
import Chip from '@mui/material/Chip'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import LightTooltip from '../Tooltips/Light'

// TODO: create BaseChip

export interface ChartChipProps {
  onClick: () => void
}

export default function ChartChip(props: ChartChipProps) {
  return (
    <LightTooltip title="Create a chart">
      <Chip
        onClick={props.onClick}
        label="CHART"
        color="primary"
        icon={<LeaderboardIcon />}
        size="medium"
        sx={{
          width: '6vw',
          height: '100%',
          borderLeft: 'solid 1px #ddd',
          borderRadius: '3px',
        }}
      />
    </LightTooltip>
  )
}
