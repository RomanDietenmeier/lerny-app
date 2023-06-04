import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    backgroundMain: string;
    backgroundSecondary: string;
    titlebar: string;
    titlebarHover: string;
    primary: string;
    separatorColor: string;
  }
}
