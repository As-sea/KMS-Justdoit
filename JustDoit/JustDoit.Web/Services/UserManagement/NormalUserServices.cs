/* ==============================================================
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-01-19    
 * ==============================================================
 */
namespace JustDoit.Web.Services.UserManagement
{
    using JustDoit.Web.Repository;
    using JustDoit.Web.Services.CommonServices.Temp;
    using JustDoit.Web.Services.Models;
    using System;
    using System.Net;
    using System.Security.Cryptography;
    using System.Text;
    using System.Web;
    using static JustDoit.Web.Services.CommonServices.CommonEnum;

    public class NormalUserServices
    {
        public LoginReturn Login(string loginName, string password, bool isRemember)
        {
            try
            {
                var userOperate = new UserRepository();
                User user = userOperate.Get(x => x.LoginName.ToLower() == loginName.ToLower());
                if (user != null)
                {
                    var passMD5 = MD5Encrypt64(password);
                    if (user.Password == passMD5)
                    {
                      //  Cookie cookie = new Cookie("aaa");
                        HttpCookie cookie = new HttpCookie("User");
                        cookie.Domain = "http://localhost:3000";
                        cookie.Expires = isRemember ? DateTime.Now.AddDays(30) : DateTime.Now.AddDays(1);
                        cookie.Values["Id"] = user.Id;
                        HttpContext.Current.Response.AppendCookie(cookie);
                        new TempServices().writeCookie(user.Id, isRemember ? DateTime.Now.AddDays(30) : DateTime.Now.AddDays(1));
                        if (user.UserLevel == UserLevel.NormalUser) return new LoginReturn { LoginName = user.LoginName, Id = user.Id, Status = UserOperateStatus.NormalSuccess };
                        else return new LoginReturn { LoginName = user.LoginName, Id = user.Id, Status = UserOperateStatus.SuperLoginSuccess };
                    }
                    else return new LoginReturn { LoginName = null, Id = null, Status = UserOperateStatus.PasswordError };
                }
                else
                {
                    return new LoginReturn { LoginName = null, Id = null, Status = UserOperateStatus.NotFoundObject };
                }
            }
            catch (Exception ex)
            {
                throw new Exception("NormalUser Login have ex : {0}", ex);
            }
        }

        public UserOperateStatus Register(User user)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(user.LoginName) || string.IsNullOrWhiteSpace(user.Password))
                    return UserOperateStatus.MissRequired;
                var userOperate = new UserRepository();
                if (CheckRepeat(user.LoginName) == UserOperateStatus.ExistedUser) return UserOperateStatus.ExistedUser;
                user.Password = MD5Encrypt64(user.Password);
                userOperate.Add(user);
                return UserOperateStatus.NormalSuccess;

            }
            catch (Exception ex)
            {
                throw new Exception("NormalUser Register have ex : {0}", ex);
            }
        }

        public void Logout()
        {
            try
            {
                UserBaseService userBaseService = new UserBaseService();
                userBaseService.RemoveCookie();
                new TempServices().delCookis();
            }
            catch (Exception ex)
            {
                throw new Exception("NormalUser Register have ex : {0}", ex);
            }
        }

        public UserOperateStatus CheckRepeat(string loginName)
        {
            try
            {

                var userOperate = new UserRepository();
                if (userOperate.GetCount(x => x.LoginName.ToLower() == loginName.ToLower()) > 0)
                {
                    Console.WriteLine("LoginName already exists , please change another LoginName.");
                    return UserOperateStatus.ExistedUser;
                }

                return UserOperateStatus.UnexistedUser;
            }
            catch (Exception ex)
            {
                throw new Exception("NormalUser Register have ex : {0}", ex);
            }
        }

        //about crete superLevel User , so not used usually.
        public UserOperateStatus CreateSuper(string LoginName, string password)
        {
            try
            {
                var userOperate = new UserRepository();
                userOperate.Add(new User
                {
                    LoginName = LoginName,
                    DisplayName = LoginName,
                    Password = MD5Encrypt64(password),
                    UserLevel = UserLevel.SuperUser
                });
                return UserOperateStatus.SuperLoginSuccess;
            }
            catch (Exception ex)
            {
                throw new Exception("NormalUser Register have ex : {0}", ex);
            }

        }
        public static string MD5Encrypt64(string password)
        {
            string cl = password;
            MD5 md5 = MD5.Create(); //实例化一个md5对像
                                    // 加密后是一个字节类型的数组，这里要注意编码UTF8/Unicode等的选择　
            byte[] s = md5.ComputeHash(Encoding.UTF8.GetBytes(cl));
            return Convert.ToBase64String(s);
        }

    }

    public class LoginReturn
    {
        public string LoginName { get; set; }
        public string Id { get; set; }
        public UserOperateStatus Status { get; set; }
    }
}