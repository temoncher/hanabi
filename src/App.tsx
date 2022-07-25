import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { GiCardPick, GiCardRandom } from 'react-icons/gi';

import { AllCardsTab } from './AllCardsTab';
import { HandTab } from './HandTab';

export function App() {
  return (
    <Tabs isFitted orientation="vertical">
      <TabList>
        <Tab>
          <GiCardPick size="4em" />
        </Tab>
        <Tab>
          <GiCardRandom size="4em" />
        </Tab>
      </TabList>
      <TabPanels h="100vh">
        <TabPanel h="full">
          <AllCardsTab />
        </TabPanel>
        <TabPanel h="full">
          <HandTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
