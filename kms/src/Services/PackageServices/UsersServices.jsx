import { Get } from '../CommonService';

export function listUsers() {
  let url = 'https://localhost:44375/super/lsituser';
  return Get(url);
}

export function resetPassword(id) {
  let url = 'https://localhost:44375/super/resetpassword/' + id;
  return Get(url);
}

export function removeUser(id) {
  let url = 'https://localhost:44375/super/remove/' + id;
  return Get(url);
}

export function seachUser(name) {
  let url = 'https://localhost:44375/super/search/' + name;
  return Get(url);
}
