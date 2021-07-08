import React, { forwardRef } from 'react'
import styled from 'styled-components'
import CardAnimated from 'components/Card/CardAnimated'
import { TextProps, ImgProps } from './types'

const Section = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 50vh;
  position: relative;
  background-color: ${(props) => props.theme.background?.secondary};
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 10%;
  padding-right: 10%;
  padding-top: 100px;
  padding-bottom: 100px;
  @media (max-width: 600px) {
    padding-left: 2%;
    padding-right: 2%;
  }
`

const Label = styled.label`
  font-size: 30px;
  color: ${(props) => props.theme.default.color?.burnSienna};
  text-decoration: none;
  font-weight: bold;
  &:hover {
    opacity: 0.5;
  }
`

const Text = styled.div<TextProps>`
  color: ${(props) => props.theme.color?.secondary};
  font-size: ${(props) => (props.fontSize ? props.fontSize : '16px')};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : 'normal')};
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : '')};
  padding-top: ${(props) => (props.paddingTop ? props.paddingTop : '')};
  padding-left: ${(props) => (props.paddingLeft ? props.paddingLeft : '')};
`

const WrapPortfolio = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 2em;
  row-gap: 2em;
  flex-direction: row;
  min-width: 50%;
  align-self: center;
  margin-top: 30px;
  @media (max-width: 1025px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
  }
`

const ImgPortfolio = styled.img<ImgProps>`
  width: ${(props) => (props.width ? props.width : '200px')};
  height: ${(props) => (props.height ? props.height : '200px')};
  cursor: pointer;
`
const Portfolio = forwardRef<HTMLInputElement>(function Portfolio(_Props, ref) {
  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  return (
    <Section ref={ref}>
      <Wrapper>
        <Label>Portfolio</Label>
        <Text fontSize="30px" fontWeight="bold" lineHeight="2em" paddingTop="20px">
          below is a portfolio that I have worked on.
        </Text>
        <WrapPortfolio>
          <CardAnimated>
            <ImgPortfolio
              width="220px"
              src="/images/immap.png"
              alt="immap"
              onClick={() => openInNewTab('https://careers.immap.org/')}
            />
          </CardAnimated>
          <CardAnimated>
            <ImgPortfolio
              width="220px"
              src="/images/lerero.svg"
              alt="lerero"
              onClick={() => openInNewTab('https://learning.lerero.com/')}
            />
          </CardAnimated>
          <CardAnimated>
            <ImgPortfolio
              width="220px"
              src="/images/logo-klik-adzkia.png"
              alt="klik-adzkia"
              onClick={() => openInNewTab('https://play.google.com/store/apps/details?id=com.klik.adzkia&hl=in&gl=US')}
            />
          </CardAnimated>
          <CardAnimated>
            <ImgPortfolio
              width="150px"
              src="/images/pln.png"
              alt="pln-ckr"
              onClick={() => openInNewTab('https://play.google.com/store/apps/details?id=com.plnckr&hl=in&gl=US')}
            />
          </CardAnimated>
        </WrapPortfolio>
      </Wrapper>
    </Section>
  )
})

export default Portfolio
