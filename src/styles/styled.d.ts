import 'styled-components';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface DefaultTheme {
    backgroundColor: string;
    backgroundColorButton: string;
    backgroundColorHoverButton: string;
    color: string;
    colorButton: string;
  }
}
