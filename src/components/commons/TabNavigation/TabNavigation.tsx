import styled from '@emotion/styled';
import { Tab } from './Tab';
import { TabType } from './types';

const Root = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-around;
`;

type Props = {
  tabs: TabType[];
  onSelectTab: (tab: TabType) => void;
  selectedTab: TabType | null;
  children?: React.ReactNode;
};

export const TabNavigation = ({
  tabs,
  selectedTab,
  onSelectTab,
  children,
}: Props) => {
  return (
    <Root>
      {children ? children : null}
      <Tabs>
        {tabs.map((tab, key) => (
          <Tab
            selected={selectedTab?.label === tab.label}
            key={key}
            color={selectedTab?.color}
            onClick={() => onSelectTab(tab)}>
            {tab.label}
          </Tab>
        ))}
      </Tabs>
    </Root>
  );
};
