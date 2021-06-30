import React, { useState } from 'react'
import styled from 'styled-components'
import Button from 'components/Button'
import HamburgerMenu from 'components/HamburgerMenu'
import ToogleDarkMode from 'components/Switch/ToogleDarkMode'
import useScroll from '@react-hooks-custom/use-scroll'
import useTheme from 'hooks/useTheme'
import { ListWrapperType, UlWrapperType, WrapperType, WrapperToogleDarkModeTypes } from './types'

// background-color: ${(props) => props.theme.background?.primary};
const Wrapper = styled.section<WrapperType>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: ${(props) => (props.scroll && props.isDark ? '70px' : '')};
  top: ${(props) => (props.scroll && props.isDark ? '0' : '')};
  position: ${(props) => (props.scroll && props.isDark ? 'fixed' : 'relative')};
  background-color: ${(props) =>
    props.scroll && props.isDark ? props.theme.color?.primary : props.theme.background?.primary};
  width: 100%;
  align-self: center;
`

const Logo = styled.div`
  color: ${(props) => props.theme.color?.primary};
  font-size: 24px;
  font-family: Ballet;
  cursor: pointer;
  padding-left: 10%;
  @media (max-width: 1025px) {
    padding-left: 15%;
  }
  @media (max-width: 801px) {
    padding-left: 15%;
  }
  @media (max-width: 600px) {
    padding-left: 4%;
  }
  @media (max-width: 480px) {
    padding-left: 2.5%;
  }
  @media (max-width: 320px) {
    padding-left: 1%;
  }
`

const Ul = styled.ul`
  list-style-type: none;
  margin: 0;
  padding-right: 10%;
  @media (max-width: 1025px) {
    padding-right: 15%;
  }
  @media (max-width: 801px) {
    padding-right: 15%;
  }
  @media (max-width: 600px) {
    padding-right: 4%;
  }
  @media (max-width: 480px) {
    padding-right: 2.5%;
  }
  @media (max-width: 320px) {
    padding-right: 1%;
  }
`
const Li = styled.li`
  display: inline-block;
  padding-right: 30px;
  @media (max-width: 1025px) {
    padding-right: 0px;
    display: flex;
    width: 98%;
    margin-bottom: 5px;
    &:hover {
      background: ${(props) => props.theme.default?.color?.gray};
    }
  }
`
const LiWrapper = styled.li<ListWrapperType>`
  display: inline-block;
  @media (max-width: 1025px) {
    display: ${(props) => (props.show ? 'inline-block' : 'none')};
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    width: 100%;
  }
`
const UlWrapper = styled.ul<UlWrapperType>`
  list-style-type: none;
  margin: 0;
  @media (max-width: 1025px) {
    display: ${(props) => (props.show ? 'flex' : 'none')};
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 0px 50px 10px;
    width: 100%;
  }
`

const LiHamburger = styled.li`
  display: none;
  @media (max-width: 1025px) {
    display: inline-block;
  }
`

const A = styled.a`
  font-size: 18px;
  color: ${(props) => props.theme.color?.primary};
  display: block;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
`

const WrapperToogleDarkMode = styled.div<WrapperToogleDarkModeTypes>`
  position: ${(props) => (props.position ? props.position : 'relative')};
  bottom: ${(props) => (props.bottom ? props.bottom : '0')};
`

const NavBar: React.FC = () => {
  const { scrollY } = useScroll()
  const { isDark } = useTheme()

  const [show, setShow] = useState(false)

  return (
    <Wrapper scroll={scrollY > 0 ? true : false} isDark={isDark}>
      <Logo>Amril Syaifa</Logo>
      <Ul>
        <LiHamburger>
          <HamburgerMenu onClick={() => setShow(!show)} open={show} />
        </LiHamburger>
        <LiWrapper show={show}>
          <UlWrapper show={show}>
            <Li>
              <A>About Us</A>
            </Li>
            <Li>
              <A>Service</A>
            </Li>
            <Li>
              <A>Portfolio</A>
            </Li>
            <Li>
              <Button>Hire me</Button>
            </Li>
            <Li>
              <WrapperToogleDarkMode position="absolute" top="2px" bottom="10px">
                <ToogleDarkMode />
              </WrapperToogleDarkMode>
            </Li>
          </UlWrapper>
        </LiWrapper>
      </Ul>
    </Wrapper>
  )
}

export default NavBar
