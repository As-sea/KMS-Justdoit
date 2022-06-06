/* ==============================================================
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-01-19    
 * ==============================================================
 */
namespace JustDoit.Web.Services.CommonServices.Temp
{
    using SquirrelFramework.Domain.Model;
    using SquirrelFramework.Repository;
    using System;
    using System.Linq;

    [Collection("Temp")]
    public class TempCookie : DomainModel
    {
        public string userId { get; set; }
        public DateTime Exper { get; set; }
    }

    public class TempRepository : RepositoryBase<TempCookie> { }

    public class TempServices
    {
        TempRepository tempOperate = new TempRepository();

        public void writeCookie(string userId, DateTime exp)
        {
            long count = tempOperate.GetCount();
            if (count > 0)
            {
                foreach (var cook in tempOperate.GetAll())
                {
                    tempOperate.Delete(cook.Id);
                }
            }

            TempCookie temp = new TempCookie();
            temp.userId = userId;
            temp.Exper = exp;
            tempOperate.Add(temp);
        }

        public string getCookie()
        {
            if (tempOperate.GetCount() == 1)
            {
                var cookie = tempOperate.GetAll().ToList();
                if (cookie[0].Exper.CompareTo(DateTime.Now) > 0)
                    return cookie[0].userId;
            }
            else
            {
                delCookis();
                return "false";
            }
            return "false";
        }

        public void delCookis()
        {
            foreach (var cook in tempOperate.GetAll())
            {
                tempOperate.Delete(cook.Id);
            }
        }
    }
}