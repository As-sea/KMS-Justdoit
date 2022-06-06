/* 
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-03-30    
 */
import { Get, Post } from '../CommonService';
export function listDream() {
  let url = 'https://localhost:44375/dream/dreams/list';
  return Get(url);
}

export function createDream(data) {
  let url = 'https://localhost:44375/dream/dreams/create';
  return Post(url, data);
}

export function listSkills() {
  let url = 'https://localhost:44375/dream/skills/list';
  return Get(url);
}

export function changeDream(data) {
  let url = 'https://localhost:44375/dream/dreams/change';
  return Post(url, data);
}

export function deleteDream(id) {
  let url = 'https://localhost:44375/dream/dreams/remove/' + id;
  return Get(url);
}
