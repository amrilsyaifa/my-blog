import React from 'react'
import styled from 'styled-components'
import Button from 'components/Button'
import HamburgerMenu from 'components/HamburgerMenu'

const Wrapper = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.background?.primary};
  width: 80%;
  align-self: center;
  @media (max-width: 1025px) {
    width: 85%;
  }
  @media (max-width: 801px) {
    width: 90%;
  }
  @media (max-width: 600px) {
    width: 92%;
  }
  @media (max-width: 480px) {
    width: 95%;
  }
  @media (max-width: 320px) {
    width: 98%;
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
  display: inline;
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
  return (
    <Wrapper>
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
