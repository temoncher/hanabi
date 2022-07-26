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
export type CardId = `${FireworkColor}-${FireworkNominal}-${number}`;

export type Card = {
  id: CardId;
  color: FireworkColor;
  nominal: FireworkNominal;
  status: CardStatus;
};
