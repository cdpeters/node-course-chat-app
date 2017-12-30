const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Chris',
      room: 'node course'
    },{
      id: '2',
      name: 'Jo',
      room: 'react course'
    },{
      id: '3',
      name: 'Eyad',
      room: 'node course'
    }];
  });

  it('should add new user', () => {
    var users = new Users();
    var user = {
      id: '123',
      name: 'Chris',
      room: 'Boardroom'
    };
    var resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should return names for node course room', () => {
    var userList = users.getUserList('node course');

    expect(userList).toEqual([users.users[0].name,users.users[2].name]);
  });

  it('should return names for react course room', () => {
    var userList = users.getUserList('react course');

    expect(userList).toEqual([users.users[1].name]);
  });

  it('should remove a user', () => {
    var userId = '2';
    var user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    var userId = '99';
    var user = users.removeUser(userId);

    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    var userId = '2';
    var user = users.getUser(userId);

    expect(userId).toBe(userId);
  });

  it('should not find user', () => {
    var userId = '99';
    var user = users.getUser(userId);

    expect(user).toNotExist();
  });
});
