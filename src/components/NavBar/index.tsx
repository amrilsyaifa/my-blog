import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import Button from 'components/Button'
import HamburgerMenu from 'components/HamburgerMenu'
import ToogleDarkMode from 'components/Switch/ToogleDarkMode'
import useScroll from '@react-hooks-custom/use-scroll'
import useTheme from 'hooks/useTheme'
import useClickOutside from 'hooks/useClickOutside'
import {
  Props,
  ListWrapperType,
  UlWrapperType,
  WrapperType,
  WrapperToogleDarkModeTypes,
  LogoType,
  AType,
} from './types'

const Wrapper = styled.section<WrapperType>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: ${(props) => ((props.scroll && props.isDark) || (props.scroll && !props.isDark) ? '80px' : '')};
  top: ${(props) => ((props.scroll && props.isDark) || (props.scroll && !props.isDark) ? '0' : '0')};
  position: ${(props) => ((props.scroll && props.isDark) || (props.scroll && !props.isDark) ? 'fixed' : 'absolute')};
  background-color: ${(props) =>
    (props.scroll && props.isDark) || (props.scroll && !props.isDark)
      ? props.theme.color?.secondary
      : props.theme.background?.secondary};
  width: 100%;
  align-self: center;
  z-index: 2;
  padding-top: 10px;
`

const Logo = styled.div<LogoType>`
  color: ${(props) =>
    (props.scroll && props.isDark) || (props.scroll && !props.isDark)
      ? props.theme.background?.secondary
      : props.theme.color?.secondary};
  font-size: 24px;
  font-family: Ballet;
  cursor: pointer;
  padding-left: 10%;
  z-index: 10;
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
  position: relative;
  @media (max-width: 1025px) {
    padding-right: 0px;
    padding-left: 10px;
    display: flex;
    width: 98%;
    margin-bottom: 5px;
    z-index: 2;
    &:hover {
      background-color: rgb(0 0 0 / 4%);
    }
  }
`

const LiWrapper = styled.li<ListWrapperType>`
  display: inline-block;
  @media (max-width: 1025px) {
    display: inline-block;
    position: absolute;
    top: ${(props) => (props.show ? '90px' : '-300px')};
    left: 0px;
    width: 100%;
    background-color: ${(props) => props.theme.background?.secondary};
    box-sizing: border-box;
    box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px,
      rgb(0 0 0 / 1%) 0px 24px 32px;
    transition: all 0.5s ease;
    z-index: 2;
  }
`
const UlWrapper = styled.ul<UlWrapperType>`
  list-style-type: none;
  margin: 0;
  @media (max-width: 1025px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px 0px 50px 0px;
    width: 100%;
    background-color: ${(props) =>
      (props.scroll && props.isDark) || (props.scroll && !props.isDark)
        ? props.theme.color?.secondary
        : props.theme.background?.secondary};
  }
`

const LiHamburger = styled.li`
  display: none;
  @media (max-width: 1025px) {
    display: inline-block;
    z-index: 2;
  }
`

const A = styled.a<AType>`
  font-size: 18px;
  color: ${(props) =>
    (props.scroll && props.isDark) || (props.scroll && !props.isDark)
      ? props.theme.background?.secondary
      : props.theme.color?.secondary};
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
  @media (max-width: 1025px) {
    bottom: -40px;
  }
`
const NavBar: React.FC<Props> = ({ onClick }: Props) => {
  const { scrollY } = useScroll()
  const { isDark } = useTheme()

  const [show, setShow] = useState(false)

  const liWrapperRef = useRef()
  useClickOutside(liWrapperRef, () => {
    setShow(false)
  })

  return (
    <Wrapper scroll={scrollY > 0 ? true : false} isDark={isDark} ref={liWrapperRef}>
      <Logo onClick={() => onClick('home')} scroll={scrollY > 0 ? true : false} isDark={isDark}>
        Amril Syaifa
      </Logo>
      <Ul>
        <LiHamburger>
          <HamburgerMenu onClick={() => setShow(!show)} open={show} />
        </LiHamburger>
        <LiWrapper show={show}>
          <UlWrapper show={show} scroll={scrollY > 0 ? true : false} isDark={isDark}>
            <Li>
              <A
                onClick={() => {
                  onClick('about')
                  setShow(!show)
                }}
                scroll={scrollY > 0 ? true : false}
                isDark={isDark}
              >
                About Us
              </A>
            </Li>
            <Li>
              <A
                onClick={() => {
                  onClick('portfolio')
                  setShow(!show)
                }}
                scroll={scrollY > 0 ? true : false}
                isDark={isDark}
              >
                Portfolio
              </A>
            </Li>
            <Li>
              <A
                onClick={() => {
                  onClick('contact')
                  setShow(!show)
                }}
                scroll={scrollY > 0 ? true : false}
                isDark={isDark}
              >
                Contact
              </A>
            </Li>
            <Li>
              <Button
                onClick={() => {
                  onClick('hire')
                  setShow(!show)
                }}
              >
                Hire me
              </Button>
            </Li>
            <Li>
              <WrapperToogleDarkMode position="absolute" bottom="-10px">
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
