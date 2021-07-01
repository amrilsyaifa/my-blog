import React, { forwardRef } from 'react'
import styled from 'styled-components'
import Typewriter from 'typewriter-effect'
import FooterSocialMedia from './FooterSocialMedia'
import { TextProps } from './types'

const Section = styled.section`
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
  color: ${(props) => props.theme.color?.secondary};
  font-size: ${(props) => (props.fontSize ? props.fontSize : '16px')};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : 'normal')};
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : '')};
  padding-top: ${(props) => (props.paddingTop ? props.paddingTop : '')};
  padding-left: ${(props) => (props.paddingLeft ? props.paddingLeft : '')};
`

const SectionHead = forwardRef<HTMLInputElement>(function SectionHead(_Props, ref) {
  return (
    <Section ref={ref}>
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
      <FooterSocialMedia />
    </Section>
  )
})

export default SectionHead
