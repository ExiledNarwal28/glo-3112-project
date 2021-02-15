import { useState } from 'react';
import { User, UserCreationParams } from 'types/users';
import useAPI from './useAPI';

// TODO : Use this hook in appropriate component
export default function useCreateUser(userCreationParams: UserCreationParams) {
  const [user, setUser] = useState<User>();
  const [isLoading, error, fetchData] = useAPI(
    'createUser',
    setUser,
    userCreationParams
  );

  // TODO : Use everything in the hook or remove them
  return [user, isLoading, error, fetchData];
}
