import React from 'react'
import styled from 'styled-components'

type Props = {
  children: string
}

const Btn = styled.button`
  background: ${(props) => props.theme.color?.burnSienna};
  color: ${(props) => props.theme.color?.primary};
  font-size: 16px;
  font-weight: 600;
  padding: 0.5em 1em;
  cursor: pointer;
  border-radius: 8px;
  border: none;
  &:hover {
    opacity: 0.5;
  }
`

const Button: React.FC<Props> = ({ children, ...props }: Props) => {
  return <Btn {...props}>{children}</Btn>
}

export default Button
