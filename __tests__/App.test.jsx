import React from "react";
import { mount } from "enzyme";

import App from "../src/components/App";

describe("test <App />", () => {
  it("render default tabs", () => {
    const wrapper = mount(<App />);
    expect(wrapper).toMatchSnapshot();
  });

  it("render click to third tab", () => {
    const wrapper = mount(<App />);
    console.log("tab", wrapper.find("Tab").get(3));
    wrapper
      .find('[data-test-name="mario-tab"]')
      .at(3)
      .simulate("click");
    expect(wrapper).toMatchSnapshot();
  });
});
