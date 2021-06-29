import React, { useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { Darks, Lights } from 'config/constants/themes'

const CACHE_KEY = 'IS_DARK'

const ThemeContext = React.createContext({ isDark: null, toggleTheme: () => null, themeMatch: () => Darks })

type Props = {
  children: JSX.Element
}

const ThemeContextProvider = ({ children }: Props) => {
  const [isDark, setIsDark] = useState(() => {
    const isDarkUserSetting = localStorage.getItem(CACHE_KEY)
    return isDarkUserSetting ? JSON.parse(isDarkUserSetting) : true
  })

  const toggleTheme = () => {
    setIsDark((prevState) => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(prevState))
      return prevState
    })
  }

  const themeMatch = () => (isDark ? Darks : Lights)

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, themeMatch }}>
      <ThemeProvider theme={themeMatch}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}

export { ThemeContext, ThemeContextProvider }
