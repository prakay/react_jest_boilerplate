import React from "react";
import { mount } from "enzyme";
import nock from "nock";
import delay from "delay";
import path from "path";
import fs from "fs";

import App from "../src/components/App";
import parser from "../src/utils/parser";

const dataTab = 'li[data-test-name="mario-tab"]';
const dataTabContainer = 'ul[data-test-name="mario-tab-container"]';
const addButton = '[data-test-name="mario-tab-add"]';
const deleteButton = '[data-test-name="mario-tab-delete"]';
const addInput = '[data-test-name="mario-tab-input"]';
const rootTab = 'div[data-test-name="mario-tab-root"]';

const buildSelectors = wrapper => ({
  tabs: () => wrapper.find(dataTab),
  tabContainer: () => wrapper.find(dataTabContainer),
  tabAt: i => wrapper.find(dataTab).at(i),
  addButtonTab: () => wrapper.find(addButton),
  cancelButtonTab: i =>
    wrapper
      .find(dataTab)
      .at(i)
      .find(deleteButton),
  addInput: () => wrapper.find(addInput),
  rootTab: () => wrapper.find(rootTab)
});

const cookiesStub = () => {
  const cookie = {};
  return {
    set: (field, value) => {
      cookie[field] = value;
    },
    get: field => cookie[field]
  };
};

describe("test <App />", () => {
  it("add new tab", async () => {
    const wrapper = mount(<App />);
    const s = buildSelectors(wrapper);
    nock("https://cors.io")
      .defaultReplyHeaders({ "access-control-allow-origin": "*" })
      .get("/?http://www.example.com")
      .replyWithFile(200, path.join(__dirname, "__fixtures__/rss.xml"));
    const sampleData = await parser(
      fs.readFileSync(path.join(__dirname, "__fixtures__/rss.xml"), "utf8")
    );

    expect(s.tabContainer()).toContainMatchingElements(4, dataTab);
    s.addInput().simulate("change", {
      target: { value: "http://www.example.com" }
    });
    expect(s.addInput()).toHaveProp("value", "http://www.example.com");
    s.addButtonTab().simulate("click");
    await delay(100);
    wrapper.update();
    expect(s.tabContainer()).toContainMatchingElements(5, dataTab);
    expect(s.tabContainer()).toIncludeText(sampleData.title);
  });

  it("delete new tab", () => {
    const wrapper = mount(<App />);
    const s = buildSelectors(wrapper);

    expect(s.tabContainer()).toContainMatchingElements(4, dataTab);
    s.cancelButtonTab(3).simulate("click");
    expect(s.tabContainer()).toContainMatchingElements(3, dataTab);
  });

  it("selected second tab", () => {
    const wrapper = mount(<App />);
    const s = buildSelectors(wrapper);

    expect(s.tabAt(0)).toHaveProp("aria-selected", "true");
    expect(s.tabAt(1)).toHaveProp("aria-selected", "false");
    s.tabAt(1).simulate("click");
    expect(s.tabAt(0)).toHaveProp("aria-selected", "false");
    expect(s.tabAt(1)).toHaveProp("aria-selected", "true");
  });

  it("save active tabs to cookie", () => {
    const cookie = cookiesStub();

    const wrapperBefore = mount(<App {...{ cookie }} />);
    const sBefore = buildSelectors(wrapperBefore);

    sBefore.tabAt(3).simulate("click");

    const wrapperAfter = mount(<App {...{ cookie }} />);
    const sAfter = buildSelectors(wrapperAfter);

    expect(sAfter.tabAt(3)).toHaveProp("aria-selected", "true");
  });
});
