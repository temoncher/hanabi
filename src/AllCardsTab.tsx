/* eslint-disable react/no-array-index-key */
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
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

import { numbersOfCards, fireworkColorToColorMap, fireworkColorToTextColorMap } from './constants';
import { FireworkColor, FireworkNominal, CardStatus, CardId, generateCardId, parseCardId } from './types';
import { isDefined } from './utils';

function CardLabel({ status, ...props }: Omit<AvatarProps, 'bg' | 'icon'> & { status: CardStatus }) {
  if (status === CardStatus.DISCARDED) return <Avatar bg="red.500" icon={<CloseIcon color="white" />} {...props} />;

  if (status === CardStatus.PLAYED) return <Avatar bg="green.500" icon={<CheckIcon color="white" />} {...props} />;

  return null;
}

function generateCardsGroup(nominal: FireworkNominal, includesPlayed: boolean, numberOfDiscarded: number) {
  const preDefinedCards = [
    includesPlayed ? CardStatus.PLAYED : undefined,
    ...Array.from({ length: numberOfDiscarded }, () => CardStatus.DISCARDED),
  ].filter(isDefined);

  return Array.from({ ...preDefinedCards, length: numbersOfCards[nominal] }, (status) => status ?? CardStatus.IN_GAME);
}

type AllCardsTabProps = {
  playedCards: Partial<Record<CardId, 1>>;
  discardedCards: Partial<Record<CardId, number>>;
  onDiscard: (cardId: CardId) => void;
  onPlay: (cardId: CardId) => void;
};

export function AllCardsTab({ playedCards, discardedCards, onDiscard, onPlay }: AllCardsTabProps) {
  const { isOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const [selectedCardId, setSelectedCardId] = useState<CardId | undefined>(undefined);

  const selectedCardIsPlayed = !!playedCards[selectedCardId!];
  const numberOfDiscardedSelectedCards = discardedCards[selectedCardId!] ?? 0;

  const numberOfOutOfGameCards = (selectedCardIsPlayed ? 1 : 0) + numberOfDiscardedSelectedCards;

  const selectedCardNominal = selectedCardId ? parseCardId(selectedCardId)[1] : undefined;

  return (
    <>
      <VStack>
        {Object.values(FireworkColor).map((color, colorRowIndex) => (
          <HStack key={colorRowIndex} gap={4}>
            {Object.values(FireworkNominal).map((nominal, nominalGroupIndex) => {
              const cardId = generateCardId([color, nominal]);
              const includesPlayed = !!playedCards[cardId];
              const numberOfDiscarded = discardedCards[cardId]!;

              return (
                <HStack key={nominalGroupIndex}>
                  {/* eslint-disable-next-line complexity */}
                  {generateCardsGroup(nominal, includesPlayed, numberOfDiscarded).map((status, cardIndex) => {
                    const isDiscarded = status === CardStatus.DISCARDED;
                    const isPlayed = status === CardStatus.PLAYED;
                    const isInverted = isDiscarded || isPlayed;

                    return (
                      <Center
                        key={`${cardId}-${cardIndex}`}
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
                        <CardLabel position="absolute" top={-1} right={-1} size="xs" status={status} />
                        {nominal}
                      </Center>
                    );
                  })}
                </HStack>
              );
            })}
          </HStack>
        ))}
      </VStack>
      <Modal isCentered isOpen={isOpen} size="lg" onClose={closeModal}>
        <ModalOverlay />
        <ModalContent bg="gray.100">
          <ModalHeader>Choose action</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" justifyContent="center" pb={10} gap={6}>
            <IconButton
              isRound
              isDisabled={numberOfOutOfGameCards === numbersOfCards[selectedCardNominal!]}
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
              isDisabled={selectedCardIsPlayed || numberOfOutOfGameCards === numbersOfCards[selectedCardNominal!]}
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
