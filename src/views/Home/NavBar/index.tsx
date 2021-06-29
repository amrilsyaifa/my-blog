import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.background?.primary};
  padding: 10px;
  border-bottom: 2px solid rgba(133, 133, 133, 0.1);
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
`

const Text = styled.section`
  color: ${(props) => props.theme.color?.primary};
  font-size: 24px;
  text-transform: capitalize;
`

const NavBar: React.FC = () => {
  return (
    <Wrapper>
      <Text>navbar</Text>
    </Wrapper>
  )
}

export default NavBar
