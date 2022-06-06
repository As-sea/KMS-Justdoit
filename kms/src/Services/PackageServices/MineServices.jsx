/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import { Get } from '../CommonService';
export function listSkill() {
  let url = 'https://localhost:44375/dream/skills/list';
  return Get(url);
}

export function createSkill(name) {
  let url = 'https://localhost:44375/dream/skills/create/' + name;
  return Get(url);
}

export function deleteSkill(name) {
  let url = 'https://localhost:44375/dream/skills/remove/' + name;
  return Get(url);
}

export function getmessage(id) {
  let url = 'https://localhost:44375/user/base/getusermessage/' + id;
  return Get(url);
}

export function getid(name) {
  let url = 'https://localhost:44375/user/base/getid/' + name;
  return Get(url);
}

export function checkPass(password) {
  let url = 'https://localhost:44375/normaluser/message/checkpassword/' + password;
  return Get(url);
}

export function changepass(password) {
  let url = 'https://localhost:44375/normal/message/changepassword/' + password;
  return Get(url);
}

export function changemessage(name) {
  let url = 'https://localhost:44375/normal/message/changemessage/' + name;
  return Get(url);
}

export function createImage(image) {
  let url = 'https://localhost:44375/term/images/create/' + image;
  return Get(url);
}

export function listImage() {
  let url = 'https://localhost:44375/term/images/list';
  return Get(url);
}

export function delImage(image) {
  let url = 'https://localhost:44375/term/images/remove/' + image;
  return Get(url);
}
