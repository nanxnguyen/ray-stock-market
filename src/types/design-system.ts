export type Theme = 'dark' | 'light'

export interface DesignTokens {
  color: {
    bg: {
      app: string
      nav: string
      card: string
      elevated: string
      input: string
      table: string
      rowOdd: string
      rowEven: string
      rowHover: string
    }
    text: {
      primary: string
      secondary: string
      muted: string
      inverse: string
      link: string
    }
    border: {
      default: string
      subtle: string
      strong: string
    }
    status: {
      success: string
      danger: string
      warning: string
      info: string
    }
    market: {
      up: string
      down: string
      flat: string
      ceiling: string
      floor: string
      flashUp: string
      flashDown: string
    }
  }
}
