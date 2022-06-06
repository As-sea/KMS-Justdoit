/* ==============================================================
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-01-19    
 * ==============================================================
 */
namespace JustDoit.Web.Services.UserManagement
{
    using JustDoit.Web.Repository;
    using JustDoit.Web.Services.Models;
    using System;
    using System.Web;

    public class UserBaseService
    {
        public string GetUserID(string loginName)
        {
            try
            {
                var userOperate = new UserRepository();
                User user = userOperate.Get(x => x.LoginName == loginName);
                return user.Id;
            }
            catch (Exception ex)
            {
                throw new Exception("UserBase have ex:{0}", ex);
            }

        }
        public string GetUserName(string id)
        {
            try
            {
                var userOperate = new UserRepository();
                User user = userOperate.Get(x => x.Id == id);
                return user.LoginName;
            }
            catch (Exception ex)
            {
                throw new Exception("UserBase have ex:{0}", ex);
            }

        }
        public string GetDisplayName(string id)
        {
            try
            {
                var userOperate = new UserRepository();
                User user = userOperate.Get(x => x.Id == id);
                string name = user.DisplayName;
                return string.IsNullOrEmpty(name) ? user.LoginName : name;
            }
            catch (Exception ex)
            {
                throw new Exception("UserBase have ex:{0}", ex);
            }

        }

        public UserLevel GetUserLevel(string id)
        {
            try
            {
                var userOperate = new UserRepository();
                User user = userOperate.Get(x => x.Id == id);

                return user.UserLevel;
            }
            catch (Exception ex)
            {
                throw new Exception("UserBase have ex:{0}", ex);
            }
        }


        public string GetCookieValue()
        {
            try
            {
                string value = HttpContext.Current.Request.Cookies[HttpUtility.UrlEncode("User")].Values[HttpUtility.UrlEncode("Id")];
                return string.IsNullOrEmpty(value) ? string.Empty : HttpUtility.UrlDecode(value);
            }

            catch (Exception ex)
            {
                throw new Exception("UserBase have ex:{0}", ex);
            }
        }
        public void RemoveCookie()
        {
            try
            {
                HttpContext.Current.Response.Cookies.Remove(HttpUtility.UrlEncode("UserInfo"));
                HttpContext.Current.Response.Cookies[HttpUtility.UrlEncode("UserInfo")].Expires = DateTime.Now.AddDays(-1);
            }

            catch (Exception ex)
            {
                throw new Exception("UserBase have ex:{0}", ex);
            }
        }
    }
}