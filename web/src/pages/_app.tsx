import {
  ColorModeProvider,
  CSSReset,
  ThemeProvider
} from "@chakra-ui/core";
import React, { useState } from "react";
import theme from '../theme';




function MyApp({ Component, pageProps }: any) {
  
  return (
    <ThemeProvider theme={theme}>
        <CSSReset />
          <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp
