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

export type CardId = `${FireworkColor}-${FireworkNominal}`;

export function generateCardId(config: [FireworkColor, FireworkNominal]) {
  return config.join('-') as CardId;
}
export function parseCardId(cardId: CardId) {
  // eslint-disable-next-line id-denylist
  const [color, nominal] = cardId.split('-');

  return [color as FireworkColor, nominal as FireworkNominal] as const;
}
