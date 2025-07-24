import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'English',
  code: 'en',
  messages: {
    inputMenu: {
      noMatch: 'No matching data',
      noData: 'No data',
      create: 'Create "{label}"'
    },
    calendar: {
      prevYear: 'Previous year',
      nextYear: 'Next year',
      prevMonth: 'Previous month',
      nextMonth: 'Next month'
    },
    inputNumber: {
      increment: 'Increment',
      decrement: 'Decrement'
    },
    commandPalette: {
      placeholder: 'Type a command or search...',
      noMatch: 'No matching data',
      noData: 'No data',
      close: 'Close',
      back: 'Back'
    },
    selectMenu: {
      noMatch: 'No matching data',
      noData: 'No data',
      create: 'Create "{label}"',
      search: 'Search...'
    },
    toast: {
      close: 'Close'
    },
    carousel: {
      prev: 'Prev',
      next: 'Next',
      dots: 'Choose slide to display',
      goto: 'Go to slide {slide}'
    },
    modal: {
      close: 'Close'
    },
    slideover: {
      close: 'Close'
    },
    alert: {
      close: 'Close'
    },
    table: {
      noData: 'No data'
    },
    authForm: {
      submit: 'Continue',
      hidePassword: 'Hide password',
      showPassword: 'Show password'
    },
    banner: {
      close: 'Close'
    },
    chatPrompt: {
      placeholder: 'Type your message here...'
    },
    chatPromptSubmit: {
      label: 'Send prompt'
    },
    colorMode: {
      system: 'System',
      light: 'Light',
      dark: 'Dark',
      switchToLight: 'Switch to light mode',
      switchToDark: 'Switch to dark mode'
    },
    contentSearch: {
      links: 'Links',
      theme: 'Theme'
    },
    contentSearchButton: {
      label: 'Search...'
    },
    contentToc: {
      title: 'On this page'
    },
    dashboardSearch: {
      theme: 'Theme'
    },
    dashboardSearchButton: {
      label: 'Search...'
    },
    dashboardSidebarCollapse: {
      expand: 'Expand sidebar',
      collapse: 'Collapse sidebar'
    },
    dashboardSidebarToggle: {
      close: 'Close sidebar',
      open: 'Open sidebar'
    },
    error: {
      clear: 'Back to home'
    },
    header: {
      close: 'Close menu',
      open: 'Open menu'
    },
    pricingTable: {
      caption: 'Pricing plan comparison'
    },
    prose: {
      codeCollapse: {
        name: 'code',
        openText: 'Expand',
        closeText: 'Collapse'
      },
      collapsible: {
        name: 'properties',
        openText: 'Show',
        closeText: 'Hide'
      },
      pre: {
        copy: 'Copy code to clipboard'
      }

    }
  }
})
