import React from 'react'
import styled, { keyframes } from 'styled-components'

const jump = keyframes`
  0% {
    margin-top: 0;
  }
  35% {
    margin-top: -50px;
  }
  70% {
    margin-top: 0px;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100% !important;
  position: absolute;
  width: 100% !important;
  background-color: ${(props) => props.theme.background?.secondary};
`

const Loader = styled.div`
  width: 150px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Circle = styled.div`
  width: 20px;
  height: 20px;
  background: rgb(248, 209, 47);
  border-radius: 50%;
  animation: ${jump} 1s linear infinite;
  margin: 0 10px;
`
const Circle1 = styled.div`
  width: 20px;
  height: 20px;
  background: rgb(248, 209, 47);
  border-radius: 50%;
  animation: ${jump} 1s linear infinite;
  margin: 0 10px;
  animation-delay: 0.2s;
`

const Circle2 = styled.div`
  width: 20px;
  height: 20px;
  background: rgb(248, 209, 47);
  border-radius: 50%;
  animation: ${jump} 1s linear infinite;
  margin: 0 10px;
  animation-delay: 0.4s;
`

const Text = styled.div`
  font-family: arial;
  font-size: 20px;
  color: ${(props) => props.theme.color?.secondary};
`

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <Loader>
        <Circle />
        <Circle1 />
        <Circle2 />
      </Loader>
      <Text>We are almost there...</Text>
    </Wrapper>
  )
}

export default PageLoader
