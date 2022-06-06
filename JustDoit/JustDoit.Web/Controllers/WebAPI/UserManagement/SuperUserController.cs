/* ==============================================================
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-01-19    
 * ==============================================================
 */
namespace JustDoit.Web.Controllers.WebAPI.UserManagement
{
    using JustDoit.Web.Services.Models;
    using JustDoit.Web.Services.UserManagement;
    using System.Collections.Generic;
    using System.Web.Http;
    using static JustDoit.Web.Services.CommonServices.CommonEnum;

    public class SuperUserController : ApiController
    {
        SuperUserServices superUserServices = new SuperUserServices();

        [Route("super/resetpassword/{userid}")]
        [HttpGet]
        public bool reset(string userId)
        {
            superUserServices.ChangePassword(userId);
            return true;
        }

        [Route("super/lsituser")]
        [HttpGet]
        public List<DisplayUser> listUser()
        {
            return superUserServices.ListUser();
        }

        [Route("super/search/{name}")]
        [HttpGet]
        public DisplayUser search(string name)
        {
            var user = superUserServices.SearchByLoginName(name);
            if (user != null) return new DisplayUser { LoginName = user.LoginName, DisplayName = user.DisplayName, Id = user.Id };
            return null;
        }

        [Route("super/remove/{id}")]
        [HttpGet]
        public UserOperateStatus remove(string id)
        {
            var message = superUserServices.DeleteUser(id);
            if (message == "could remove") return UserOperateStatus.DeleteSuccess;
            return UserOperateStatus.NoPower;
        }

    }
}
