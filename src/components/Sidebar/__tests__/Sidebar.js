// import '@testing-library/jest-dom/extend-expect'
import React, { Children } from 'react'
import {render, fireEvent} from '../../../test-utils'
import Sidebar from '../Sidebar';
test('Sidebar sends the correct selected item', () => {
  const sidebarItems = [
    {
      id: 1
    },
    {
      id: 2
    },
    {
      id: 3
    },
  ]
  const SidebarExample = () => (
    <Sidebar>
      {
        ({ select, selectedItem }) => sidebarItems.map(
          (item, index) => (
          <h1 
          key={index}
          onClick={()=>select(item)}
          selected={selectedItem===item.id}
          >
            item
          </h1>
          )
        )
      }
    </Sidebar>
  )
  const { getAllByText } = render(<SidebarExample />)
  const items = getAllByText('item')
  // const selectedItem = fireEvent.click(items[2])
  for (let i = 0; i < items.length; i++) {
    fireEvent.click(items[i])
    for (let j = 0; j < items.length; j++) {
      if (i===j) {
        expect(items[i].selected).toBeTruthy()
      } else 
      expect(items[j].selected).toBeFalsy()
    }
  }
})