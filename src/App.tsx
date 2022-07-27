import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { pickBy, mapValues } from 'lodash';
import { useState } from 'react';
import { GiCardPick, GiCardRandom } from 'react-icons/gi';
import { action, payload, union, isType } from 'ts-action';

import { AllCardsTab } from './AllCardsTab';
import { HandTab } from './HandTab';
import { numbersOfCards, CardId, FireworkColor, FireworkNominal, parseCardId } from './types';

function isDefined<T>(obj: T): obj is Exclude<T, undefined> {
  return obj !== undefined;
}

const discard = action('DISCARD', payload<CardId>());
const play = action('PLAY', payload<CardId>());
const reset = action('RESET', payload<CardId>());
const gameAction = union(discard, play, reset);

type GameAction = typeof gameAction.actions;

function calculateOutOfGameCards(logs: GameAction[]) {
  const result = Object.fromEntries(
    Object.values(FireworkColor).map((color) => {
      const nominalMap = Object.values(FireworkNominal).map((nominal) => [nominal, 0] as const);

      return [color, Object.fromEntries(nominalMap) as Record<FireworkNominal, number>] as const;
    }),
  ) as Record<FireworkColor, Record<FireworkNominal, number>>;

  logs.forEach((logEntry) => {
    if (!isType(logEntry, discard, play, reset)) return;

    const [color, nominal] = parseCardId(logEntry.payload);

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

    result[logEntry.payload] = isType(logEntry, reset) ? undefined : true;
  });

  return pickBy(result, isDefined) as Partial<Record<CardId, true>>;
}

function calculatePlayedCards(logs: GameAction[]) {
  const result: Partial<Record<CardId, true | undefined>> = {};

  logs.forEach((logEntry) => {
    if (!isType(logEntry, play, reset)) return;

    result[logEntry.payload] = isType(logEntry, reset) ? undefined : true;
  });

  return pickBy(result, isDefined) as Partial<Record<CardId, true>>;
}

const initalLogs: GameAction[] = [
  discard('YELLOW-3-1'),
  discard('BLUE-2-1'),
  reset('YELLOW-3-1'),
  play('BLUE-1-1'),
  play('YELLOW-1-0'),
  play('YELLOW-2-0'),
  discard('YELLOW-2-1'),
  play('YELLOW-3-1'),
  discard('BLUE-2-0'),
  play('GREEN-1-2'),
  reset('GREEN-1-2'),
  discard('YELLOW-3-0'),
  discard('RED-3-1'),
  discard('RED-3-0'),
  discard('WHITE-5-0'),
  play('GREEN-1-2'),
  play('GREEN-2-0'),
];

export function App() {
  const [logs, setLogs] = useState<GameAction[]>(initalLogs);
  const discardedCards = calculateDiscardedCards(logs);
  const playedCards = calculatePlayedCards(logs);
  const outOfGameCards = calculateOutOfGameCards(logs);

  function dispatch(dispatchedAction: GameAction) {
    setLogs([...logs, dispatchedAction]);
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
              dispatch(discard(cardId));
            }}
            onReset={(cardId) => {
              dispatch(reset(cardId));
            }}
            onPlay={(cardId) => {
              dispatch(play(cardId));
            }}
          />
        </TabPanel>
        <TabPanel h="full">
          <HandTab outOfGameCards={outOfGameCards} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
