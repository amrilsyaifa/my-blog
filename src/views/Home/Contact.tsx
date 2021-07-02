import React, { forwardRef } from 'react'
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

const Text = styled.div<TextProps>`
  color: ${(props) => props.theme.color?.secondary};
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

const Underscore = styled.div`
  width: 200px;
  height: 30px;
  margin-left: 10px;
  border-bottom: 2px solid ${(props) => props.theme.default?.color?.burnSienna};
`

const Contact = forwardRef<HTMLInputElement>(function Contact(_Props, ref) {
  return (
    <Section ref={ref}>
      <Wrapper>
        <Label>Contact</Label>
        <Text fontSize="30px" fontWeight="bold" lineHeight="2em" paddingTop="20px">
          Any type of question & discussion.
        </Text>
        <Row>
          <Text fontSize="20px" fontWeight="bold" lineHeight="2em" paddingTop="20px">
            Lets talk
          </Text>
          <Underscore />
        </Row>
        <Text fontSize="25px" fontWeight="bold" lineHeight="2em" paddingTop="20px">
          amrilsyaifa@gmail.com
        </Text>
        <Text fontSize="20px" lineHeight="2em" paddingTop="20px">
          Whatsapp: +62 822 7227 1374
        </Text>
      </Wrapper>
    </Section>
  )
})

export default Contact
