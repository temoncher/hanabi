/* eslint-disable @typescript-eslint/naming-convention */
import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      html: {
        height: '100vh',
      },
      body: {
        bg: 'gray.100',
      },
    },
  },
});
