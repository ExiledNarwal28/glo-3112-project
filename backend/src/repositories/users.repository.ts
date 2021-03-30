import _ from 'lodash';
import {
  User,
  UserCreationParams,
  UserModificationParams,
} from '../types/users';
import { v4 as uuidv4 } from 'uuid';
import {
  BadRequestError,
  DeserializationError,
  DuplicateEntityError,
  NotFoundEntityError,
} from '../types/errors';
import { Users } from '../models/users.model';

export class UsersRepository {
  public async authenticateUser(params: {
    googleId: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarReference: string;
    sessionToken?: string;
    sessionEndTime?: Date;
  }): Promise<User> {
    params.sessionToken = uuidv4();
    params.sessionEndTime = new Date(Date.now() + 1000 * 60 * 60);
    let user = await Users.findOneAndUpdate(
      {
        googleId: params.googleId,
      },
      {
        $set: _.pick(params, ['sessionToken', 'sessionEndTime']),
      },
      { new: true },
    ).exec();
    if (!user) {
      params.username = await this.nextAvailableUsername(params.username);
      user = await Users.create(params);
    }
    return user;
  }

  public async nextAvailableUsername(base: string): Promise<string> {
    if (!(await Users.findOne({ username: base }).exec())) {
      return base;
    }
    let i = 0;
    let user;
    do {
      user = await Users.findOne({ username: base + '.' + (1 + i++) }).exec();
    } while (user);
    return base + '.' + i;
  }

  public async findAuthenticated(sessionToken: string): Promise<User> {
    const user = await Users.findOne({
      sessionToken,
      sessionEndTime: { $gt: new Date(Date.now()) },
    }).exec();
    if (user) {
      return user.toJSON();
    }
    throw new DeserializationError('Invalid session token');
  }

  public async getUsers(username: string): Promise<User[]> {
    return (
      await Users.find({
        username: { $regex: new RegExp(username, 'i') },
      }).exec()
    ).map((user) => user.toJSON());
  }

  public async getUser(username: string): Promise<User> {
    const user = await Users.findOne({ username }).exec();

    if (user) {
      return user.toJSON();
    }

    throw new NotFoundEntityError(`User ${username} doesn't exist`);
  }

  public async createUser(params: UserCreationParams): Promise<User> {
    try {
      return (
        await Users.create({
          username: params.username,
          email: params.email,
          phoneNumber: params.phoneNumber,
          firstName: params.firstName,
          lastName: params.lastName,
        })
      ).toJSON();
    } catch (err) {
      UsersRepository.throwIfDuplicateKeyError(
        err,
        params.email,
        params.phoneNumber,
        params.username,
      );
      throw new BadRequestError('Could not create user');
    }
  }

  public async updateUser(
    username: string,
    params: UserModificationParams,
  ): Promise<User> {
    if (params.notifiedAt && params.notifiedAt > new Date(Date.now())) {
      throw new BadRequestError('Invalid date time');
    }
    try {
      const updatedUser = await Users.findOneAndUpdate(
        { username },
        {
          $set: _.pick(params, [
            'email',
            'phoneNumber',
            'firstName',
            'lastName',
            'description',
            'avatarReference',
            'notifiedAt',
          ]),
        },
        { new: true, runValidators: true },
      ).exec();

      if (updatedUser) {
        return updatedUser.toJSON();
      }
    } catch (err) {
      UsersRepository.throwIfDuplicateKeyError(
        err,
        params.email,
        params.phoneNumber,
      );
      throw new BadRequestError('Could not update user');
    }

    throw new NotFoundEntityError(`User ${username} doesn't exist`);
  }

  public async deleteUser(username: string): Promise<any> {
    if (!(await Users.exists({ username: username }))) {
      throw new NotFoundEntityError(`User ${username} doesn't exist`);
    }

    return Users.deleteOne({ username: username });
  }

  private static throwIfDuplicateKeyError(
    err: any,
    email?: string,
    phoneNumber?: string,
    username?: string,
  ) {
    if (err.keyPattern) {
      if ('username' in err.keyPattern) {
        throw new DuplicateEntityError(`Username ${username} already in use`);
      }

      if ('email' in err.keyPattern) {
        throw new DuplicateEntityError(`Email ${email} already in use`);
      }

      if ('phoneNumber' in err.keyPattern) {
        throw new DuplicateEntityError(
          `Phone number ${phoneNumber} already in use`,
        );
      }
    }
  }
}
