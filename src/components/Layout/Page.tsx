import React from 'react'
import styled from 'styled-components'

interface Props {
  children: React.ReactNode
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  background-color: ${(props) => props.theme.background?.secondary};
`

const Page: React.FC<Props> = ({ children }: Props) => {
  return <Wrapper>{children}</Wrapper>
}

export default Page
