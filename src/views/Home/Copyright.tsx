import React from 'react'
import styled, { keyframes } from 'styled-components'
import { TextProps } from './types'

const Text = styled.div<TextProps>`
  color: ${(props) => (props.color ? props.color : props.theme.color?.secondary)};
  font-size: ${(props) => (props.fontSize ? props.fontSize : '16px')};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : 'normal')};
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : '')};
  padding-top: ${(props) => (props.paddingTop ? props.paddingTop : '')};
  padding-left: ${(props) => (props.paddingLeft ? props.paddingLeft : '')};
`

const ContainerSocialMedia = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 5px;
  width: 90%;
  margin-left: 10%;
  @media (max-width: 600px) {
    width: 100%;
    margin-left: 0;
  }
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const Image = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 5px;
  animation: ${spin} 2s linear infinite;
`

const Copyright = () => {
  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }
  return (
    <ContainerSocialMedia>
      <Row>
        <Text fontSize="12px">This website is made using</Text>
        <Image src="/images/logo.svg" alt="react" />
        <Text onClick={() => openInNewTab('http://reactjs.org/')} paddingLeft="2px" fontSize="12px" color="#0000EE">
          ReactJS
        </Text>
      </Row>
    </ContainerSocialMedia>
  )
}

export default Copyright
