import { RepeatClockIcon } from '@chakra-ui/icons';
import { ButtonGroup, IconButton, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { mapValues } from 'lodash';
import { useEffect, useState } from 'react';
import { GiCardPick, GiCardRandom } from 'react-icons/gi';
import { action, payload, union, isType } from 'ts-action';

import { AllCardsTab } from './AllCardsTab';
import { HandTab } from './HandTab';
import { numbersOfCards } from './constants';
import { CardId, FireworkColor, FireworkNominal, parseCardId, generateCardId } from './types';

function isEnum<T extends string | number, TEnumValue extends string>(enumVariable: { [key in T]: TEnumValue }) {
  const enumValues = Object.values(enumVariable);

  return (value: unknown): value is TEnumValue =>
    (typeof value === 'string' || typeof value === 'number') && enumValues.includes(value);
}

const discard = action('DISCARD', payload<{ cardId: CardId; position?: number }>());
const play = action('PLAY', payload<{ cardId: CardId; position?: number }>());
const hint = action('HINT', payload<{ positions: number[]; clue: FireworkColor | FireworkNominal }>());
const gameAction = union(discard, play, hint);

type GameAction = typeof gameAction.actions;

function calculateOutOfGameCards(logs: GameAction[]) {
  const result = Object.fromEntries(
    Object.values(FireworkColor).flatMap((color) =>
      Object.values(FireworkNominal).map((nominal) => [generateCardId([color, nominal]), 0] as const),
    ),
  ) as Record<CardId, number>;

  logs.forEach((logEntry) => {
    if (!isType(logEntry, discard, play)) return;

    result[logEntry.payload.cardId] += 1;
  });

  return mapValues(result, (numberOfCards, cardId) => {
    const nominal = parseCardId(cardId as CardId)[1];

    return numberOfCards === numbersOfCards[nominal];
  });
}

function calculateDiscardedCards(logs: GameAction[]) {
  const result: Partial<Record<CardId, number>> = {};

  logs.forEach((logEntry) => {
    if (!isType(logEntry, discard)) return;

    result[logEntry.payload.cardId] = (result[logEntry.payload.cardId] ?? 0) + 1;
  });

  return result;
}

function calculatePlayedCards(logs: GameAction[]) {
  const result: Partial<Record<CardId, 1>> = {};

  logs.forEach((logEntry) => {
    if (!isType(logEntry, play)) return;

    result[logEntry.payload.cardId] = 1;
  });

  return result;
}

function calculateRemovedBasedOnHintsCards(logs: GameAction[]) {
  const result = Object.fromEntries(
    Array.from({ length: 5 }, (und, cardPosition) => {
      const idsMap = Object.fromEntries(
        Object.values(FireworkColor).flatMap((color) =>
          Object.values(FireworkNominal).map((nominal) => [generateCardId([color, nominal]), false] as const),
        ),
      ) as Record<CardId, boolean>;

      return [cardPosition, idsMap] as const;
    }),
  ) as Record<number, Record<CardId, boolean>>;

  logs.forEach((logEntry) => {
    if (isType(logEntry, hint)) {
      const { positions, clue } = logEntry.payload;

      positions.forEach((position) => {
        if (isEnum(FireworkColor)(clue)) {
          result[position] = mapValues(result[position], (isAlreadyRemoved, cardId) => {
            const [color] = parseCardId(cardId as CardId);

            return color === clue ? isAlreadyRemoved : true;
          });

          Object.keys(result).forEach((otherPositionString) => {
            const otherPosition = Number(otherPositionString);

            if (positions.includes(otherPosition)) return;

            result[otherPosition] = mapValues(result[otherPosition], (isAlreadyRemoved, cardId) => {
              const [color] = parseCardId(cardId as CardId);

              return color === clue ? true : isAlreadyRemoved;
            });
          });
        } else {
          result[position] = mapValues(result[position], (isAlreadyRemoved, cardId) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [color, nominal] = parseCardId(cardId as CardId);

            return nominal === clue ? isAlreadyRemoved : true;
          });

          Object.keys(result).forEach((otherPositionString) => {
            const otherPosition = Number(otherPositionString);

            if (positions.includes(otherPosition)) return;

            result[otherPosition] = mapValues(result[otherPosition], (isAlreadyRemoved, cardId) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const [color, nominal] = parseCardId(cardId as CardId);

              return nominal === clue ? true : isAlreadyRemoved;
            });
          });
        }
      });
    }

    if (isType(logEntry, discard, play)) {
      const { position } = logEntry.payload;

      if (position !== undefined) {
        result[position] = mapValues(result[position], () => false);
      }
    }
  });

  return result;
}

const storedLogs = (JSON.parse(localStorage.getItem('logs')!) as GameAction[] | null) ?? [];

const initalLogs: GameAction[] =
  // eslint-disable-next-line no-nested-ternary
  import.meta.env.MODE !== 'development'
    ? storedLogs
    : storedLogs.length !== 0
    ? storedLogs
    : [
        discard({ cardId: 'YELLOW-3' }),
        discard({ cardId: 'BLUE-2' }),
        play({ cardId: 'BLUE-1' }),
        play({ cardId: 'YELLOW-1' }),
        play({ cardId: 'YELLOW-2' }),
        discard({ cardId: 'YELLOW-2' }),
        play({ cardId: 'YELLOW-3' }),
        discard({ cardId: 'BLUE-2' }),
        play({ cardId: 'GREEN-1' }),
        discard({ cardId: 'YELLOW-3' }),
        discard({ cardId: 'RED-3' }),
        discard({ cardId: 'RED-3' }),
        discard({ cardId: 'WHITE-5' }),
        play({ cardId: 'GREEN-1' }),
        play({ cardId: 'GREEN-2' }),
        hint({ positions: [1, 2], clue: FireworkColor.GREEN }),
      ];

export function App() {
  const [logs, setLogs] = useState<GameAction[]>(initalLogs);
  const discardedCards = calculateDiscardedCards(logs);
  const playedCards = calculatePlayedCards(logs);
  const outOfGameCards = calculateOutOfGameCards(logs);
  const removedBasedOnHintsCards = calculateRemovedBasedOnHintsCards(logs);

  useEffect(() => {
    localStorage.setItem('logs', JSON.stringify(logs));
  }, [logs]);

  function dispatch(dispatchedAction: GameAction) {
    setLogs((prevLogs) => [...prevLogs, dispatchedAction]);
  }

  function undo() {
    setLogs((prevLogs) => prevLogs.slice(0, prevLogs.length - 1));
  }

  return (
    <>
      <ButtonGroup position="fixed" top={7} right={7} gap={1} zIndex={10}>
        {logs.length !== 0 && (
          <IconButton
            isRound
            colorScheme="blue"
            aria-label="undo"
            size="lg"
            shadow="md"
            icon={<RepeatClockIcon boxSize={8} color="white" />}
            onClick={undo}
          />
        )}
      </ButtonGroup>
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
              onDiscard={(position, cardId) => {
                dispatch(discard({ cardId, position }));
              }}
              onPlay={(position, cardId) => {
                dispatch(play({ cardId, position }));
              }}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
