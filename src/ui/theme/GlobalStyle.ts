import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    font-family: 'Space Grotesk', 'Sora', 'IBM Plex Sans', sans-serif;
    background: linear-gradient(160deg, #0f1219 0%, #141c27 50%, #0f1219 100%);
    color: ${({ theme }) => theme.colors.text};
  }

  button {
    font-family: inherit;
  }
`;
