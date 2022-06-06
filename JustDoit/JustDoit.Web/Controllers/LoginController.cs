namespace JustDoit.Web.Controllers
{
    #region using directives

    using System;
    using System.Collections.Generic;
    using System.Web;
    using System.Web.Mvc;
    using System.Web.Security;
    using JustDoit.Web.Models;
    using JustDoit.Web.Repository;
    using JustDoit.Web.Services.DreamManagement;
    using JustDoit.Web.Services.PlanManagement;
    using JustDoit.Web.Services.Models;
    using Newtonsoft.Json;
    using JustDoit.Web.Services.CurrentManagement;

    #endregion
    [AllowAnonymous]
    public class LoginController : ControllerBase
    {
        public ActionResult Index()
        {
            //List<string> imageList = new List<string>();
            //imageList.Add("happy");
            //imageList.Add("rich");
            //imageList.Add("positve");
            //var x = new UserRepository();
            //x.Add(new User { LoginName = "123" });
            //var skills = new List<Skill>();
            //skills.Add(new Skill { SkillName = "English", OccurrenceFrequency = 5 });
            //skills.Add(new Skill { SkillName = "EQ", OccurrenceFrequency = 10 });
            //var character = new List<Character>();
            //character.Add(new Character { CharecterName = "Mr.Three", OccurrenceFrequency = 2, PeopleDetails = null });
            ////试试Update
            //var user=x.Get("622ef70507c04472fc4f659f");
            //var user2 = x.Get("622ef19907c0446f38de0d83");
            //user.ImagePositives = imageList;
            //user.Skills = skills;
            //user2.Skills = skills;
            //user.LoginName = "testt";
            //user2.LoginName = "Grace";
            //var a=x.Update(user);
            //var b = x.Update(user2);

            //var testSkill = new SkillServices();
            //            var a = testSkill.AddSkill("622ef70507c04472fc4f659f", "test1");
            //            //var result1 = testSkill.DeleteSkill("622ef70507c04472fc4f659f", "EQ");
            //            //var result = testSkill.ListSkillByDream("622ef70507c04472fc4f659f", "623355c707c044352c6780c9");

            //   var serviceTest = new DreamServices("622ef70507c04472fc4f659f");

            //Dream dream = new Dream();
            ////var a = serviceTest.ListDreamByType("622ef70507c04472fc4f659f", DreamType.Life);
            ////var b = serviceTest.ListDreamByType("622ef70507c04472fc4f659f", DreamType.Dream);
            ////var c = serviceTest.ListDreamByOneSkill("622ef70507c04472fc4f659f", "EQ");
            ////var d = serviceTest.ListDreamByOneSkill("622ef70507c04472fc4f659f", "nothing");
            //dream.DreamTopic = "test for all of the DreamServices, now update";
            //dream.DreamItem = "Test the Search dream ,When has the same Topic";
            //List<string> list = new List<string>();
            //dream.SkillNames = list;
            ////dream.SkillNames.Remove("test1");
            //dream.SkillNames.Add("test3");
            //dream.SkillNames.Add("rich");
            //dream.SkillNames.Add("test2");
            //dream.SkillNames.Add("EQ");
            //dream.InfluenceLevel = 2;
            //dream.DifficultyLevel = 4;
            //dream.DreamType = DreamType.Life;
            // var result=serviceTest.CreateDream("622ef70507c04472fc4f659f", dream);

            //var resultList = serviceTest.SearchDreamsByTopic("622ef70507c04472fc4f659f", "test for all of the DreamServices, now update");
            // var testdream = new DreamServices();
            //   var result = testdream.CreateDream("622ef70507c04472fc4f659f", dream);
            //var skillTest = new SkillServices("622ef70507c04472fc4f659f");
            // var b = skillTest.DeleteSkill("EQ");

            //var reault = serviceTest.ListDream("622ef70507c04472fc4f659f");

            //var a = new ImageServices("622ef70507c04472fc4f659f");
            // var imageList = a.DeleteImage("rich");
            //a.AddImage("6234449707c0446bcc92f1ba", "nothing");

            //var b = new HabitServices("622ef70507c04472fc4f659f");

            //var c = b.ChangeHabitStatus("testagain");

           // var a = new PlanServices("622ef70507c04472fc4f659f");
            //var plan = new Plan();
            //plan.PlanTopic = "OMG disteater , I know what was that!!!";
            //plan.DateFrom = Convert.ToDateTime("2022-2-1");
            //plan.DateTo = Convert.ToDateTime("2022-6-1");
            ////plan.CharacterNames = new List<string>(); plan.CharacterNames.Add("Mr.Three");
            //plan.ImageAssociateds = new List<ImageAssociated>();
            //plan.ImageAssociateds.Add(new ImageAssociated { ImageName = "happy", Conformity = 8 });
            //plan.ImageAssociateds.Add(new ImageAssociated { ImageName = "positve", Conformity = 10 });

            //var c = a.CreatePlan(plan);
            //var planB = plan;
            //planB.PlanTopic = "planB";
            //planB.DateFrom = Convert.ToDateTime("2022-1-1");
            //planB.Id = null;
            //var e = a.CreatePlan(planB);
            //var planA = plan;
            //planA.PlanTopic = "planA";
            //planA.DateFrom = Convert.ToDateTime("2022-5-29");
            //planA.Id = null;
            //var d = a.CreatePlan(planA);


            //var planC = plan;
            //planC.PlanTopic = "planC";
            //planC.ImageAssociateds = new List<ImageAssociated>();
            //planC.ImageAssociateds.Add(new ImageAssociated { ImageName = "happy", Conformity = 8 });
            //planC.Id = null;


            //var f = a.CreatePlan(planC);
            //var b = a.ListPlan();
            //var b = new CharacterServices("622ef70507c04472fc4f659f");
            //var c = b.DeleteCharacter("Mr.Three");
           
            //var c = a.SearchPlansByTime(Convert.ToDateTime("2022-1-1"), Convert.ToDateTime("2022-3-30"));
            return this.View();
           
        }

        [ValidateAntiForgeryToken]
        public ActionResult Login(UserModel model, string returnUrl)
        {
            if (this.ModelState.IsValid)
            {
                model.Name = model.Name.Trim();

                if (model.Name != "nobody" /* 检查密码等，各种逻辑 */)
                {
                    //FormsAuthentication.SetAuthCookie(model.Name, model.IsRememberMe);
                    SetAuthCookie(model.Name, model.IsRememberMe, model);

                    return this.CheckReturnUrl(returnUrl)
                        ? this.Redirect(returnUrl)
                        : this.RedirectToAction("Index", "Home") as ActionResult;
                }
                this.ModelState.AddModelError("", "请检查你的用户名或密码");
            }
            return this.View("Index", model);
        }

        public ActionResult Logout()
        {
            FormsAuthentication.SignOut();
            return this.RedirectToAction("Index");
        }

        private static void SetAuthCookie(
            string userName,
            bool createPersistentCookie,
            object userData)
        {
            if (!System.Web.HttpContext.Current.Request.IsSecureConnection && FormsAuthentication.RequireSSL)
            {
                throw new HttpException("Connection not secure creating secure cookie");
            }

            // <!> In this way, we will lose the function of cookieless
            //var flag = UseCookieless(
            //    System.Web.HttpContext.Current,
            //    false,
            //    FormsAuthentication.CookieMode);

            FormsAuthentication.Initialize();
            if (userName == null)
            {
                userName = string.Empty;
            }
            var cookiePath = FormsAuthentication.FormsCookiePath;
            var utcNow = DateTime.UtcNow;
            var expirationUtc = utcNow + FormsAuthentication.Timeout;
            var authenticationTicket = new FormsAuthenticationTicket(
                2,
                userName,
                utcNow.ToLocalTime(),
                expirationUtc.ToLocalTime(),
                createPersistentCookie,
                JsonConvert.SerializeObject(userData),
                cookiePath
            );

            var encryptedTicket = FormsAuthentication.Encrypt(authenticationTicket);
            if (string.IsNullOrEmpty(encryptedTicket))
            {
                throw new HttpException("Unable to encrypt cookie ticket");
            }
            var authCookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket)
            {
                HttpOnly = true,
                Path = cookiePath,
                Secure = FormsAuthentication.RequireSSL
            };

            if (FormsAuthentication.CookieDomain != null)
            {
                authCookie.Domain = FormsAuthentication.CookieDomain;
            }
            if (authenticationTicket.IsPersistent)
            {
                authCookie.Expires = authenticationTicket.Expiration;
            }

            System.Web.HttpContext.Current.Response.Cookies.Add(authCookie);
        }

        private bool CheckReturnUrl(string url)
        {
            if (string.IsNullOrWhiteSpace(url))
            {
                return false;
            }
            // Make Sure the return url was not redirect to an external site.
            if (Uri.TryCreate(url, UriKind.Absolute, out var absoluteUri))
            {
                return string.Equals(
                    this.Request.Url.Host,
                    absoluteUri.Host, StringComparison.OrdinalIgnoreCase);
            }
            return url[0] == '/' && (url.Length == 1
                                     || url[1] != '/' && url[1] != '\\')
                   || url.Length > 1 && url[0] == '~' && url[1] == '/';
        }
    }
}