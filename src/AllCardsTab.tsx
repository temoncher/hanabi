/* eslint-disable react/no-array-index-key */
import { CheckIcon, CloseIcon, RepeatIcon } from '@chakra-ui/icons';
import {
  Avatar,
  AvatarProps,
  Box,
  Center,
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
import { useState } from 'react';

import { fireworkColorToColorMap, fireworkColorToTextColorMap } from './constants';
import { numbersOfCards, FireworkColor, FireworkNominal, CardStatus, CardId, generateCardId } from './types';

function CardLabel({ status, ...props }: Omit<AvatarProps, 'bg' | 'icon'> & { status: CardStatus }) {
  if (status === CardStatus.DISCARDED) return <Avatar bg="red.500" icon={<CloseIcon color="white" />} {...props} />;

  if (status === CardStatus.PLAYED) return <Avatar bg="green.500" icon={<CheckIcon color="white" />} {...props} />;

  return null;
}

type AllCardsTabProps = {
  playedCards: Partial<Record<CardId, true>>;
  discardedCards: Partial<Record<CardId, true>>;
  onReset: (cardId: CardId) => void;
  onDiscard: (cardId: CardId) => void;
  onPlay: (cardId: CardId) => void;
};

export function AllCardsTab({ playedCards, discardedCards, onDiscard, onReset, onPlay }: AllCardsTabProps) {
  const { isOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const [selectedCardId, setSelectedCardId] = useState<CardId | undefined>(undefined);

  const selectedCardIsDiscardedOrPlayed = !!discardedCards[selectedCardId!] || !!playedCards[selectedCardId!];

  return (
    <>
      <VStack>
        {Object.values(FireworkColor).map((color, colorRowIndex) => (
          <HStack key={colorRowIndex} gap={4}>
            {Object.values(FireworkNominal).map((nominal, nominalGroupIndex) => (
              <HStack key={nominalGroupIndex}>
                {/* eslint-disable-next-line complexity */}
                {Array.from({ length: numbersOfCards[nominal] }).map((und, cardIndex) => {
                  const cardId = generateCardId([color, nominal, cardIndex as 0 | 1 | 2]);
                  const isDiscarded = !!discardedCards[cardId];
                  const isPlayed = !!playedCards[cardId];
                  const isInverted = isDiscarded || isPlayed;

                  return (
                    <Center
                      key={cardId}
                      sx={{ aspectRatio: '2 / 3' }}
                      position="relative"
                      fontSize="4xl"
                      fontWeight="bold"
                      h="16vh"
                      shadow="md"
                      borderRadius={4}
                      bg={isInverted ? 'white' : fireworkColorToColorMap[color]}
                      color={isInverted ? fireworkColorToTextColorMap[color] : 'black'}
                      onClick={() => {
                        setSelectedCardId(cardId);
                        openModal();
                      }}
                    >
                      {isInverted && (
                        <Box
                          position="absolute"
                          w="full"
                          h="full"
                          top={0}
                          right={0}
                          bg="blackAlpha.300"
                          borderRadius={4}
                        />
                      )}
                      <CardLabel
                        position="absolute"
                        top={-1}
                        right={-1}
                        size="xs"
                        // eslint-disable-next-line no-nested-ternary
                        status={isDiscarded ? CardStatus.DISCARDED : isPlayed ? CardStatus.PLAYED : CardStatus.IN_GAME}
                      />
                      {nominal}
                    </Center>
                  );
                })}
              </HStack>
            ))}
          </HStack>
        ))}
      </VStack>
      <Modal isOpen={isOpen} size="lg" onClose={closeModal}>
        <ModalOverlay />
        <ModalContent bg="gray.100">
          <ModalHeader>Choose action</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" justifyContent="center" pb={10} gap={6}>
            <IconButton
              isRound
              isDisabled={selectedCardIsDiscardedOrPlayed}
              aria-label="discard"
              size="xl"
              bg="red.500"
              icon={<CloseIcon boxSize={10} color="white" />}
              shadow="md"
              onClick={() => {
                onDiscard(selectedCardId!);
                closeModal();
              }}
            />
            <IconButton
              isRound
              isDisabled={!selectedCardIsDiscardedOrPlayed}
              aria-label="reset"
              size="xl"
              bg="gray.500"
              icon={<RepeatIcon boxSize={10} color="white" />}
              shadow="md"
              onClick={() => {
                onReset(selectedCardId!);
                closeModal();
              }}
            />
            <IconButton
              isRound
              isDisabled={selectedCardIsDiscardedOrPlayed}
              aria-label="play"
              size="xl"
              bg="green.500"
              icon={<CheckIcon boxSize={10} color="white" />}
              shadow="md"
              onClick={() => {
                onPlay(selectedCardId!);
                closeModal();
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
