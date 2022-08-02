import { FireworkColor, FireworkNominal } from './types';

export const numbersOfCards = {
  [FireworkNominal.ONE]: 3,
  [FireworkNominal.TWO]: 2,
  [FireworkNominal.THREE]: 2,
  [FireworkNominal.FOUR]: 2,
  [FireworkNominal.FIVE]: 1,
} as const;

export const fireworkColorToColorMap = {
  [FireworkColor.RED]: 'red.300',
  [FireworkColor.GREEN]: 'green.300',
  [FireworkColor.BLUE]: 'blue.300',
  [FireworkColor.YELLOW]: 'yellow.300',
  [FireworkColor.WHITE]: 'white',
} as const;

export const fireworkColorToTextColorMap = {
  [FireworkColor.RED]: fireworkColorToColorMap[FireworkColor.RED],
  [FireworkColor.GREEN]: fireworkColorToColorMap[FireworkColor.GREEN],
  [FireworkColor.BLUE]: fireworkColorToColorMap[FireworkColor.BLUE],
  [FireworkColor.YELLOW]: fireworkColorToColorMap[FireworkColor.YELLOW],
  [FireworkColor.WHITE]: 'gray.300',
} as const;
