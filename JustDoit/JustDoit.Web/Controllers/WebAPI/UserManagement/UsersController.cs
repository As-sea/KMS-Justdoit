/* ==============================================================
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-01-19    
 * ==============================================================
 */
namespace JustDoit.Web.Controllers.WebAPI.UserManagement
{
    using JustDoit.Web.Services.UserManagement;
    using Swashbuckle.Swagger;
    using System;
    using System.Collections.Generic;
    using System.Web;
    using System.Web.Http;

    public class UsersController : ApiController
    {
        NormalUserServices normalUserServices = new NormalUserServices();
        UserBaseService userBaseService = new UserBaseService();
        // GET: api/Users
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Users/5
        public string Get(string id)
        {

            // normalUserServices.Login("SystemAccount", "qqq", false);

            //  HttpContext.Current.Response.AppendCookie(cookie); //保存
            //  return "value";
            userBaseService.RemoveCookie();
            return userBaseService.GetCookieValue();
        }

        // POST: api/Users
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Users/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Users/5
        public void Delete(int id)
        {
        }

        //[Route("user/super/create")]
        //[HttpGet]
        //public UserOperateStatus CreateSuper()
        //{
        //   return normalUserServices.CreateSuper("SystemAccount", "1qaz2wsxE");
        //}


    }
}
