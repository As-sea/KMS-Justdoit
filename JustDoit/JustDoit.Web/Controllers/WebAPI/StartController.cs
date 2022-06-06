/* ==============================================================
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-01-19    
 * ==============================================================
 */
namespace JustDoit.Web.Controllers.WebAPI
{
    using JustDoit.Web.Services.Models;
    using JustDoit.Web.Services.UserManagement;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using static JustDoit.Web.Services.CommonServices.CommonEnum;

    public class StartController : ApiController
    {
        NormalUserServices normalUserServices = new NormalUserServices();
        [Route("start/login")]
        [HttpPost]
        public LoginReturn Login([FromBody] LoginForm loginForm)
        {
            return normalUserServices.Login(loginForm.LoginName, loginForm.Password, loginForm.isRemember);
        }

        [Route("end/logout")]
        [HttpGet]
        public void Logout()
        {
            normalUserServices.Logout();
        }

        [Route("start/register/check/{name}")]
        [HttpGet]
        //repeate:true not repeate:false
        public bool CheckRepeate(string name)
        {
            if (normalUserServices.CheckRepeat(name) == UserOperateStatus.UnexistedUser) return false;
            return true;
        }

        [Route("start/register")]
        [HttpPost]
        public LoginReturn Register(User user)
        {
            if (normalUserServices.Register(user) == UserOperateStatus.NormalSuccess)
            {
                return new LoginReturn{ LoginName = user.LoginName, Id = null, Status = UserOperateStatus.NormalSuccess};
            }
            return new LoginReturn { LoginName = null, Id = null, Status = UserOperateStatus.RegisterFail };
        }
    }
    public class LoginForm
    {
        public string LoginName { get; set; }
        public string Password { get; set; }
        public bool isRemember { get; set; }
    }
}
