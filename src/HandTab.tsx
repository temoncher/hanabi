import { Center, Divider, Flex, HStack, IconButton, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { GiLightBulb } from 'react-icons/gi';

import { fireworkColorToColorMap } from './constants';
import { FireworkColor, FireworkNominal } from './types';

export function HandTab() {
  const [selectedColumnsIndexes, setSelectedColumnsIndexes] = useState(new Set<number>());

  return (
    <>
      <Flex h="full" align="stretch" gap={1}>
        {Array.from({ length: 5 }, (und, columnIndex) => (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={columnIndex}>
            <Center
              bg={selectedColumnsIndexes.has(columnIndex) ? 'yellow.50' : undefined}
              borderRadius={4}
              px={2}
              onClick={() => {
                const newSelectedColumns = new Set(selectedColumnsIndexes);

                if (newSelectedColumns.has(columnIndex)) {
                  newSelectedColumns.delete(columnIndex);
                } else {
                  newSelectedColumns.add(columnIndex);
                }

                setSelectedColumnsIndexes(newSelectedColumns);
              }}
            >
              <VStack flex={1}>
                {Object.values(FireworkColor).map((color) => (
                  <HStack key={color}>
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
            </Center>
            {columnIndex !== 4 && (
              <Divider orientation="vertical" borderWidth={2} borderColor="gray.300" borderRadius={2} />
            )}
          </React.Fragment>
        ))}
      </Flex>
      {selectedColumnsIndexes.size !== 0 && (
        <IconButton
          isRound
          colorScheme="blue"
          aria-label="hint"
          icon={<GiLightBulb size="2em" />}
          size="lg"
          position="fixed"
          bottom={7}
          right={7}
          shadow="md"
        />
      )}
    </>
  );
}
