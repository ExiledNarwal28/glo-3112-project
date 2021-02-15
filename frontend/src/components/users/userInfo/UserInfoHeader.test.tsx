import React from 'react';
import { render } from '@testing-library/react';
import { mount } from 'enzyme';
import Box from '@material-ui/core/Box';
import { UserInfoHeader } from './UserInfoHeader';

describe('When rendering UserInfoHeader', () => {
  it('Should render Box', () => {
    render(<Box />);
  });

  it('Should render passed username', () => {
    const wrapper = mount(<UserInfoHeader username="username" />);

    expect(
      wrapper.find("#UserInfoHeaderUsername").hostNodes().text()
    ).toBe("username");
  });
});
