export function setCookie(value, expiredays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = `UserInfo=${value}; expires=${exdate.toGMTString()}`;
}

export function getCookie() {
  var name = document.cookie.split(';')[0].split('=')[1];
  if (name) return name;
  else return null;
}

export function delCookie() {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie('UserInfo');
  if (cval != null) document.cookie = 'UserInfo=' + cval + ';expires=' + exp.toGMTString();
}
