import React from 'react'
import styled from 'styled-components'
import NavBar from 'views/Home/NavBar'
import Page from 'components/Layout/Page'

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`

const Text = styled.section`
  color: ${(props) => props.theme.color?.primary};
  font-size: 16px;
  text-transform: capitalize;
`

const Home: React.FC = () => {
  return (
    <Page>
      <NavBar />
      <Content>
        <Text>content</Text>
      </Content>
    </Page>
  )
}

export default Home
