import { Dark, Light } from './types'

const Defaults = {
  color: {
    burnSienna: '#ec7a56',
    white: '#ffffff',
    gray: '#d3d3d3d3',
  },
}

export const Darks: Dark = {
  background: {
    primary: '#232636',
    secondary: '#2f3345',
  },
  color: {
    primary: '#efefef',
    secondary: '#fdfdfd',
  },
  default: Defaults,
}

export const Lights: Light = {
  background: {
    primary: '#efefef',
    secondary: '#fdfdfd',
  },
  color: {
    primary: '#232636',
    secondary: '#2f3345',
  },
  default: Defaults,
}
