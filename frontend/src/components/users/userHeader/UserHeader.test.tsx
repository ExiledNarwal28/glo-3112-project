import React from 'react';
import { render } from '@testing-library/react';
import { UserHeaderDesktop } from './UserHeaderDesktop';
import { UserHeaderMobile } from './UserHeaderMobile';

const fullname = 'Full Name';
const description = 'This is a description!';
const username = 'UserName';
const stats = {
  totalPost: 45,
};

// TODO: enable for remise 2
// const stats = {
//   totalPost: 45,
//   totalFollowers: 450,
//   totalFollowing: 789,
// };

describe('When rendering UserHeader', () => {
  it('Should render UserHeaderMobile when on mobile device', () => {
    global.innerWidth = 500;

    render(
      <UserHeaderMobile
        fullname={fullname}
        description={description}
        username={username}
        stats={stats}
      />
    );
  });

  it('Should render UserHeaderDesktop when not on mobile device', () => {
    global.innerWidth = 1200;

    render(
      <UserHeaderDesktop
        fullname={fullname}
        description={description}
        username={username}
        stats={stats}
      />
    );
  });
});
