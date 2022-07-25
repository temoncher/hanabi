/* eslint-disable react/no-array-index-key */
import { CheckIcon, CloseIcon, RepeatIcon } from '@chakra-ui/icons';
import {
  Avatar,
  AvatarProps,
  Box,
  Center,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { groupBy, keyBy } from 'lodash';
import { useMemo, useState } from 'react';

enum FireworkColor {
  RED = 'RED',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  YELLOW = 'YELLOW',
  WHITE = 'WHITE',
}

const fireworkColorToColorMap = {
  [FireworkColor.RED]: 'red.300',
  [FireworkColor.GREEN]: 'green.300',
  [FireworkColor.BLUE]: 'blue.300',
  [FireworkColor.YELLOW]: 'yellow.300',
  [FireworkColor.WHITE]: 'white',
} as const;

const fireworkColorToTextColorMap = {
  [FireworkColor.RED]: fireworkColorToColorMap[FireworkColor.RED],
  [FireworkColor.GREEN]: fireworkColorToColorMap[FireworkColor.GREEN],
  [FireworkColor.BLUE]: fireworkColorToColorMap[FireworkColor.BLUE],
  [FireworkColor.YELLOW]: fireworkColorToColorMap[FireworkColor.YELLOW],
  [FireworkColor.WHITE]: 'gray.300',
} as const;

enum FireworkNominal {
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
}

enum CardStatus {
  IN_GAME = 'IN_GAME',
  DISCARDED = 'DISCARDED',
  PLAYED = 'PLAYED',
}
type CardId = `${FireworkColor}-${FireworkNominal}-${number}`;

type Card = {
  id: CardId;
  color: FireworkColor;
  nominal: FireworkNominal;
  status: CardStatus;
};

const numbersOfCards = {
  [FireworkNominal.ONE]: 3,
  [FireworkNominal.TWO]: 2,
  [FireworkNominal.THREE]: 2,
  [FireworkNominal.FOUR]: 2,
  [FireworkNominal.FIVE]: 1,
} as const;

const initialCards = Object.values(FireworkColor).flatMap((color) =>
  Object.values(FireworkNominal).flatMap((nominal) =>
    Array.from(
      { length: numbersOfCards[nominal] },
      (und, cardIndex): Card => ({
        id: `${color}-${nominal}-${cardIndex}`,
        color,
        nominal,
        status: CardStatus.IN_GAME,
      }),
    ),
  ),
);

function toColorGroups(cards: Card[]) {
  return Object.values(groupBy(cards, (c) => c.color)).map((colorGroup) =>
    Object.values(groupBy(colorGroup, (c) => c.nominal)),
  );
}

function CardLabel({ status, ...props }: Omit<AvatarProps, 'bg' | 'icon'> & { status: CardStatus }) {
  if (status === CardStatus.DISCARDED) return <Avatar bg="red.500" icon={<CloseIcon color="white" />} {...props} />;

  if (status === CardStatus.PLAYED) return <Avatar bg="green.500" icon={<CheckIcon color="white" />} {...props} />;

  return null;
}

export function App() {
  const { isOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const [cardsMap, setCardsMap] = useState(keyBy(initialCards, (c) => c.id));
  const [selectedCardId, setSelectedCardId] = useState<string | undefined>(undefined);
  const cards = useMemo(() => toColorGroups(Object.values(cardsMap)), [cardsMap]);

  function applyStatus(cardId: string, status: CardStatus) {
    setCardsMap({
      ...cardsMap,
      [cardId]: {
        ...cardsMap[cardId],
        status,
      },
    });
  }

  return (
    <>
      <VStack pt={3}>
        {cards.map((colorRow, colorRowIndex) => (
          <HStack key={colorRowIndex} gap={4}>
            {colorRow.map((nominalGroup, nominalGroupIndex) => (
              <HStack key={nominalGroupIndex}>
                {nominalGroup.map((card) => {
                  const shouldInvert = card.status === CardStatus.DISCARDED || card.status === CardStatus.PLAYED;

                  return (
                    <Center
                      key={card.id}
                      sx={{ aspectRatio: '2 / 3' }}
                      position="relative"
                      fontSize="2rem"
                      fontWeight="bold"
                      h="8vw"
                      shadow="md"
                      borderRadius={4}
                      bgColor={shouldInvert ? 'white' : fireworkColorToColorMap[card.color]}
                      color={shouldInvert ? fireworkColorToTextColorMap[card.color] : 'black'}
                      onClick={() => {
                        setSelectedCardId(card.id);
                        openModal();
                      }}
                    >
                      {shouldInvert && (
                        <Box
                          position="absolute"
                          w="full"
                          h="full"
                          top={0}
                          right={0}
                          bgColor="blackAlpha.300"
                          borderRadius={4}
                        />
                      )}
                      <CardLabel position="absolute" top={-1} right={-1} size="xs" status={card.status} />
                      {card.nominal}
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
        <ModalContent>
          <ModalHeader>Choose action</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" justifyContent="center" pb={10} gap={6}>
            <Avatar
              size="2xl"
              bg="red.500"
              icon={<CloseIcon color="white" />}
              onClick={() => {
                applyStatus(selectedCardId!, CardStatus.DISCARDED);
                closeModal();
              }}
            />
            <Avatar
              size="2xl"
              bg="gray.500"
              icon={<RepeatIcon color="white" />}
              onClick={() => {
                applyStatus(selectedCardId!, CardStatus.IN_GAME);
                closeModal();
              }}
            />
            <Avatar
              size="2xl"
              bg="green.500"
              icon={<CheckIcon color="white" />}
              onClick={() => {
                applyStatus(selectedCardId!, CardStatus.PLAYED);
                closeModal();
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
