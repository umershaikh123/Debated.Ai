export const initialState = {
  menuOpen: false,
  isRtl: false,
};

export function reducer(state, action) {
  const { type, value } = action;

  switch (type) {
    case 'setTheme':
      return { ...state, theme: value };
    case 'toggleTheme': {
      const newThemeId = state.theme === 'dark' ? 'light' : 'dark';
      return { ...state, theme: newThemeId };
    }
    case 'toggleMenu':
      return { ...state, menuOpen: !state.menuOpen };
    case 'toggleIsRtl':
      return { ...state, isRtl: !state.isRtl };
    default:
      throw new Error();
  }
}
