import React from 'react'
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

const AboutUs = () => {
  return (
    <Section>
      <Wrapper>
        <Label>About</Label>
        <WrapperDescription>
          <P fontSize="20px" fontWeight="bold" lineHeight="2.5em">
            <Image src="/images/amril-syaifa-yasin.jpeg" alt="amril-syaifa-yasin" />
            Sit commodo enim fugiat officia ut cillum consectetur eu reprehenderit commodo laborum veniam. Aliqua
            consectetur dolor qui veniam commodo incididunt sunt labore sunt consequat non sunt. Ea cupidatat ea Lorem
            consectetur culpa. Sit anim nostrud duis aute consectetur quis.
          </P>
          <P fontSize="20px" fontWeight="bold" lineHeight="2.5em" paddingTop="20px">
            Sit commodo enim fugiat officia ut cillum consectetur eu reprehenderit commodo laborum veniam. Aliqua
            consectetur dolor qui veniam commodo incididunt sunt labore sunt consequat non sunt. Ea cupidatat ea Lorem
            consectetur culpa. Sit anim nostrud duis aute consectetur quis.
          </P>
          <P fontSize="20px" fontWeight="bold" lineHeight="2.5em" paddingTop="20px">
            Sit commodo enim fugiat officia ut cillum consectetur eu reprehenderit commodo laborum veniam. Aliqua
            consectetur dolor qui veniam commodo incididunt sunt labore sunt consequat non sunt. Ea cupidatat ea Lorem
            consectetur culpa. Sit anim nostrud duis aute consectetur quis.
          </P>
        </WrapperDescription>
      </Wrapper>
    </Section>
  )
}

export default AboutUs
