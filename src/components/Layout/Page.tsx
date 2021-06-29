import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
  children: [ReactNode, ReactNode]
}

const Wrapper = styled.body`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  background-color: ${(props) => props.theme.background?.primary};
`

const Page: React.FC<Props> = ({ children }: Props) => {
  return <Wrapper>{children}</Wrapper>
}

export default Page
