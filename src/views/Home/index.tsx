import React, { useRef } from 'react'
import styled from 'styled-components'
import NavBar from 'components/NavBar'
import Page from 'components/Layout/Page'
import SectionHead from './SectionHead'
import AboutUs from './AboutUs'
import PortFolio from './PortFolio'
import Contact from './Contact'

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  width: 100%;
  min-height: 100vh;
  position: absolute;
  top: 0;
`

const WrapperSectionHead = styled.div`
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

const Home: React.FC = () => {
  const myHome = useRef(null)
  const myAboutUs = useRef(null)
  const myPortfolio = useRef(null)
  const myContact = useRef(null)

  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  const onNavigate = (e) => {
    switch (e) {
      case 'home':
        myHome.current.scrollIntoView({ behavior: 'smooth' })
        break
      case 'about':
        myAboutUs.current.scrollIntoView({ behavior: 'smooth' })
        break
      case 'portfolio':
        myPortfolio.current.scrollIntoView({ behavior: 'smooth' })
        break
      case 'contact':
        myContact.current.scrollIntoView({ behavior: 'smooth' })
        break
      case 'hire':
        openInNewTab('mailto:amrilsyaifa@gmail.com?subject=SendMail&body=Description')
        break
      default:
        break
    }
  }
  return (
    <Page>
      <NavBar onClick={(e) => onNavigate(e)} />
      <Content>
        <WrapperSectionHead>
          <SectionHead ref={myHome} />
        </WrapperSectionHead>
        <AboutUs ref={myAboutUs} />
        <PortFolio ref={myPortfolio} />
        <Contact ref={myContact} />
      </Content>
    </Page>
  )
}

export default Home
