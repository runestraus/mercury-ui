import { User } from '../../model/user.model';

const userdb: {[key: string]: User} = {
  'foo@bar.com': {
    clientId: 'fooclient',
    email: 'foo@bar.com',
    ianaId: 9999,
    isRegistrarLogin: true,
    permissions: ['EPP'],
    registrarName: 'BroDaddy',
  }
};

export function getUser(email: string): User {
  return userdb[email];
}
