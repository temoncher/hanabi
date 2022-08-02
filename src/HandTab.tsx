import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  ButtonGroup,
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

import { PlayOrDiscardModal } from './PlayOrDiscardModal';
import { fireworkColorToColorMap, fireworkColorToTextColorMap } from './constants';
import { CardId, FireworkColor, FireworkNominal, generateCardId } from './types';

type HandTabProps = {
  outOfGameCards: Record<CardId, boolean>;
  removedBasedOnHintsCards: Record<number, Record<CardId, boolean>>;
  onHint: (positions: number[], clue: FireworkColor | FireworkNominal) => void;
  onPlay: (position: number, color: FireworkColor, nominal: FireworkNominal) => void;
  onDiscard: (position: number, color: FireworkColor, nominal: FireworkNominal) => void;
};

export function HandTab({ removedBasedOnHintsCards, outOfGameCards, onHint, onPlay, onDiscard }: HandTabProps) {
  const { isOpen: isHintModalOpen, onOpen: openHintModal, onClose: closeHintModal } = useDisclosure();
  const {
    isOpen: isPlayOrDiscardModalOpen,
    onOpen: openPlayOrDiscardModal,
    onClose: closePlayOrDiscardModal,
  } = useDisclosure();
  const [selectedCardPositions, setSelectedCardPositions] = useState(new Set<number>());
  const [actionType, setActionType] = useState<'discard' | 'play'>();

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
                      const cardId = generateCardId([color, nominal]);
                      const isInverted = outOfGameCards[cardId] || removedBasedOnHintsCards[cardPosition]![cardId];

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
      <ButtonGroup position="fixed" bottom={7} right={7} gap={1}>
        {selectedCardPositions.size === 1 && (
          <IconButton
            isRound
            colorScheme="red"
            aria-label="hint"
            icon={<CloseIcon />}
            size="lg"
            shadow="md"
            onClick={() => {
              setActionType('discard');
              openPlayOrDiscardModal();
            }}
          />
        )}
        {selectedCardPositions.size === 1 && (
          <IconButton
            isRound
            colorScheme="green"
            aria-label="hint"
            icon={<CheckIcon />}
            size="lg"
            shadow="md"
            onClick={() => {
              setActionType('play');
              openPlayOrDiscardModal();
            }}
          />
        )}
        {selectedCardPositions.size !== 0 && (
          <IconButton
            isRound
            colorScheme="blue"
            aria-label="hint"
            icon={<GiLightBulb size="2em" />}
            size="lg"
            shadow="md"
            onClick={openHintModal}
          />
        )}
      </ButtonGroup>

      <Modal isCentered isOpen={isHintModalOpen} size="lg" onClose={closeHintModal}>
        <ModalOverlay />
        <ModalContent bg="gray.100">
          <ModalHeader>Choose color or nominal</ModalHeader>
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
                    closeHintModal();

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
                    closeHintModal();
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

      <PlayOrDiscardModal
        isOpen={isPlayOrDiscardModalOpen}
        onClose={closePlayOrDiscardModal}
        onSubmit={(color, nominal) => {
          const position = Array.from(selectedCardPositions)[0]!;

          if (actionType === 'discard') {
            onDiscard(position, color, nominal);
          } else {
            onPlay(position, color, nominal);
          }

          setSelectedCardPositions(new Set());
        }}
      />
    </>
  );
}
