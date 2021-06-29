import React from 'react'
import { ThemeContextProvider } from 'contexts/ThemeContext'

type Props = {
  children: JSX.Element
}

const Providers: React.FC<Props> = ({ children }: Props) => {
  return <ThemeContextProvider>{children}</ThemeContextProvider>
}

export default Providers
