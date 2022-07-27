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
  components: {
    Button: {
      sizes: {
        xl: {
          w: 24,
          h: 24,
        },
      },
    },
  },
});
