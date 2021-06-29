import React from 'react'
import styled from 'styled-components'
import NavBar from 'components/NavBar'
import Page from 'components/Layout/Page'

interface TextProps {
  lineHeight?: string
  paddingTop?: string
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  align-self: center;
  width: 80%;
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
  grid-template-columns: repeat(2, 1fr);
  column-gap: 1em;
  row-gap: 1em;
  width: 100%;
  @media (max-width: 600px) {
    column-gap: 0.5em;
    row-gap: 0.5em;
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
  width: 100%;
`
const Right = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Text = styled.div<TextProps>`
  color: ${(props) => props.theme.color?.primary};
  font-size: 16px;
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : '')};
  padding-top: ${(props) => (props.paddingTop ? props.paddingTop : '')};
`

const TextName = styled.div<TextProps>`
  color: ${(props) => props.theme.color?.primary};
  font-size: 24px;
  font-weight: 700;
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : '')};
  padding-top: ${(props) => (props.paddingTop ? props.paddingTop : '')};
`
const TextDescription = styled.div<TextProps>`
  color: ${(props) => props.theme.color?.primary};
  font-size: 20px;
  font-weight: 500;
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : '')};
  padding-top: ${(props) => (props.paddingTop ? props.paddingTop : '')};
`

const Home: React.FC = () => {
  return (
    <Page>
      <NavBar />
      <Content>
        <Section1>
          <Left>
            <Text>Hello!</Text>
            <TextName paddingTop="20px" lineHeight="25px">
              {`I'm`} Amril Syaifa Yasin
            </TextName>
            <TextDescription paddingTop="20px" lineHeight="25px">
              Freelance Software Developer & Android Engineer
            </TextDescription>
            <Text paddingTop="10px" lineHeight="25px">
              A passionate and enthusiastic web and mobile developer with 3+ years of experience. I love new challenges
              to help me invest all my skills and experience into succeeding them
            </Text>
          </Left>
          <Right>
            <Text></Text>
          </Right>
        </Section1>
      </Content>
    </Page>
  )
}

export default Home
