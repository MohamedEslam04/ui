export type Messages = {
  inputMenu: {
    noMatch: string
    noData: string
    create: string
  }
  calendar: {
    prevYear: string
    nextYear: string
    prevMonth: string
    nextMonth: string
  }
  inputNumber: {
    increment: string
    decrement: string
  }
  commandPalette: {
    placeholder: string
    noMatch: string
    noData: string
    close: string
    back: string
  }
  selectMenu: {
    noMatch: string
    noData: string
    create: string
    search: string
  }
  toast: {
    close: string
  }
  carousel: {
    prev: string
    next: string
    goto: string
  }
  modal: {
    close: string
  }
  slideover: {
    close: string
  }
  alert: {
    close: string
  }
  table: {
    noData: string
  }
  authForm?: {
    submit: string
    hidePassword: string
    showPassword: string
  }
  banner?: {
    close: string
  }
  chatPrompt?: {
    placeholder: string
  }
  chatPromptSubmit?: {
    label: string
  }
  colorMode?: {
    system: string
    light: string
    dark: string
    switchToLight: string
    switchToDark: string
  }
  contentSearch?: {
    links: string
    theme: string
  }
  contentSearchButton?: {
    label: string
  }
  contentToc?: {
    title: string
  }
  dashboardSearch?: {
    theme: string
  }
  dashboardSearchButton?: {
    label: string
  }
  dashboardSidebarCollapse?: {
    expand: string
    collapse: string
  }
  dashboardSidebarToggle?: {
    close: string
    open: string
  }
  error?: {
    clear: string
  }
  header?: {
    close: string
    open: string
  }
  pricingTable?: {
    caption: string
  }
  prose?: {
    codeCollapse?: {
      name: string
      openText: string
      closeText: string
    }
    collapsible?: {
      name: string
      openText: string
      closeText: string
    }
    pre?: {
      copy: string
    }
  }
}

export type Direction = 'ltr' | 'rtl'

export type Locale<M> = {
  name: string
  code: string
  dir: Direction
  messages: M
}
