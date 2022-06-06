/* 
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-03-30    
 */
import { Get, Post } from '../CommonService';
export function listPlan() {
  let url = 'https://localhost:44375/term/plans/list';
  return Get(url);
}

export function getDream(planId) {
  let url = 'https://localhost:44375/dream/dreams/findbyplan/' + planId;
  return Get(url);
}

export function getDreamName(dreamId) {
  let url = 'https://localhost:44375/dream/dreams/findName/' + dreamId;
  return Get(url);
}

export function deletePlan(planId) {
  let url = 'https://localhost:44375/term/plans/remove/' + planId;
  return Get(url);
}

export function listDream() {
  let url = 'https://localhost:44375/dream/dreams/list';
  return Get(url);
}

export function createPlan(data) {
  let url = 'https://localhost:44375/term/plans/create';
  return Post(url, data);
}

export function changePlan(data) {
  let url = 'https://localhost:44375/term/plans/change';
  return Post(url, data);
}

export function listImage() {
  let url = 'https://localhost:44375/term/images/list';
  return Get(url);
}

export function listPeople() {
  let url = 'https://localhost:44375/term/characters/list';
  return Get(url);
}

export function createPeople(data) {
  let url = 'https://localhost:44375/term/characters/create';
  return Post(url, data);
}

export function changePeople(data, name) {
  let url = 'https://localhost:44375/term/characters/change/' + name;
  return Post(url, data);
}

export function deletePeople(name) {
  let url = 'https://localhost:44375/term/characters/remove/' + name;
  return Get(url);
}
