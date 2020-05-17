import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

const Sidebar = (props) => {
  const location = useLocation()
  const { children } = props
  const [selected, setSelected] = useState(0)
  const select = (item) => {
    setSelected(item.id)
  }
  return children({
    selectedItem: location.pathname || selected,
    select: select,
  })
}

export default Sidebar
