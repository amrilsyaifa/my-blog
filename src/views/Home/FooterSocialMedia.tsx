import React from 'react'
import styled from 'styled-components'
import { GitHub, Instagram, Linkedin } from 'react-feather'
import useTheme from 'hooks/useTheme'
import { TextProps, PropsRow } from './types'

const Text = styled.div<TextProps>`
  color: ${(props) => props.theme.color?.primary};
  font-size: ${(props) => (props.fontSize ? props.fontSize : '16px')};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : 'normal')};
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : '')};
  padding-top: ${(props) => (props.paddingTop ? props.paddingTop : '')};
  padding-left: ${(props) => (props.paddingLeft ? props.paddingLeft : '')};
`

const ContainerSocialMedia = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 1em;
  position: absolute;
  bottom: 0;
  width: 90%;
  margin-left: 10%;
  padding-bottom: 50px;
  @media (max-width: 600px) {
    margin-left: 0;
    width: 100%;
    grid-template-columns: 1fr 2fr 1fr;
  }
  @media (max-width: 450px) {
    grid-template-columns: repeat(2, 1fr);
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

const FooterSocialMedia = () => {
  const { theme } = useTheme()

  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }
  return (
    <ContainerSocialMedia>
      <Row>
        <WrapIcon onClick={() => openInNewTab('https://github.com/amrilsyaifa')}>
          <GitHub color={theme.color.primary} size={20} />
        </WrapIcon>
        <Text paddingLeft="3px" fontSize="14px" fontWeight="bold">
          @amrilsyaifa
        </Text>
      </Row>
      <Row>
        <WrapIcon onClick={() => openInNewTab('https://www.linkedin.com/in/amril-syaifa-yasin-506530141/')}>
          <Linkedin color={theme.color.primary} size={20} />
        </WrapIcon>
        <Text paddingLeft="3px" fontSize="14px" fontWeight="bold">
          Amril Syaifa Yasin
        </Text>
      </Row>
      <Row>
        <WrapIcon onClick={() => openInNewTab('https://www.instagram.com/amril.syaifa/')}>
          <Instagram color={theme.color.primary} size={20} />
        </WrapIcon>
        <Text paddingLeft="3px" fontSize="14px" fontWeight="bold">
          @amrilsyaifa
        </Text>
      </Row>
    </ContainerSocialMedia>
  )
}

export default FooterSocialMedia
