export default {
  slots: {
    root: 'flex flex-col gap-4'
  },
  variants: {
    compact: {
      true: {
        root: 'gap-2'
      },
      false: {
        root: 'gap-4'
      }
    }
  },
  defaultVariants: {
    compact: false
  }
}
