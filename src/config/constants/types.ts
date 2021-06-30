// Define Props type for dark themes
export type Dark = {
  background: BackgroundType
  color: ColorType
  default: Default
}

// Define Props type for light themes
export type Light = {
  background: BackgroundType
  color: ColorType
  default: Default
}

export type BackgroundType = {
  primary: string
  secondary: string
}

export type ColorType = {
  primary: string
  secondary: string
}

export type Default = {
  color: DefaultColor
}

export type DefaultColor = {
  burnSienna: string
}
