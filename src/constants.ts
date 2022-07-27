import { FireworkColor } from './types';

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
