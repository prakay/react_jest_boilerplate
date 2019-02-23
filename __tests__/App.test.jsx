import React from 'react';
import { mount } from 'enzyme';

import App from '../src/components/App';

describe('test <App />', () => {
  it('render default tabs', () => {
    const wrapper = mount(<App />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('add new tab', () => {
    const wrapper = mount(<App />);
    const addtab = wrapper.find('[data-test-name="mario-tab-add"]');
    expect(wrapper.render()).toMatchSnapshot();
    addtab.simulate('click');
    expect(wrapper.render()).toMatchSnapshot();
  });
});
