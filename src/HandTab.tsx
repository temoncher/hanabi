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
  removedBasedOnHintsCards: Record<number, Record<FireworkColor, Record<FireworkNominal, boolean>>>;
  onHint: (positions: number[], clue: FireworkColor | FireworkNominal) => void;
};

export function HandTab({ removedBasedOnHintsCards, outOfGameCards, onHint }: HandTabProps) {
  const { isOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const [selectedCardPositions, setSelectedCardPositions] = useState(new Set<number>());

  return (
    <>
      <Flex h="full" align="stretch" gap={1}>
        {Array.from({ length: 5 }, (und, cardPosition) => (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={cardPosition}>
            <Center
              bg={selectedCardPositions.has(cardPosition) ? 'yellow.50' : undefined}
              borderRadius={4}
              px={2}
              onClick={() => {
                const newSelectedPositions = new Set(selectedCardPositions);

                if (newSelectedPositions.has(cardPosition)) {
                  newSelectedPositions.delete(cardPosition);
                } else {
                  newSelectedPositions.add(cardPosition);
                }

                setSelectedCardPositions(newSelectedPositions);
              }}
            >
              <VStack flex={1}>
                {Object.values(FireworkColor).map((color) => (
                  <HStack key={color}>
                    {Object.values(FireworkNominal).map((nominal) => {
                      const isInverted =
                        outOfGameCards[color][nominal] || removedBasedOnHintsCards[cardPosition]![color][nominal];

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
            {cardPosition !== 4 && (
              <Divider orientation="vertical" borderWidth={2} borderColor="gray.300" borderRadius={2} />
            )}
          </React.Fragment>
        ))}
      </Flex>
      {selectedCardPositions.size !== 0 && (
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
                    onHint(Array.from(selectedCardPositions), color);
                    closeModal();

                    setSelectedCardPositions(new Set());
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
                    onHint(Array.from(selectedCardPositions), nominal);
                    closeModal();
                    setSelectedCardPositions(new Set());
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
