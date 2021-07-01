import React from 'react'
import styled from 'styled-components'
import Typewriter from 'typewriter-effect'
import { GitHub, Instagram, Linkedin } from 'react-feather'
import useTheme from 'hooks/useTheme'
import { TextProps, PropsRow } from './types'

const Section1 = styled.section`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  column-gap: 1em;
  row-gap: 1em;
  width: 100%;
  min-height: 100vh;
  position: relative;
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin-left: 10%;
  justify-content: center;
  @media (max-width: 600px) {
    margin-left: 0;
    margin-top: 100px;
    width: 100%;
    justify-content: start;
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

const SectionFooter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  bottom: 0;
  width: 90%;
  margin-left: 10%;
  padding-bottom: 50px;
  @media (max-width: 600px) {
    margin-left: 0;
    width: 100%;
  }
`

const Row = styled.div<PropsRow>`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: ${(props) => (props.marginLeft ? props.marginLeft : '0px')};
`

const WrapIcon = styled.div`
  cursor: pointer;
`

const SectionHead = () => {
  const { theme } = useTheme()

  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }
  return (
    <Section1>
      <Wrapper>
        <Text fontSize="50px" fontWeight="bold">
          Hello!
        </Text>
        <Text fontSize="60px" fontWeight="bold" paddingTop="20px" lineHeight="70px">
          {`I'm`} Amril Syaifa Yasin
        </Text>
        <Text fontSize="30px" fontWeight="bold" paddingTop="20px" lineHeight="40px">
          4 Years experience as :
        </Text>
        <Text fontSize="30px" fontWeight="bold" lineHeight="40px">
          <Typewriter
            options={{
              strings: ['Software engineer', 'Web Developer', 'Android Developer'],
              autoStart: true,
              loop: true,
            }}
          />
        </Text>
      </Wrapper>
      <SectionFooter>
        <Row>
          <WrapIcon onClick={() => openInNewTab('https://github.com/amrilsyaifa')}>
            <GitHub color={theme.color.primary} size={20} />
          </WrapIcon>
          <Text paddingLeft="3px" fontSize="14px" fontWeight="bold">
            @amrilsyaifa
          </Text>
        </Row>
        <Row marginLeft="12px">
          <WrapIcon onClick={() => openInNewTab('https://www.linkedin.com/in/amril-syaifa-yasin-506530141/')}>
            <Linkedin color={theme.color.primary} size={20} />
          </WrapIcon>
          <Text paddingLeft="3px" fontSize="14px" fontWeight="bold">
            Amril Syaifa Yasin
          </Text>
        </Row>
        <Row marginLeft="12px">
          <WrapIcon onClick={() => openInNewTab('https://www.instagram.com/amril.syaifa/')}>
            <Instagram color={theme.color.primary} size={20} />
          </WrapIcon>
          <Text paddingLeft="3px" fontSize="14px" fontWeight="bold">
            @amrilsyaifa
          </Text>
        </Row>
      </SectionFooter>
    </Section1>
  )
}

export default SectionHead
