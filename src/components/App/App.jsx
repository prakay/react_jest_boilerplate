import React, { Component, Fragment } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import nanoid from 'nanoid';
import { remove, findIndex, propEq } from 'ramda';
import 'react-tabs/style/react-tabs.css';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    const key = nanoid();
    this.state = {
      tabs: [
        { title: 'Tab', content: 'Content tab', key }
      ],
    };
  }

  setStateWithLog(state) {
    console.log('state', state);
    this.setState(state);
  }


  deleteTab(key) {
    const { tabs } =  this.state;
    const tabIndex = findIndex(propEq('key', key), tabs);
    if (tabIndex > -1) {
      this.setStateWithLog({ tabs: remove(tabIndex, 1, tabs) });
    }
  }

  addTab() {
    const { tabs } =  this.state;
    const key = nanoid();
    this.setStateWithLog({ tabs: [...tabs, { title: 'Tab', content: 'Content tab', key } ] })
}

  render() {
    const { tabs } = this.state;

    if (!tabs) return null;

    return (
      <Fragment>
        <Tabs>
          <TabList>
            {tabs.map((tab) => (
              <Tab data-test-name="mario-tab" key={tab.key}>
                {tab.title}
                <button type="button" onClick={() => this.deleteTab(tab.key)} data-test-name="mario-tab-delete">remove tab</button>
              </Tab>
            ))}
          </TabList>
          {tabs.map((tab) => (
            <TabPanel key={tab.key}>{tab.content}</TabPanel>
          ))}
        </Tabs>
        <button type="button" onClick={() => this.addTab()} data-test-name="mario-tab-add">Add tab</button>
      </Fragment>
    );
  }
}

export default App;
