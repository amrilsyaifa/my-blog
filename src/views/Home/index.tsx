import React from 'react'
import styled from 'styled-components'
import NavBar from 'components/NavBar'
import Page from 'components/Layout/Page'
import Typewriter from 'typewriter-effect'

interface TextProps {
  lineHeight?: string
  paddingTop?: string
  paddingLeft?: string
  fontSize?: string
  fontWeight?: string
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  align-self: center;
  width: 100%;
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

const Section1 = styled.section`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  column-gap: 1em;
  row-gap: 1em;
  width: 100%;
  min-height: 85vh;
  @media (max-width: 600px) {
    column-gap: 0.5em;
    row-gap: 0.5em;
    width: 100%;
  }
  @media (max-width: 480px) {
    column-gap: 0.7em;
    row-gap: 0.7em;
  }
  @media (max-width: 320px) {
    column-gap: 0.9em;
    row-gap: 0.9em;
  }
`

const Left = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin-left: 10%;
  margin-top: 100px;
  @media (max-width: 600px) {
    margin-left: 0;
    margin-top: 30px;
  }
`

const Text = styled.div<TextProps>`
  color: ${(props) => props.theme.color?.primary};
  font-size: ${(props) => (props.fontSize ? props.fontSize : '16px')};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : 'normal')};
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : '')};
  padding-top: ${(props) => (props.paddingTop ? props.paddingTop : '')};
  padding-left: ${(props) => (props.paddingLeft ? props.paddingLeft : '')};
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Home: React.FC = () => {
  return (
    <Page>
      <NavBar />
      <Content>
        <Section1>
          <Left>
            <Text fontSize="50px" fontWeight="bold">
              Hello!
            </Text>
            <Text fontSize="60px" fontWeight="bold" paddingTop="20px" lineHeight="70px">
              {`I'm`} Amril Syaifa Yasin
            </Text>
            <Text fontSize="30px" fontWeight="bold" paddingTop="20px" lineHeight="30px">
              4 Years experience
            </Text>
            <Row>
              <Text fontSize="30px" fontWeight="bold" paddingTop="20px" lineHeight="30px">
                As :
              </Text>
              <Text paddingLeft="10px" fontSize="30px" fontWeight="bold" paddingTop="20px" lineHeight="30px">
                <Typewriter
                  options={{
                    strings: ['Software engineer', 'Web Developer', 'Android Developer'],
                    autoStart: true,
                    loop: true,
                  }}
                />
              </Text>
            </Row>
          </Left>
        </Section1>
      </Content>
    </Page>
  )
}

export default Home
