/* eslint react/prop-types: 0 */

import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import nanoid from "nanoid";
import { remove, findIndex, propEq } from "ramda";
import axios from "axios";
import "react-tabs/style/react-tabs.css";
import parser from "../../utils/parser";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    const { cookie } = props;
    const defaultIndex = cookie ? Number(cookie.get("selectedIndex")) || 0 : 0;
    this.state = {
      tabs: [
        { title: "Tab 1", content: "Content tab 1", key: nanoid() },
        { title: "Tab 2", content: "Content tab 2", key: nanoid() },
        { title: "Tab 3", content: "Content tab 3", key: nanoid() },
        { title: "Tab 4", content: "Content tab 4", key: nanoid() }
      ],
      defaultIndex,
      inputRssUrlValue: ""
    };
  }

  setStateWithLog = state => {
    console.log("state", state);
    this.setState(state);
  };

  onChangeInputRssUrl = e => {
    this.setStateWithLog({
      inputRssUrlValue: e.target.value
    });
  };

  selectTab = index => {
    const { cookie } = this.props;

    if (!cookie) return;

    cookie.set("selectedIndex", index);
  };

  deleteTab = key => {
    const { tabs } = this.state;
    const tabIndex = findIndex(propEq("key", key), tabs);
    if (tabIndex > -1) {
      this.setStateWithLog({ tabs: remove(tabIndex, 1, tabs) });
    }
  };

  addTab = async () => {
    const { inputRssUrlValue, tabs } = this.state;
    try {
      const response = await axios.get(`https://cors.io/?${inputRssUrlValue}`, {
        mode: "no-cors"
      });
      const key = nanoid();
      const data = await parser(response.data);
      return this.setStateWithLog({
        tabs: [
          ...tabs,
          {
            title: data.title,
            content: data.items.map(item => item.title).join(","),
            key
          }
        ]
      });
    } catch (e) {
      return e;
    }
  };

  renderTabs = () => {
    const { tabs } = this.state;

    if (!tabs) return null;

    return tabs.map(tab => (
      <Tab data-test-name="mario-tab" key={tab.key}>
        {tab.title}
        <button
          type="button"
          onClick={() => this.deleteTab(tab.key)}
          data-test-name="mario-tab-delete"
        >
          remove tab
        </button>
      </Tab>
    ));
  };

  renderTabLists = () => {
    const { tabs } = this.state;

    if (!tabs) return null;

    return tabs.map(tab => <TabPanel key={tab.key}>{tab.content}</TabPanel>);
  };

  render() {
    const { defaultIndex, inputRssUrlValue } = this.state;

    return (
      <div>
        <input
          data-test-name="mario-tab-input"
          {...{ value: inputRssUrlValue, onChange: this.onChangeInputRssUrl }}
        />
        <button
          type="button"
          onClick={() => this.addTab()}
          data-test-name="mario-tab-add"
        >
          Add tab
        </button>
        <Tabs
          data-test-name="mario-tab-root"
          onSelect={this.selectTab}
          {...{ defaultIndex }}
        >
          <TabList data-test-name="mario-tab-container">
            {this.renderTabs()}
          </TabList>
          {this.renderTabLists()}
        </Tabs>
      </div>
    );
  }
}

export default App;
