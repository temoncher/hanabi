import { Center, HStack, VStack } from '@chakra-ui/react';

import { fireworkColorToColorMap } from './constants';
import { FireworkColor, FireworkNominal } from './types';

export function HandTab() {
  return (
    <HStack h="full">
      {Array.from({ length: 5 }, (und, columnIndex) => (
        // eslint-disable-next-line react/no-array-index-key
        <VStack key={columnIndex} flex={1}>
          {Object.values(FireworkColor).map((color) => (
            <HStack>
              {Object.values(FireworkNominal).map((nominal) => (
                <Center
                  key={`${color}-${nominal}`}
                  sx={{ aspectRatio: '2 / 3' }}
                  fontWeight="bold"
                  shadow="md"
                  borderRadius={2}
                  bg={fireworkColorToColorMap[color]}
                  h="7vh"
                >
                  {nominal}
                </Center>
              ))}
            </HStack>
          ))}
        </VStack>
      ))}
    </HStack>
  );
}
