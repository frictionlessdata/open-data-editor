import * as React from 'react'
import Home from './Home'
import Config from './Config'
import Describe from './Describe'
import Extract from './Extract'
import Validate from './Validate'
import Transform from './Transform'
import { useStore } from './store'

export default function Page() {
  const page = useStore((state) => state.page)
  switch (page) {
    case 'home':
      return <Home />
    case 'config':
      return <Config />
    case 'describe':
      return <Describe />
    case 'extract':
      return <Extract />
    case 'validate':
      return <Validate />
    case 'transform':
      return <Transform />
    default:
      return null
  }
}
