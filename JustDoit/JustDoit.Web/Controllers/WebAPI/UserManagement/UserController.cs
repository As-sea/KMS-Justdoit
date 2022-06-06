/* ==============================================================
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-01-19    
 * ==============================================================
 */
namespace JustDoit.Web.Controllers.WebAPI.UserManagement
{
    using JustDoit.Web.Services.Models;
    using JustDoit.Web.Services.PersonalMessageManagement;
    using JustDoit.Web.Services.UserManagement;
    using System.Web.Http;
    using static JustDoit.Web.Services.CommonServices.CommonEnum;

    public class UserController : ApiController
    {
        UserBaseService userBaseService = new UserBaseService();

        [Route("user/base/getid/{name}")]
        [HttpGet]
        public string GetId(string name)
        {
            return userBaseService.GetUserID(name);
        }

        [Route("user/base/getusermessage/{id}")]
        [HttpGet]
        public User GetUser(string id)
        {
            return new Repository.UserRepository().Get(id);
        }


        [Route("user/base/getusername/{id}")]
        [HttpGet]
        public string GetName(string Id)
        {
            return userBaseService.GetUserName(Id);
        }

        [Route("user/base/getdisplay/{id}")]
        [HttpGet]
        public string GetDisplay(string Id)
        {
            return userBaseService.GetDisplayName(Id);
        }

        [Route("user/base/getlevel/{id}")]
        [HttpGet]
        public UserLevel GetLevel(string Id)
        {
            return userBaseService.GetUserLevel(Id);
        }

        MessageServices messageServices = new MessageServices();

        [Route("normaluser/message/checkpassword/{password}")]
        [HttpGet]
        public bool check(string password)
        {
            return messageServices.CheckPassword(password);
        }

        [Route("normal/message/changepassword/{password}")]
        [HttpGet]
        public OperateStatus ChangePassword(string password)
        {
            return messageServices.ChangePassword(password);
        }

        [Route("normal/message/changemessage/{name}")]
        [HttpGet]
        public OperateStatus ChangeName(string name)
        {
            return messageServices.ChangeMessage(name);
        }
    }
}
