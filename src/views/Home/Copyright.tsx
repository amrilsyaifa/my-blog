import React from 'react'
import styled, { keyframes } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { TextProps } from './types'

const Text = styled.div<TextProps>`
  color: ${(props) => (props.color ? props.color : props.theme.color?.secondary)};
  font-size: ${(props) => (props.fontSize ? props.fontSize : '16px')};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : 'normal')};
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : '')};
  padding-top: ${(props) => (props.paddingTop ? props.paddingTop : '')};
  padding-left: ${(props) => (props.paddingLeft ? props.paddingLeft : '')};
  padding-right: ${(props) => (props.paddingRight ? props.paddingRight : '')};
  cursor: ${(props) => (props.cursor ? props.cursor : '')};
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
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
  const { t } = useTranslation()

  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }
  return (
    <ContainerSocialMedia>
      <Row>
        <Text fontSize="12px">
          {t('This website is made using')}
          <Image src="/images/logo.svg" alt="react" />
          <Text onClick={() => openInNewTab('http://reactjs.org/')} paddingLeft="2px" fontSize="12px" color="#0000EE">
            ReactJS
          </Text>
          <Text fontSize="12px" paddingRight="10px">
            ,
          </Text>
          <Text paddingRight="5px" fontSize="12px">
            {t('source code')}
          </Text>
          <Text
            onClick={() => openInNewTab('https://github.com/amrilsyaifa/my-blog/tree/main')}
            cursor="pointer"
            color="#0000EE"
            paddingRight="5px"
            fontSize="12px"
          >
            {t('source code')}
          </Text>
        </Text>
      </Row>
    </ContainerSocialMedia>
  )
}

export default Copyright
