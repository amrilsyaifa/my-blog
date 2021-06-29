import React from 'react'
import { useState } from 'react'
import styled from 'styled-components'

interface SpanProps {
  open: boolean
}

const Wrap = styled.div`
  width: 40px;
  height: 30px;
  position: relative;
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-transition: 0.5s ease-in-out;
  -moz-transition: 0.5s ease-in-out;
  -o-transition: 0.5s ease-in-out;
  transition: 0.5s ease-in-out;
  cursor: pointer;
`
const Span1 = styled.span<SpanProps>`
  display: block;
  position: absolute;
  height: 6px;
  width: 100%;
  background: ${(props) => props.theme.color?.burnSienna};
  border-radius: 7px;
  opacity: 1;
  left: 0;
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: ${(props) => (props.open ? 'rotate(135deg)' : 'rotate(0deg)')};
  -webkit-transition: ${(props) => (props.open ? 'rotate(135deg)' : '0.25s ease-in-out')};
  -moz-transition: ${(props) => (props.open ? 'rotate(135deg)' : '0.25s ease-in-out')};
  -o-transition: ${(props) => (props.open ? 'rotate(135deg)' : '0.25s ease-in-out')};
  transition: 0.25s ease-in-out;
  top: ${(props) => (props.open ? '12px' : '0')};
`

const Span2 = styled.span<SpanProps>`
  display: block;
  position: absolute;
  height: 6px;
  width: 100%;
  background: ${(props) => props.theme.color?.burnSienna};
  border-radius: 7px;
  opacity: 1;
  left: 0;
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-transition: 0.25s ease-in-out;
  -moz-transition: 0.25s ease-in-out;
  -o-transition: 0.25s ease-in-out;
  transition: 0.25s ease-in-out;
  top: 12px;
  opacity: ${(props) => (props.open ? '0' : '1')};
  left: ${(props) => (props.open ? '-60px' : '0')};
`

const Span3 = styled.span<SpanProps>`
  display: block;
  position: absolute;
  height: 6px;
  width: 100%;
  background: ${(props) => props.theme.color?.burnSienna};
  border-radius: 7px;
  opacity: 1;
  left: 0;
  -webkit-transform: ${(props) => (props.open ? 'rotate(-135deg)' : 'rotate(0deg)')};
  -moz-transform: ${(props) => (props.open ? 'rotate(-135deg)' : 'rotate(0deg)')};
  -o-transform: ${(props) => (props.open ? 'rotate(-135deg)' : 'rotate(0deg)')};
  transform: ${(props) => (props.open ? 'rotate(-135deg)' : 'rotate(0deg)')};
  -webkit-transition: 0.25s ease-in-out;
  -moz-transition: 0.25s ease-in-out;
  -o-transition: 0.25s ease-in-out;
  transition: 0.25s ease-in-out;
  top: ${(props) => (props.open ? '12px' : '24px')};
`

const HamburgerMenu = () => {
  const [open, setOpen] = useState(false)
  return (
    <Wrap onClick={() => setOpen(!open)}>
      <Span1 open={open} />
      <Span2 open={open} />
      <Span3 open={open} />
    </Wrap>
  )
}

export default HamburgerMenu
