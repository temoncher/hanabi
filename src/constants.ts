import { FireworkColor } from './types';

export const fireworkColorToColorMap = {
  [FireworkColor.RED]: 'red.300',
  [FireworkColor.GREEN]: 'green.300',
  [FireworkColor.BLUE]: 'blue.300',
  [FireworkColor.YELLOW]: 'yellow.300',
  [FireworkColor.WHITE]: 'white',
} as const;
