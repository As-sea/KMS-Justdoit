/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import { Get, Post } from '../CommonService';
export function listHabit() {
  let url = 'https://localhost:44375/present/habits/habitlist';
  return Get(url);
}

export function createHabit(data) {
  let url = 'https://localhost:44375/present/habits/create';
  return Post(url, data);
}

export function changeStatus(habitName) {
  let url = 'https://localhost:44375/present/habits/changestatus/' + habitName;
  return Get(url);
}

export function deleteHabit(habitName) {
  let url = 'https://localhost:44375/present/habits/remove/' + habitName;
  return Get(url);
}

export function completeHabit(habitName) {
  let url = 'https://localhost:44375/present/habits/complete/' + habitName;
  return Get(url);
}

export function listOpenHabit() {
  let url = 'https://localhost:44375/present/habits/listinhome';
  return Get(url);
}

export function changeHabit(data, name) {
  let url = 'https://localhost:44375/present/habits/change/' + name;
  return Post(url, data);
}

export function listTodoByType(type) {
  let url = 'https://localhost:44375/present/todos/listbyType/' + type;
  return Get(url);
}

export function createTodo(data) {
  let url = 'https://localhost:44375/present/todos/create';
  return Post(url, data);
}

export function changeTodo(data) {
  let url = 'https://localhost:44375/present/todos/change';
  return Post(url, data);
}

export function deleteTodo(id) {
  let url = 'https://localhost:44375/present/todos/remove/' + id;
  return Get(url);
}

export function listTodoUnlessIdea() {
  let url = 'https://localhost:44375/present/todos/listUnlessIdea';
  return Get(url);
}

export function getPlan(id) {
  let url = 'https://localhost:44375/term/plans/listbytodo/' + id;
  return Get(url);
}

export function completeTodo(id) {
  let url = 'https://localhost:44375/present/todos/complete/' + id;
  return Get(url);
}
