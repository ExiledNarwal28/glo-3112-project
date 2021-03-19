import React from 'react';
import { render, mount } from 'enzyme';
import { expect } from 'chai';
import { wrapInMemoryRouter } from 'util/wrapInMemoryRouter';
import { PostFactory } from 'factories/PostFactory';
import { UserFactory } from 'factories/UserFactory';
import { UserHeader } from 'components/users/header/UserHeader';
import useGetUser from 'hooks/users/useGetUser';
import useGetUserPosts from 'hooks/users/useGetUserPosts';
import UserView from './UserView';

const username = 'username';
const user = UserFactory.make();
const post = PostFactory.make();

const userResponse = {
  user,
  error: null,
  isLoading: false,
};

const userPostsResponse = {
  posts: [post],
  error: null,
  isLoading: false,
};

jest.mock('hooks/users/useGetUser');
jest.mock('hooks/users/useGetUserPosts');

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useParams: () => ({ username }),
}));

describe('When rendering UserView', () => {
  beforeEach(() => {
    useGetUser.mockReturnValue(userResponse);
    useGetUserPosts.mockReturnValue(userPostsResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render', () => {
    render(wrapInMemoryRouter(<UserView />));
  });

  it('Should display UserHeader', () => {
    const wrapper = mount(wrapInMemoryRouter(<UserView username={username} />));
    const componentExists = wrapper.containsMatchingElement(
      <UserHeader
        username={user.username}
        stats={{ totalPost: userPostsResponse.posts.length }}
        fullname={`${user.firstName} ${user.lastName}`}
        description={user.description}
        avatarSrc={user.avatarReference}
        createdAt={user.createdAt}
      />
    );
    expect(componentExists).to.be.equal(true);
  });
});