import {
  Box,
  Center,
  Divider,
  Flex,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { GiLightBulb } from 'react-icons/gi';

import { fireworkColorToColorMap, fireworkColorToTextColorMap } from './constants';
import { FireworkColor, FireworkNominal } from './types';

type HandTabProps = {
  outOfGameCards: Record<FireworkColor, Record<FireworkNominal, boolean>>;
};

export function HandTab({ outOfGameCards }: HandTabProps) {
  const { isOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const [selectedColumnsIndexes, setSelectedColumnsIndexes] = useState(new Set<number>());
  const [colorHints, setColorHints] = useState<Record<number, FireworkColor | undefined>>({});
  const [nominalHints, setNominalHints] = useState<Record<number, FireworkNominal | undefined>>({});

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
                    {Object.values(FireworkNominal).map((nominal) => {
                      const isInverted = outOfGameCards[color][nominal];

                      return (
                        <Center
                          key={`${color}-${nominal}`}
                          sx={{ aspectRatio: '2 / 3' }}
                          fontWeight="bold"
                          shadow="md"
                          borderRadius={2}
                          position="relative"
                          bg={isInverted ? 'white' : fireworkColorToColorMap[color]}
                          color={isInverted ? fireworkColorToTextColorMap[color] : 'black'}
                          h="7vh"
                        >
                          {isInverted && (
                            <Box
                              position="absolute"
                              w="full"
                              h="full"
                              top={0}
                              right={0}
                              bg="blackAlpha.300"
                              borderRadius={2}
                            />
                          )}
                          {nominal}
                        </Center>
                      );
                    })}
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
          onClick={openModal}
        />
      )}
      <Modal isOpen={isOpen} size="lg" onClose={closeModal}>
        <ModalOverlay />
        <ModalContent bg="gray.100">
          <ModalHeader>Choose action</ModalHeader>
          <ModalCloseButton />
          <ModalBody as={VStack} pb={10} gap={6}>
            <HStack gap={2}>
              {Object.values(FireworkColor).map((color) => (
                <Center
                  key={color}
                  sx={{ aspectRatio: '2 / 3' }}
                  shadow="md"
                  borderRadius={4}
                  bg={fireworkColorToColorMap[color]}
                  h="20vh"
                  onClick={() => {
                    const newColorHints = { ...colorHints };

                    selectedColumnsIndexes.forEach((selectedColumnsIndex) => {
                      newColorHints[selectedColumnsIndex] = color;
                    });
                    setColorHints(newColorHints);
                    closeModal();

                    setSelectedColumnsIndexes(new Set());
                  }}
                />
              ))}
            </HStack>
            <HStack gap={2}>
              {Object.values(FireworkNominal).map((nominal) => (
                <Center
                  key={nominal}
                  sx={{ aspectRatio: '2 / 3' }}
                  fontWeight="bold"
                  fontSize="5xl"
                  shadow="md"
                  borderRadius={4}
                  h="20vh"
                  bg="white"
                  onClick={() => {
                    const newNominalHints = { ...nominalHints };

                    selectedColumnsIndexes.forEach((selectedColumnsIndex) => {
                      newNominalHints[selectedColumnsIndex] = nominal;
                    });
                    setNominalHints(newNominalHints);
                    closeModal();
                    setSelectedColumnsIndexes(new Set());
                  }}
                >
                  {nominal}
                </Center>
              ))}
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
