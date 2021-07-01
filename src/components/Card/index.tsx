import React from 'react'
import styled from 'styled-components'

const Body = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${(props) => props.theme.background?.secondary};
  border-radius: 24px;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px,
    rgb(0 0 0 / 1%) 0px 24px 32px;
  overflow: hidden;
`

type Props = {
  children: JSX.Element
}

const Card: React.FC<Props> = ({ children }: Props) => {
  return <Body>{children}</Body>
}

export default Card
