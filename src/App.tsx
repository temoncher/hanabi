import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { pickBy, mapValues, difference } from 'lodash';
import { useState } from 'react';
import { GiCardPick, GiCardRandom } from 'react-icons/gi';
import { action, payload, union, isType } from 'ts-action';

import { AllCardsTab } from './AllCardsTab';
import { HandTab } from './HandTab';
import { numbersOfCards, CardId, FireworkColor, FireworkNominal, parseCardId, generateCardId } from './types';

function isDefined<T>(obj: T): obj is Exclude<T, undefined> {
  return obj !== undefined;
}

export function isEnum<T extends string | number, TEnumValue extends string>(enumVariable: { [key in T]: TEnumValue }) {
  const enumValues = Object.values(enumVariable);

  return (value: unknown): value is TEnumValue =>
    (typeof value === 'string' || typeof value === 'number') && enumValues.includes(value);
}

const discard = action('DISCARD', payload<{ cardId: CardId; position?: number }>());
const play = action('PLAY', payload<{ cardId: CardId; position?: number }>());
const reset = action('RESET', payload<{ cardId: CardId }>());
const hint = action('HINT', payload<{ positions: number[]; clue: FireworkColor | FireworkNominal }>());
const gameAction = union(discard, play, reset, hint);

type GameAction = typeof gameAction.actions;

function calculateOutOfGameCards(logs: GameAction[]) {
  const result = Object.fromEntries(
    Object.values(FireworkColor).map((color) => {
      const nominalMap = Object.fromEntries(
        Object.values(FireworkNominal).map((nominal) => [nominal, 0] as const),
      ) as Record<FireworkNominal, number>;

      return [color, nominalMap] as const;
    }),
  ) as Record<FireworkColor, Record<FireworkNominal, number>>;

  logs.forEach((logEntry) => {
    if (!isType(logEntry, discard, play, reset)) return;

    const [color, nominal] = parseCardId(logEntry.payload.cardId);

    result[color][nominal] += isType(logEntry, reset) ? -1 : 1;
  });

  return mapValues(result, (nominalMap) =>
    mapValues(nominalMap, (numberOfCards, nominal) => numberOfCards === numbersOfCards[nominal as FireworkNominal]),
  );
}

function calculateDiscardedCards(logs: GameAction[]) {
  const result: Partial<Record<CardId, true | undefined>> = {};

  logs.forEach((logEntry) => {
    if (!isType(logEntry, discard, reset)) return;

    result[logEntry.payload.cardId] = isType(logEntry, reset) ? undefined : true;
  });

  return pickBy(result, isDefined) as Partial<Record<CardId, true>>;
}

function calculatePlayedCards(logs: GameAction[]) {
  const result: Partial<Record<CardId, true | undefined>> = {};

  logs.forEach((logEntry) => {
    if (!isType(logEntry, play, reset)) return;

    result[logEntry.payload.cardId] = isType(logEntry, reset) ? undefined : true;
  });

  return pickBy(result, isDefined) as Partial<Record<CardId, true>>;
}

function calculateRemovedBasedOnHintsCards(logs: GameAction[]) {
  const result = Object.fromEntries(
    Array.from({ length: 5 }, (und, cardPosition) => {
      const colorMap = Object.fromEntries(
        Object.values(FireworkColor).map((color) => {
          const nominalMap = Object.fromEntries(
            Object.values(FireworkNominal).map((nominal) => [nominal, false] as const),
          ) as Record<FireworkNominal, boolean>;

          return [color, nominalMap] as const;
        }),
      ) as Record<FireworkColor, Record<FireworkNominal, boolean>>;

      return [cardPosition, colorMap] as const;
    }),
  ) as Record<number, Record<FireworkColor, Record<FireworkNominal, boolean>>>;

  logs.forEach((logEntry) => {
    if (isType(logEntry, hint)) {
      const { positions, clue } = logEntry.payload;

      positions.forEach((position) => {
        if (isEnum(FireworkColor)(clue)) {
          result[position] = mapValues(result[position], (nominalsMap, color) => {
            if (color === clue) return nominalsMap;

            return mapValues(nominalsMap, () => true);
          });

          Object.keys(result).forEach((otherPosition) => {
            if (positions.includes(Number(otherPosition))) return;

            const otherPositionColorsMap = result[Number(otherPosition)]!;

            otherPositionColorsMap[clue] = mapValues(otherPositionColorsMap[clue], () => true);
          });
        } else {
          result[position] = mapValues(result[position], (nominalsMap) =>
            mapValues(nominalsMap, (bool, nominal) => (nominal === clue ? bool : true)),
          );

          Object.keys(result).forEach((otherPosition) => {
            if (positions.includes(Number(otherPosition))) return;

            result[Number(otherPosition)] = mapValues(result[Number(otherPosition)], (nominalMap) =>
              mapValues(nominalMap, (bool, nominal) => (nominal === clue ? true : bool)),
            );
          });
        }
      });
    }

    if (isType(logEntry, discard, play)) {
      const { position } = logEntry.payload;

      if (position !== undefined) {
        result[position] = mapValues(result[position], (nominalsMap) => mapValues(nominalsMap, () => false));
      }
    }
  });

  return result;
}

const initalLogs: GameAction[] = [
  // discard('YELLOW-3-1'),
  // discard('BLUE-2-1'),
  // reset('YELLOW-3-1'),
  // play('BLUE-1-1'),
  // play('YELLOW-1-0'),
  // play('YELLOW-2-0'),
  // discard('YELLOW-2-1'),
  // play('YELLOW-3-1'),
  // discard('BLUE-2-0'),
  // play('GREEN-1-2'),
  // reset('GREEN-1-2'),
  // discard('YELLOW-3-0'),
  // discard('RED-3-1'),
  // discard('RED-3-0'),
  // discard('WHITE-5-0'),
  // play('GREEN-1-2'),
  // play('GREEN-2-0'),
  hint({ positions: [1, 2], clue: FireworkColor.GREEN }),
];

function calulateFirstAvailableIndex(logs: GameAction[], color: FireworkColor, nominal: FireworkNominal) {
  const outOfGameIndexes = new Set<number>();

  logs.forEach((logEntry) => {
    if (!isType(logEntry, play, discard, reset)) return;

    const [cardColor, cardNominal, cardIndex] = parseCardId(logEntry.payload.cardId);

    if (cardColor !== color || cardNominal !== nominal) return;

    if (isType(logEntry, reset)) {
      outOfGameIndexes.delete(cardIndex);
    } else {
      outOfGameIndexes.add(cardIndex);
    }
  });

  const inGameCardIndexes = difference(
    Array.from({ length: numbersOfCards[nominal] }, (und, numIndex) => numIndex),
    Array.from(outOfGameIndexes),
  );

  return inGameCardIndexes[0];
}

export function App() {
  const [logs, setLogs] = useState<GameAction[]>(initalLogs);
  const discardedCards = calculateDiscardedCards(logs);
  const playedCards = calculatePlayedCards(logs);
  const outOfGameCards = calculateOutOfGameCards(logs);
  const removedBasedOnHintsCards = calculateRemovedBasedOnHintsCards(logs);

  function dispatch(dispatchedAction: GameAction) {
    setLogs((prevLogs) => [...prevLogs, dispatchedAction]);
  }

  return (
    <Tabs isFitted orientation="vertical">
      <TabList>
        <Tab>
          <GiCardPick size="3.5em" />
        </Tab>
        <Tab>
          <GiCardRandom size="3.5em" />
        </Tab>
      </TabList>
      <TabPanels h="100vh">
        <TabPanel h="full">
          <AllCardsTab
            discardedCards={discardedCards}
            playedCards={playedCards}
            onDiscard={(cardId) => {
              dispatch(discard({ cardId }));
            }}
            onReset={(cardId) => {
              dispatch(reset({ cardId }));
            }}
            onPlay={(cardId) => {
              dispatch(play({ cardId }));
            }}
          />
        </TabPanel>
        <TabPanel h="full">
          <HandTab
            removedBasedOnHintsCards={removedBasedOnHintsCards}
            outOfGameCards={outOfGameCards}
            onHint={(positions, clue) => {
              dispatch(hint({ positions, clue }));
            }}
            onDiscard={(position, color, nominal) => {
              const cardIndex = calulateFirstAvailableIndex(logs, color, nominal);
              const cardId = generateCardId([color, nominal, cardIndex as 0 | 1 | 2]);

              dispatch(discard({ cardId, position }));
            }}
            onPlay={(position, color, nominal) => {
              const cardIndex = calulateFirstAvailableIndex(logs, color, nominal);
              const cardId = generateCardId([color, nominal, cardIndex as 0 | 1 | 2]);

              dispatch(play({ cardId, position }));
            }}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
