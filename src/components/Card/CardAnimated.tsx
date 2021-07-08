import React, { useState, MouseEvent } from 'react'
import styled from 'styled-components'
import { CardComponentProps, CardProps } from './types'

const StyledCardContent = styled.div<CardProps>`
  background: transparent;
  transform: perspective(1000px) rotateX(${(props) => props.x}deg) rotateY(${(props) => props.y}deg)
    scale3d(${(props) => (props.scale ? '1.01, 1.01, 1.01' : '1, 1, 1')});
  transition: all 500ms cubic-bezier(0.3, 0.98, 0.52, 0.99) 0s;
`
const CardContainer = styled.div`
  border-radius: 24px;
  color: white;
  display: flex;
  flex-flow: column wrap;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  cursor: default;
  z-index: 1;
  transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1);
`

const StyledContent = styled.div`
  flex-direction: column;
  width: 100%;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  border-radius 8px;
  overflow: hidden;
`

const CardAnimated: React.FC<CardComponentProps> = ({ children }: CardComponentProps) => {
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const [isScale, setIsScale] = useState(false)

  const _onMouseMove = (e: MouseEvent) => {
    const currentTargetRect = e.currentTarget.getBoundingClientRect()
    const { height, width } = currentTargetRect
    const x = (e.nativeEvent.offsetX / height) * 10
    const y = (e.nativeEvent.offsetY / width) * 10
    setPositionX(Math.round(x))
    setPositionY(Math.round(y))
    setIsScale(true)
  }
  const _onMouseLeave = () => {
    setPositionX(0)
    setPositionY(0)
    setIsScale(false)
  }
  return (
    <StyledCardContent
      x={positionX}
      y={positionY}
      scale={isScale}
      onMouseMove={(e) => _onMouseMove(e)}
      onMouseLeave={_onMouseLeave}
    >
      <CardContainer>
        <StyledContent>{children}</StyledContent>
      </CardContainer>
    </StyledCardContent>
  )
}

export default CardAnimated
