import React from 'react'
import styled from 'styled-components'
import { Sun, Moon } from 'react-feather'
import useTheme from 'hooks/useTheme'

interface ToogleProps {
  check: boolean
}

const ToggleSlot = styled.div<ToogleProps>`
  position: relative;
  height: 1.5em;
  width: 3em;
  border: 5px solid #e4e7ec;
  border-radius: 10em;
  background-color: ${(props) => (props.check ? '#374151' : 'white')};
  box-shadow: 0px 2px 10px ${(props) => (props.check ? '#e4e7ec' : '#374151')};
  transition: background-color 250ms;
  overflow: hidden;
`

const ToogleButton = styled.div<ToogleProps>`
  transform: ${(props) => (props.check ? 'translate(0, 0)' : 'translate(1.5em, 0)')};
  position: absolute;
  height: 1.5em;
  width: 1.5em;
  border-radius: 50%;
  background-color: ${(props) => (props.check ? '#485367' : '#ffeccf')};
  box-shadow: inset 0px 0px 0px 0.75em #ffbb52;
  transition: background-color 250ms, border-color 250ms, transform 500ms cubic-bezier(0.26, 2, 0.46, 0.71);
  box-shadow: ${(props) => (props.check ? 'inset 0px 0px 0px 0.75em white' : '0px 2px 10px #e4e7ec')};
`

const SunIconWrapper = styled.div<ToogleProps>`
  position: absolute;
  height: 1.5em;
  width: 1.5em;
  opacity: ${(props) => (props.check ? '0' : '1')};
  transform: ${(props) => (props.check ? 'translate(1.5em, 0) rotate(0deg)' : 'translate(0, 0) rotate(15deg)')};
  transform-origin: 50% 50%;
  transition: opacity 150ms, transform 500ms cubic-bezier(0.26, 2, 0.46, 0.71);
`

const SunIcon = styled(Sun)`
  position: absolute;
  height: 1.5em;
  width: 1.5em;
  color: #ffbb52;
`

const MoonIconWrapper = styled.div<ToogleProps>`
  position: absolute;
  height: 1.5em;
  width: 1.5em;
  opacity: ${(props) => (props.check ? '1' : '0')};
  transform: ${(props) => (props.check ? 'translate(1.5em, 0) rotate(-15deg)' : 'translate(4em, 0em) rotate(0deg)')};
  transform-origin: 50% 50%;
  transition: opacity 150ms, transform 500ms cubic-bezier(0.26, 2.5, 0.46, 0.71);
`

const MoonIcon = styled(Moon)`
  position: absolute;
  height: 1.5em;
  width: 1.5em;
  color: white;
`

const ToogleDarkMode = () => {
  const { isDark, toggleTheme } = useTheme()
  return (
    <ToggleSlot onClick={toggleTheme} check={isDark}>
      <SunIconWrapper check={isDark}>
        <SunIcon />
      </SunIconWrapper>
      <ToogleButton check={isDark} />
      <MoonIconWrapper check={isDark}>
        <MoonIcon />
      </MoonIconWrapper>
    </ToggleSlot>
  )
}

export default ToogleDarkMode
