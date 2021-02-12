import React from 'react';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { mount } from 'enzyme';
import UserAvatar from './UserAvatar';

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(1),
    height: theme.spacing(1),
  },
}));

const UserAvatarWrapper = () => {
  const classes = useStyles();
  return <UserAvatar userName="Test" size={classes.small} />;
};

describe('When rendering UserAvatar', () => {
  it('Should show avatar image when image src prop is passed', () => {
    const wrapper = mount(<UserAvatar userName="Test" src="image/source" />);

    expect(wrapper.find('.MuiAvatar-img')).toHaveLength(1);
  });

  it('Should show username first letter when image src prop is absent', () => {
    const wrapper = mount(<UserAvatar userName="Test" />);

    expect(wrapper.find('.MuiAvatar-root').text()).toBe('T');
  });

  it('Should render Avatar with the given size', () => {
    const wrapper = mount(<UserAvatarWrapper />);

    expect(wrapper.find('.MuiAvatar-root').hasClass('makeStyles-small-2')).toBe(
      true
    );
  });

  it('Should render Avatar with the default size if no size given', () => {
    const wrapper = mount(<UserAvatar userName="Test" />);

    expect(
      wrapper.find('.MuiAvatar-root').hasClass('makeStyles-defaultSize-1')
    ).toBe(true);
  });

  it('Should render Avatar', () => {
    render(<Avatar />);
  });
});
