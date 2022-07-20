/* eslint-disable react/no-array-index-key */
import { Center, HStack, VStack } from '@chakra-ui/react';
import { groupBy, keyBy } from 'lodash';
import { useMemo, useState } from 'react';

enum FireworkColor {
  RED = 'RED',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  YELLOW = 'YELLOW',
  WHITE = 'WHITE',
}

enum FireworkNominal {
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
}

enum CardStatus {
  IN_GAME = 'IN_GAME',
  PLAYED = 'PLAYED',
  DISCARDED = 'DISCARDED',
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

export function App() {
  const [cardsMap, setCardsMap] = useState(keyBy(initialCards, (c) => c.id));
  const cards = useMemo(() => toColorGroups(Object.values(cardsMap)), [cardsMap]);

  function discard(cardToDiscard: Card) {
    setCardsMap({
      ...cardsMap,
      [cardToDiscard.id]: {
        ...cardToDiscard,
        status: CardStatus.DISCARDED,
      },
    });
  }

  return (
    <VStack pt={3}>
      {cards.map((colorRow, colorRowIndex) => (
        <HStack key={colorRowIndex} gap={4}>
          {colorRow.map((nominalGroup, nominalGroupIndex) => (
            <HStack key={nominalGroupIndex}>
              {nominalGroup.map((card) => (
                <Center
                  key={card.id}
                  sx={{ aspectRatio: '2 / 3' }}
                  fontSize="2rem"
                  fontWeight="bold"
                  h="8vw"
                  borderRadius={4}
                  bgColor={card.status === CardStatus.DISCARDED ? 'grey' : card.color}
                  onClick={() => {
                    discard(card);
                  }}
                >
                  {card.nominal}
                </Center>
              ))}
            </HStack>
          ))}
        </HStack>
      ))}
    </VStack>
  );
}
