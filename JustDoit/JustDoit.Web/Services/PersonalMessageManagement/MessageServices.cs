/* ==============================================================
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-01-19    
 * ==============================================================
 */
namespace JustDoit.Web.Services.PersonalMessageManagement
{
    using JustDoit.Web.Repository;
    using JustDoit.Web.Services.CommonServices.Temp;
    using JustDoit.Web.Services.UserManagement;
    using System;
    using System.Security.Cryptography;
    using System.Text;
    using static JustDoit.Web.Services.CommonServices.CommonEnum;

    public class MessageServices
    {
        UserRepository userOperate = new UserRepository();
        string id;
        public MessageServices() => this.id = new TempServices().getCookie();// "62811a3e07c0446c08e55bf7"; //new UserBaseService().GetCookieValue();

        public bool CheckPassword(string password)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(password))
                    if (userOperate.Get(id).Password == MD5Encrypt64(password)) return true;
                return false;
            }
            catch (Exception ex)
            {
                throw new Exception("AddCharacter have ex : {0}", ex);
            }

        }
        public OperateStatus ChangePassword(string password)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(password))
                {
                    var user = userOperate.Get(id);
                    user.Password = MD5Encrypt64(password);
                    if (userOperate.Update(user) > 0) return OperateStatus.Success;
                    else return OperateStatus.UpdatePasswordFail;
                }
                else return OperateStatus.NewPasswordIsNull;
            }
            catch (Exception ex)
            {
                throw new Exception("AddCharacter have ex : {0}", ex);
            }
        }

        public static string MD5Encrypt64(string password)
        {
            MD5 md5 = MD5.Create();
            return Convert.ToBase64String(md5.ComputeHash(Encoding.UTF8.GetBytes(password)));
        }

        public OperateStatus ChangeMessage(string displayName)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(displayName))
                {
                    var user = userOperate.Get(id);
                    user.DisplayName = displayName;
                    if (userOperate.Update(user) > 0) return OperateStatus.Success;
                    else return OperateStatus.UpdateDisplayFail;
                }
                return OperateStatus.Fial;
            }
            catch (Exception ex)
            {
                throw new Exception("AddCharacter have ex : {0}", ex);
            }
        }

    }
}