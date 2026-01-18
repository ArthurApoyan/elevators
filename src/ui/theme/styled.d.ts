import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      backgroundAlt: string;
      surface: string;
      surfaceAlt: string;
      text: string;
      muted: string;
      border: string;
      accent: string;
    };
    space: number[];
    radii: {
      sm: number;
      md: number;
      lg: number;
    };
    fontSizes: number[];
    breakpoints: string[];
  }
}
