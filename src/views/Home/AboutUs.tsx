import React, { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { TextProps } from './types'

const Section = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 50vh;
  position: relative;
  background-color: ${(props) => props.theme.background?.primary};
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

const WrapperDescription = styled.div`
  display: block;
`

const Image = styled.img`
  width: 15rem;
  height: 15rem;
  border-radius: 12rem;
  float: left;
  margin-right: 50px;
  @media (max-width: 600px) {
    float: none;
    display: block;
    margin: 0 auto;
    margin-bottom: 20px;
  }
`

const P = styled.p<TextProps>`
  color: ${(props) => props.theme.color?.secondary};
  font-size: ${(props) => (props.fontSize ? props.fontSize : '16px')};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : 'normal')};
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : '')};
  padding-top: ${(props) => (props.paddingTop ? props.paddingTop : '')};
  padding-left: ${(props) => (props.paddingLeft ? props.paddingLeft : '')};
`

const AboutUs = forwardRef<HTMLInputElement>(function AboutUs(_Props, ref) {
  const { t } = useTranslation()
  return (
    <Section ref={ref}>
      <Wrapper>
        <Label>{t('About Us')}</Label>
        <WrapperDescription>
          <P fontSize="20px" fontWeight="bold" lineHeight="2.5em">
            <Image src="/images/amril-syaifa-yasin.jpeg" alt="amril-syaifa-yasin" />
            {t('Hi, my name is')} Amril.
          </P>
          <P fontSize="20px" fontWeight="bold" lineHeight="2.5em" paddingTop="20px">
            {t(
              `I am a profesional fullstack developer from Medan, Indonesia. i Have been working as fullstack developer for 4 years. everyday I work as a fullstack developer with 2 cups of coffee a day`,
            )}
            .
          </P>
          <P fontSize="20px" fontWeight="bold" lineHeight="2.5em" paddingTop="20px">
            {t(
              'Currently I have handled several successful projects, starting from the project or continuing the project',
            )}
            .
          </P>
          <P fontSize="20px" fontWeight="bold" lineHeight="2.5em" paddingTop="20px">
            {t(`Actualy i love cats but don't have cats, Also I don't like smoking nor dancing`)}.
          </P>
        </WrapperDescription>
      </Wrapper>
    </Section>
  )
})

export default AboutUs
