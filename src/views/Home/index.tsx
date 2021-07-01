import React from 'react'
import styled from 'styled-components'
import NavBar from 'components/NavBar'
import Page from 'components/Layout/Page'
import SectionHead from './SectionHead'

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  width: 100%;
  min-height: 100vh;
  position: absolute;
  top: 0;
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
  return (
    <Page>
      <NavBar />
      <Content>
        <SectionHead />
      </Content>
    </Page>
  )
}

export default Home
