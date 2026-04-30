export const HEADER_MEGA_MENU_PT = {
  root: {
    class: 'py-0 bg-brand-neutral text-surface-100 border-0 rounded-none',
    style: {
      '--p-megamenu-background': 'var(--color-brand-neutral)',
      '--p-megamenu-color': '#f5f5f5',
      '--p-megamenu-border-color': 'transparent',
      '--p-megamenu-border-radius': '0',
      '--p-megamenu-item-focus-background': 'transparent',
      '--p-megamenu-item-active-background': 'transparent',
      '--p-megamenu-submenu-label-color': 'var(--p-primary-500)',
      backgroundColor: 'var(--color-brand-neutral)',
      color: '#f5f5f5',
      border: '0',
      boxShadow: 'none',
      paddingTop: '0.125rem',
      paddingBottom: '0.125rem',
      paddingLeft: '0',
      paddingRight: '0',
    },
  },
  rootList: {
    class: 'py-0 my-0',
    style: {
      flexGrow: '1',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
  },
  itemLink: {
    class:
      'text-surface-100 hover:text-primary hover:font-semibold hover:bg-transparent transition-colors duration-150',
  },
  button: {
    style: {
      flexGrow: '1',
      justifyContent: 'center',
    },
  },
  buttonIcon: {
    style: {
      width: '1.5rem',
      height: '1.5rem',
    },
  },
};
