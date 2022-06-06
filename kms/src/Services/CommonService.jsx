/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
function Fetch(url, method, data) {
  let request = {
    method: method,
 
     credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: method === 'GET' ? null : JSON.stringify(data),
  };
  return fetch(url, request);
}

export function Get(url) {
  return Fetch(url, 'GET').then(response => {
    return response.json();
  });
}

export function Post(url, data) {
  return Fetch(url, 'POST', data).then(response => {
    return response.json();
  });
}
