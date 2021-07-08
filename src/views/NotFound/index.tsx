import React from 'react'
import styled from 'styled-components'
import history from 'routerHistory'

const Body = styled.div`
  width: 100%;
  height: 98vh;
`
const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(#0c0e10, #446182);
`

const Ground = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 25vh;
  background: #0c0e10;
`

const Container = styled.div`
  position: relative;
  margin: 0 auto;
  width: 85%;
  height: 70vh;
  padding-bottom: 25vh;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  @media (max-width: 1100px) {
    width: 100%;
  }
`

const LeftSection = styled.div`
  width: 40%;
`

const InnerContent = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 900px) {
    left: 0;
  }
  @media (max-width: 711px) {
    top: 20%;
    align-items: start;
  }
`

const H1Heading = styled.h1`
  text-align: center;
  font-size: 9em;
  line-height: 1.3em;
  margin: 2rem 0 0.5rem 0;
  padding: 0;
  text-shadow: 0 0 1rem #fefefe;
  color: #f5f6fa;
  @media (max-width: 900px) {
    font-size: 7em;
    text-align: left;
  }
`
const PSubHeading = styled.p`
  text-align: center;
  max-width: 480px;
  font-size: 1.5em;
  line-height: 1.15em;
  padding: 0 1rem;
  margin: 0 auto;
  color: #f5f6fa;
  @media (max-width: 900px) {
    font-size: 1.2em;
    text-align: left;
  }
`

const RightSection = styled.div`
  width: 50%;
  position: relative;
  @media (max-width: 900px) {
    width: 40%;
    margin-left: 10%;
  }
`

const SVG = styled.svg`
  position: absolute;
  bottom: 0;
  padding-top: 10vh;
  padding-left: 1vh;
  max-width: 100%;
  max-height: 100%;
`

const BenchLegs = styled.g`
  fill: #0c0e10;
`

const TopBench = styled.g`
  stroke: #0c0e10;
  stroke-width: 1px;
  fill: #5b3e2b;
`
const BottomBench = styled.g`
  stroke: #0c0e10;
  stroke-width: 1px;
  fill: #5b3e2b;
`

const LampDetail = styled.path`
  fill: #202425;
`

const LampAccent = styled.path`
  fill: #2c3133;
`
const LampLight = styled.circle`
  fill: #efefef;
`
const LampBottom = styled.path`
  fill: linear-gradient(#202425, #0c0e10);
`
const Button = styled.button`
  background: #ffffff;
  margin-top: 20px;
  text-shadow: 0 0 1rem #fefefe;
  width: 80px;
  height: 30px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  &:hover {
    background: #cacaca;
  }
`

const NotFound: React.FC = () => {
  return (
    <Body>
      <Background>
        <Ground />
      </Background>
      <Container>
        <LeftSection>
          <InnerContent>
            <H1Heading>404</H1Heading>
            <PSubHeading>Looks like the page you were looking for is no longer here.</PSubHeading>
            <Button onClick={() => history.push('/')}>Back</Button>
          </InnerContent>
        </LeftSection>
        <RightSection>
          <SVG xmlns="http://www.w3.org/2000/svg" viewBox="51.5 -15.288 385 505.565">
            <BenchLegs>
              <path
                d="M202.778,391.666h11.111v98.611h-11.111V391.666z M370.833,390.277h11.111v100h-11.111V390.277z M183.333,456.944h11.111
          v33.333h-11.111V456.944z M393.056,456.944h11.111v33.333h-11.111V456.944z"
              ></path>
            </BenchLegs>
            <TopBench>
              <path
                d="M396.527,397.917c0,1.534-1.243,2.777-2.777,2.777H190.972c-1.534,0-2.778-1.243-2.778-2.777v-8.333
          c0-1.535,1.244-2.778,2.778-2.778H393.75c1.534,0,2.777,1.243,2.777,2.778V397.917z M400.694,414.583
          c0,1.534-1.243,2.778-2.777,2.778H188.194c-1.534,0-2.778-1.244-2.778-2.778v-8.333c0-1.534,1.244-2.777,2.778-2.777h209.723
          c1.534,0,2.777,1.243,2.777,2.777V414.583z M403.473,431.25c0,1.534-1.244,2.777-2.778,2.777H184.028
          c-1.534,0-2.778-1.243-2.778-2.777v-8.333c0-1.534,1.244-2.778,2.778-2.778h216.667c1.534,0,2.778,1.244,2.778,2.778V431.25z"
              ></path>
            </TopBench>
            <BottomBench>
              <path
                d="M417.361,459.027c0,0.769-1.244,1.39-2.778,1.39H170.139c-1.533,0-2.777-0.621-2.777-1.39v-4.86
          c0-0.769,1.244-0.694,2.777-0.694h244.444c1.534,0,2.778-0.074,2.778,0.694V459.027z"
              ></path>
              <path d="M185.417,443.75H400c0,0,18.143,9.721,17.361,10.417l-250-0.696C167.303,451.65,185.417,443.75,185.417,443.75z"></path>
            </BottomBench>
            <g id="lamp">
              <LampDetail
                d="M125.694,421.997c0,1.257-0.73,3.697-1.633,3.697H113.44c-0.903,0-1.633-2.44-1.633-3.697V84.917
          c0-1.257,0.73-2.278,1.633-2.278h10.621c0.903,0,1.633,1.02,1.633,2.278V421.997z"
              ></LampDetail>
              <LampAccent
                d="M128.472,93.75c0,1.534-1.244,2.778-2.778,2.778h-13.889c-1.534,0-2.778-1.244-2.778-2.778V79.861
          c0-1.534,1.244-2.778,2.778-2.778h13.889c1.534,0,2.778,1.244,2.778,2.778V93.75z"
              ></LampAccent>

              <LampLight cx="119.676" cy="44.22" r="40.51"></LampLight>
              <LampDetail
                d="M149.306,71.528c0,3.242-13.37,13.889-29.861,13.889S89.583,75.232,89.583,71.528c0-4.166,13.369-13.889,29.861-13.889
          S149.306,67.362,149.306,71.528z"
              ></LampDetail>
              <radialGradient
                className="light-gradient"
                id="SVGID_1_"
                cx="119.676"
                cy="44.22"
                r="65"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }}></stop>
                <stop offset="50%" style={{ stopColor: '#EDEDED', stopOpacity: 0.5 }}>
                  <animate
                    attributeName="stop-opacity"
                    values="0.0; 0.5; 0.0"
                    dur="5000ms"
                    repeatCount="indefinite"
                  ></animate>
                </stop>
                <stop offset="100%" style={{ stopColor: '#EDEDED', stopOpacity: 0 }}></stop>
              </radialGradient>
              <circle className="lamp-light__glow" fill="url(#SVGID_1_)" cx="119.676" cy="44.22" r="65"></circle>
              <LampBottom
                d="M135.417,487.781c0,1.378-1.244,2.496-2.778,2.496H106.25c-1.534,0-2.778-1.118-2.778-2.496v-74.869
          c0-1.378,1.244-2.495,2.778-2.495h26.389c1.534,0,2.778,1.117,2.778,2.495V487.781z"
              ></LampBottom>
            </g>
          </SVG>
        </RightSection>
      </Container>
    </Body>
  )
}

export default NotFound

// https://codepen.io/janmez/pen/LJOdar
