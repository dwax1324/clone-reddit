import {Box, CSSReset, ThemeProvider } from '@chakra-ui/core';
import { Provider } from 'urql';
import theme from '../theme';

function MyApp({ Component, pageProps }: any) {
  return (
    <ThemeProvider theme={theme}>
      {/* <ColorModeProvider> */}
        <CSSReset />
      <Box backgroundColor={"red"}>
        <Component {...pageProps} />
        </Box>
        {/* </ColorModeProvider> */}
      </ThemeProvider>
  )
}

export default MyApp
