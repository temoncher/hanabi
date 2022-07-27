import type { N } from 'ts-toolbelt';

export enum FireworkColor {
  RED = 'RED',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  YELLOW = 'YELLOW',
  WHITE = 'WHITE',
}
export enum FireworkNominal {
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
}

export enum CardStatus {
  IN_GAME = 'IN_GAME',
  DISCARDED = 'DISCARDED',
  PLAYED = 'PLAYED',
}

export const numbersOfCards = {
  [FireworkNominal.ONE]: 3,
  [FireworkNominal.TWO]: 2,
  [FireworkNominal.THREE]: 2,
  [FireworkNominal.FOUR]: 2,
  [FireworkNominal.FIVE]: 1,
} as const;

type CardIndex<T extends FireworkNominal> = N.Range<0, N.Sub<typeof numbersOfCards[T], 1>>[number];

export type CardId =
  | `${FireworkColor}-${FireworkNominal.ONE}-${CardIndex<FireworkNominal.ONE>}`
  | `${FireworkColor}-${FireworkNominal.TWO}-${CardIndex<FireworkNominal.TWO>}`
  | `${FireworkColor}-${FireworkNominal.THREE}-${CardIndex<FireworkNominal.THREE>}`
  | `${FireworkColor}-${FireworkNominal.FOUR}-${CardIndex<FireworkNominal.FOUR>}`
  | `${FireworkColor}-${FireworkNominal.FIVE}-${CardIndex<FireworkNominal.FIVE>}`;

export function generateCardId<T extends FireworkNominal>(config: [FireworkColor, T, CardIndex<T>]) {
  return config.join('-') as CardId;
}
export function parseCardId(cardId: CardId) {
  // eslint-disable-next-line id-denylist
  const [color, nominal, index] = cardId.split('-');

  return [color as FireworkColor, nominal as FireworkNominal, Number(index) as CardIndex<FireworkNominal>] as const;
}

export type Card = {
  id: CardId;
  color: FireworkColor;
  nominal: FireworkNominal;
  status: CardStatus;
};
