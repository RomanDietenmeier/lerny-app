import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    backgroundColor: string;
    backgroundColorButton: string;
    backgroundColorComplementary: string;
    backgroundColorHoverButton: string;
    color: string;
    colorButton: string;
    backgroundMain: string;
    backgroundSecondary: string;
    titlebar: string;
    titlebarHover: string;
    primary: string;
    separatorColor: string;
  }
}
