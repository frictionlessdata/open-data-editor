import * as React from 'react'
import Box from '@mui/material/Box'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { useStore } from './store'
import * as topojson from 'topojson-client'
import * as helpers from '../../../helpers'

export default function Viewer() {
  const type = useStore((state) => state.record?.type)
  if (!type) return null
  if (type === 'image') return <ImageViewer />
  if (type === 'map') return <MapViewer />
  return <NonSupportedViewer />
}

function ImageViewer() {
  const format = useStore((state) => state.record?.resource.format)
  const byteSource = useStore((state) => state.byteSource)
  if (!format) return null
  if (!byteSource) return null
  const text = helpers.bytesToBase64(byteSource)
  return (
    <Box sx={{ padding: 2 }}>
      <img src={`data:image/${format};base64,${text}`} />
    </Box>
  )
}

function MapViewer() {
  const textSource = useStore((state) => state.textSource)
  if (!textSource) return null
  let data = JSON.parse(textSource)
  if (data?.type === 'Topology') {
    data = topojson.feature(data, Object.keys(data.objects)[0] as any)
  }
  return (
    <Box sx={{ padding: 2, width: '100%', height: '100%' }}>
      <MapContainer center={[51.505, -0.09]} zoom={3} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={data} />
      </MapContainer>
    </Box>
  )
}

function NonSupportedViewer() {
  const format = useStore((state) => state.record?.resource.format)
  if (!format) return null
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        backgroundColor: '#fafafa',
        padding: 2,
        color: '#777',
        fontFamily: 'Monospace',
      }}
    >
      This file type does not have a supported data view ({format})
    </Box>
  )
}
