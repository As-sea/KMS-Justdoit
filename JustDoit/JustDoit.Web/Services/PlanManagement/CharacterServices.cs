/* ==============================================================
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-01-19    
 * ==============================================================
 */
namespace JustDoit.Web.Services.PlanManagement
{
    using JustDoit.Web.Repository;
    using JustDoit.Web.Services.CommonServices.Temp;
    using JustDoit.Web.Services.Models;
    using JustDoit.Web.Services.UserManagement;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using static JustDoit.Web.Services.CommonServices.CommonEnum;

    public class CharacterServices
    {
        UserRepository userOperate = new UserRepository();
        PlanRepository planOperate = new PlanRepository();
        string id;
        public CharacterServices() => this.id = new TempServices().getCookie();// "622ef70507c04472fc4f659f";// "62811a3e07c0446c08e55bf7"; // new UserBaseService().GetCookieValue();
        public List<Character> ListCharacter()
        {
            try
            {
                return userOperate.Get(id).Characters;
            }
            catch (Exception ex)
            {
                throw new Exception("ListCharacter have ex : {0}", ex);
            }

        }
        public OperateStatus AddCharacter(string peopleName, string peopleDetials = null)
        {
            try
            {
                var userItem = userOperate.Get(id);
                if (ListCharacter() != null)
                {
                    if (ListCharacter().Find(x => x.CharecterName == peopleName.TrimEnd()) != null) return OperateStatus.RepeatCharacter;
                }
                else
                {
                    userItem.Characters = new List<Character>();
                }
                userItem.Characters.Add(new Character { CharecterName = peopleName.TrimEnd(), OccurrenceFrequency = 0, PeopleDetails = peopleDetials });
                if (userOperate.Update(userItem) > 0) return OperateStatus.Success;
                return OperateStatus.Fial;
            }
            catch (Exception ex)
            {
                throw new Exception("AddCharacter have ex : {0}", ex);
            }

        }

        public OperateStatus DeleteCharacter(string peopleName)
        {
            try
            {
                var planService = new PlanServices();
                var planList = planService.ListPlanByCharacter(peopleName);
                if (planList != null)
                {
                    foreach (var plan in planList)
                    {
                        plan.CharacterNames.Remove(plan.CharacterNames.Where(x => x == peopleName).FirstOrDefault());
                        planOperate.Update(plan);
                    }
                }
                var userItem = userOperate.Get(id);
                if (userItem.Characters != null)
                {
                    if (userItem.Characters.Remove(userItem.Characters.Where(x => x.CharecterName == peopleName).FirstOrDefault()))
                        if (userOperate.Update(userItem) > 0)
                            return OperateStatus.Success;
                }
                return OperateStatus.Fial;
            }
            catch (Exception ex)
            {
                throw new Exception("DeleteCharacter have ex : {0}", ex);
            }

        }
        public Character SearchSingleCharacterByName(string peopleName)
        {
            try
            {
                if (ListCharacter() == null) return null;
                return ListCharacter().Find(x => x.CharecterName == peopleName);
            }
            catch (Exception ex)
            {
                throw new Exception("Search single Character have ex : {0}", ex);
            }
        }
        public List<Character> ListCharacterSortByFrequency()
        {
            try { return null; }
            catch (Exception ex)
            {
                throw new Exception("Sort by Frequency Character have ex : {0}", ex);
            }

        }
        public List<Character> ListCharacterByPlan(string planId)
        {
            try
            {
                var peopleList = planOperate.Get(planId).CharacterNames;
                if (peopleList == null || peopleList.Count < 0) return null;
                var charactersList = new List<Character>();
                foreach (var people in peopleList)
                {
                    var peopleItem = userOperate.Get(id).Characters.Where(x => x.CharecterName == people).FirstOrDefault();
                    charactersList.Add(peopleItem);
                    //peopleList.Add(userOperate.Get(id).Characters.Where(x => x.CharecterName == people).FirstOrDefault().CharecterName);
                }
                if (charactersList.Count > 0) return charactersList;
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("ListCharacter by plan have ex : {0}", ex);
            }

        }
        public OperateStatus UpdateCharacter(string oldName, string newName, string peopleDetials)
        {
            try
            {
                var planService = new PlanServices();
                var planList = planService.ListPlanByCharacter(oldName);
                if (planList != null)
                {
                    foreach (var plan in planList)
                    {
                        if (plan.CharacterNames.Remove(plan.CharacterNames.Where(x => x == oldName).FirstOrDefault()))
                        {
                            plan.CharacterNames.Add(newName.TrimEnd());
                        }
                        planOperate.Update(plan);
                    }
                }
                var useItem = userOperate.Get(id);
                if (useItem.Characters != null || useItem.Characters.Count > 0)
                {
                    useItem.Characters.Where(x => x.CharecterName == oldName).FirstOrDefault().PeopleDetails = peopleDetials;
                    useItem.Characters.Where(x => x.CharecterName == oldName).FirstOrDefault().CharecterName = newName.TrimEnd();
                    if (userOperate.Update(useItem) > 0)
                        return OperateStatus.Success;
                }
                return OperateStatus.Fial;
            }
            catch (Exception ex)
            {
                throw new Exception("UpdateCharacter have ex : {0}", ex);
            }
        }
    }
}