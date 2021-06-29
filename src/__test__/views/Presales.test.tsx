import { render, screen } from '@testing-library/react'
import React from 'react'

import Home from '../../views/Home'

test('renders learn react link', () => {
  render(<Home />)
  const linkElement = screen.getByText(/User will be distributed/i)
  expect(linkElement).toBeInTheDocument()
})
