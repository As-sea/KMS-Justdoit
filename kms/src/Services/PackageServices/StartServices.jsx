import { Get, Post } from '../CommonService';
export function Check(name) {
  let url = 'https://localhost:44375/start/register/check/' + name;
  return Get(url);
}

export function Logout() {
  let url = 'https://localhost:44375/end/logout';
  return Get(url);
}

export function Login(data) {
  let url = 'https://localhost:44375/start/login';
  return Post(url, data);
}

export function register(data) {
  let url = 'https://localhost:44375/start/register';
  return Post(url, data);
}

export function getId(name) {
  let url = 'https://localhost:44375/user/base/getid/' + name;
  return Get(url);
}

export function getLogin(id) {
  let url = 'https://localhost:44375/user/base/getusername/' + id;
  return Get(url);
}

export function getDisplay(id) {
  let url = 'https://localhost:44375/user/base/getdisplay/' + id;
  return Get(url);
}

export function getLevel(id) {
  let url = 'https://localhost:44375/user/base/getlevel/' + id;
  return Get(url);
}
