import { render, screen } from '@testing-library/react'
import React from 'react'

import Copyright from '../../views/Home/Copyright'

test('renders learn react link', () => {
  render(<Copyright />)
  const linkElement = screen.getByText(/ReactJS/i)
  expect(linkElement).toBeInTheDocument()
})
