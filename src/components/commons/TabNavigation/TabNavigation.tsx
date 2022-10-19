import styled from '@emotion/styled';
import React from 'react';
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
  onSelectTab: (tab: TabType, index: number) => void;
  selectedTab: TabType | null;
  children?: React.ReactNode;
};

export const TabNavigation = ({
  tabs,
  selectedTab,
  onSelectTab,
  children,
}: Props) => {
  const handleNavigate = (incomingTab: TabType, index: number) => {
    onSelectTab(incomingTab, index);
  };

  return (
    <Root>
      {children || null}
      <Tabs>
        {tabs.map((tab, key) => (
          <Tab
            selected={selectedTab?.label === tab.label}
            key={key}
            color={selectedTab?.color}
            onClick={() => handleNavigate(tab, key)}
          >
            {tab.icon || null}
            <span>{tab.label}</span>
          </Tab>
        ))}
      </Tabs>
    </Root>
  );
};
