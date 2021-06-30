import React from 'react'
import styled from 'styled-components'
import Button from 'components/Button'
import HamburgerMenu from 'components/HamburgerMenu'
import ToogleDarkMode from 'components/Switch/ToogleDarkMode'
import useScroll from '@react-hooks-custom/use-scroll'
import useTheme from 'hooks/useTheme'

interface Props {
  scroll: boolean
  isDark: boolean
}
// background-color: ${(props) => props.theme.background?.primary};
const Wrapper = styled.section<Props>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: ${(props) => (props.scroll && props.isDark ? '70px' : '')};
  top: ${(props) => (props.scroll && props.isDark ? '0' : '')};
  position: ${(props) => (props.scroll && props.isDark ? 'fixed' : 'relative')};
  background-color: ${(props) =>
    props.scroll && props.isDark ? props.theme.color?.primary : props.theme.background?.primary};
  width: ${(props) => (props.scroll && props.isDark ? '100%' : '80%')};
  align-self: center;
  @media (max-width: 1025px) {
    width: ${(props) => (props.scroll && props.isDark ? '100%' : '85%')};
  }
  @media (max-width: 801px) {
    width: ${(props) => (props.scroll && props.isDark ? '100%' : '90%')};
  }
  @media (max-width: 600px) {
    width: ${(props) => (props.scroll && props.isDark ? '100%' : '92%')};
  }
  @media (max-width: 480px) {
    width: ${(props) => (props.scroll && props.isDark ? '100%' : '95%')};
  }
  @media (max-width: 320px) {
    width: ${(props) => (props.scroll && props.isDark ? '100%' : '98%')};
  }
`

const Logo = styled.div`
  color: ${(props) => props.theme.color?.primary};
  font-size: 24px;
  font-family: Ballet;
  cursor: pointer;
`

const Ul = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
`
const Li = styled.li`
  display: inline-block;
  padding-right: 30px;
`
const LiWrapper = styled.li`
  display: inline-block;
  padding-right: 30px;
  @media (max-width: 801px) {
    display: none;
  }
`

const LiHamburger = styled.li`
  padding-right: 30px;
  display: none;
  @media (max-width: 801px) {
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

const NavBar: React.FC = () => {
  const { scrollY } = useScroll()
  const { isDark } = useTheme()
  return (
    <Wrapper scroll={scrollY > 0 ? true : false} isDark={isDark}>
      <Logo>Amril Syaifa</Logo>
      <Ul>
        <LiWrapper>
          <Ul>
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
              <div style={{ position: 'absolute', top: 10 }}>
                <ToogleDarkMode />
              </div>
            </Li>
          </Ul>
        </LiWrapper>
        <LiHamburger>
          <HamburgerMenu />
        </LiHamburger>
      </Ul>
    </Wrapper>
  )
}

export default NavBar
