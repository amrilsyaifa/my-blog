import React from 'react'
import styled from 'styled-components'

type Props = {
  children: string
  primary?: boolean
}

const Button: React.FC<Props> = ({ children, primary = true, ...props }: Props) => {
  const Button = styled.button`
    background: ${primary ? 'rgb(248, 209, 47)' : 'rgb(43, 47, 54)'};
    color: ${primary ? 'rgb(30, 32, 38, 0.8);' : 'rgb(230, 232, 234)'};
    font-size: 1em;
    font-weight: 600;
    padding: 0.5em 1em;
    cursor: pointer;
    border: 2px solid ${primary ? 'rgb(248, 209, 47)' : 'rgb(43, 47, 54)'};
    border-radius: 8px;
    &:hover {
      background: ${primary ? 'rgb(214, 173, 10)' : 'rgb(31, 34, 39)'};
      border: 2px solid ${primary ? 'rgb(214, 173, 10)' : 'rgb(31, 34, 39)'};
    }
  `
  return <Button {...props}>{children}</Button>
}

export default Button
