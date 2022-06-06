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
    using System.Collections.Generic;
    using System.Security.Cryptography;
    using System.Text;

    public class SuperUserServices
    {
        UserRepository userOperate = new UserRepository();
        string ID;
        public SuperUserServices()
        {
            UserBaseService userBaseService = new UserBaseService();
            //string ID = userBaseService.GetCookieValue();
            //if (userBaseService.GetUserLevel(ID) == UserLevel.SuperUser) this.ID = ID;
            //else return;
            this.ID = "6279d4e007c04462d809f5b5";
        }

        public string DeleteUser(string id)
        {
            try
            {

                DreamRepository dreamOperate = new DreamRepository();
                PlanRepository planOperate = new PlanRepository();
                TodoRepository todoOperate = new TodoRepository();
                PeriodicRepository periodicOperate = new PeriodicRepository();
                if (userOperate.Get(id).UserLevel == UserLevel.NormalUser)
                {
                    dreamOperate.DeleteMany(x => x.UserId == id);
                    planOperate.DeleteMany(x => x.UserId == id);
                    todoOperate.DeleteMany(x => x.UserId == id);
                    periodicOperate.DeleteMany(x => x.UserId == id);
                    userOperate.Delete(id);
                    return "could remove";
                }
                else return "you hane no power";

            }
            catch (Exception ex)
            {
                throw new Exception("SuperUser detele normalUser have ex : {0}", ex);
            }

        }

        public User SearchById(string id)
        {
            try
            {
                return userOperate.Get(id);
            }
            catch (Exception ex)
            {
                throw new Exception("SuperUser search by id have ex : {0}", ex);
            }
        }

        public User SearchByLoginName(string loginName)
        {
            try
            {
                return userOperate.Get(x => x.LoginName == loginName);
            }
            catch (Exception ex)
            {
                throw new Exception("SuperUser search by name have ex : {0}", ex);
            }
        }

        public List<DisplayUser> ListUser()
        {
            try
            {
                //List<User> userList = (List<User>)userOperate.GetAll();

                List<User> users = (List<User>)userOperate.GetAll();
                List<DisplayUser> uerList = new List<DisplayUser>();
                foreach (var u in users)
                {
                    DisplayUser user = new DisplayUser();
                    user.LoginName = u.LoginName;
                    user.DisplayName = u.DisplayName;
                    user.Id = u.Id;
                    uerList.Add(user);
                }
                return uerList;
            }
            catch (Exception ex)
            {
                throw new Exception("SuperUser listUser have ex : {0}", ex);
            }

        }

        public void ChangePassword(string id)
        {
            try
            {
                User user = userOperate.Get(id);
                MD5 md5 = MD5.Create();
                user.Password = Convert.ToBase64String(md5.ComputeHash(Encoding.UTF8.GetBytes("P@ssw0rd!@")));
                userOperate.Update(user);
            }
            catch (Exception ex)
            {
                throw new Exception("superUser change password have ex : {0}", ex);
            }
        }
    }

    public class DisplayUser
    {
        public string LoginName { get; set; }
        public string DisplayName { get; set; }
        public string Id { get; set; }
    }
}