/* ==============================================================
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-01-19    
 * ==============================================================
 */
namespace JustDoit.Web.Services.DreamManagement
{
    using JustDoit.Web.Repository;
    using JustDoit.Web.Services.CommonServices.Temp;
    using JustDoit.Web.Services.Models;
    using JustDoit.Web.Services.PlanManagement;
    using JustDoit.Web.Services.UserManagement;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using static JustDoit.Web.Services.CommonServices.CommonEnum;

    public class DreamServices
    {
        UserRepository userOperate = new UserRepository();
        DreamRepository dreamOperate = new DreamRepository();
        PlanRepository planOperate = new PlanRepository();

        string id;
        public DreamServices() => this.id = new TempServices().getCookie();// "622ef70507c04472fc4f659f";// new UserBaseService().GetCookieValue();//"62811a3e07c0446c08e55bf7"; 

        public OperateStatus CreateDream(Dream dream)
        {
            try
            {
                User theUser = userOperate.Get(id);
                if (dream.DreamType != DreamType.Dream)
                {
                    if (dream.DreamType == DreamType.Life)
                    {
                        if (dreamOperate.GetCount(x => x.UserId == id && x.DreamType == DreamType.Life) >= 2) return OperateStatus.LifeLimited;
                    }
                    else if (dream.DreamType == DreamType.Career)
                    {
                        if (dreamOperate.GetCount(x => x.UserId == id && x.DreamType == DreamType.Career) >= 2) return OperateStatus.CareerLimited;
                    }
                    else
                        return OperateStatus.UnknowError;
                }
                if (string.IsNullOrWhiteSpace(dream.DreamTopic)) return OperateStatus.RequiredNotHaveValue;
                if (string.IsNullOrWhiteSpace(dream.UserId)) dream.UserId = id;
                if (dream.CreateDate == DateTime.MinValue) { dream.CreateDate = DateTime.Now; }
                if (dream.SkillNames != null && dream.SkillNames.Count > 0)
                {
                    try
                    {
                        foreach (var skill in dream.SkillNames)
                        {
                            if (theUser.Skills.FindAll(x => x.SkillName == skill).Count > 0)
                                theUser.Skills.Find(x => x.SkillName == skill).OccurrenceFrequency++;
                            else return OperateStatus.NoSkillInUser;
                        }
                        if (userOperate.Update(theUser) <= 0) { return OperateStatus.UpdateUserHasException; }
                    }
                    catch (Exception ex)
                    {
                        return OperateStatus.SkillHasException;
                        throw new Exception("CreateDream have ex : {0}", ex);
                    }
                }
                dreamOperate.Add(dream);
                return OperateStatus.Success;
            }
            catch (Exception ex)
            {
                throw new Exception("CreateDream have ex : {0}", ex);
            }
        }

        public OperateStatus DeleteDream(string dreamId)
        {
            try
            {
                var planService = new PlanServices();
                var planList = planService.ListPlanByDream(dreamId);
                if (planList != null)
                {
                    foreach (var plan in planList)
                    {
                        plan.DreamId = null;
                        if (planOperate.Update(plan) <= 0) return OperateStatus.UpdateDreamIdInPlanHasError;
                    }
                }
                var skillService = new SkillServices();
                var skillList = skillService.ListSkillByDream(dreamId);
                if (skillList != null)
                {
                    var userItem = userOperate.Get(id);
                    foreach (var skill in skillList)
                    {
                        if (skill != null)
                            userItem.Skills.Find(x => x.SkillName == skill.SkillName).OccurrenceFrequency--;
                    }
                    if (userOperate.Update(userItem) <= 0) return OperateStatus.UpdateUserHasException;
                }
                if (dreamOperate.Delete(dreamId) >= 0) return OperateStatus.Success;
                return OperateStatus.Fial;

            }
            catch (Exception ex)
            {
                throw new Exception("DeleteDream have ex : {0}", ex);
            }

        }

        public OperateStatus UpdateDream(Dream dream)
        {
            try
            {
                var theUser = userOperate.Get(id);
                var theDream = dreamOperate.Get(dream.Id);
                theDream.CreateDate = DateTime.Now;
                if (!string.IsNullOrWhiteSpace(dream.DreamTopic)) theDream.DreamTopic = dream.DreamTopic;
                theDream.DreamItem = dream.DreamItem;
                if (dream.DreamType != DreamType.Dream && dream.DreamType != theDream.DreamType)
                {
                    if (dream.DreamType == DreamType.Life)
                    {
                        if (dreamOperate.GetCount(x => x.UserId == id && x.DreamType == DreamType.Life) >= 2) return OperateStatus.LifeLimited;
                    }
                    else if (dream.DreamType == DreamType.Career)
                    {
                        if (dreamOperate.GetCount(x => x.UserId == id && x.DreamType == DreamType.Career) >= 2) return OperateStatus.CareerLimited;
                    }
                    else
                        return OperateStatus.UnknowError;
                }
                theDream.DreamType = dream.DreamType;
                theDream.DifficultyLevel = dream.DifficultyLevel;
                theDream.InfluenceLevel = dream.InfluenceLevel;
                if (dream.SkillNames != null)
                {
                    var deleteSkill = theDream.SkillNames.Except(dream.SkillNames).ToList();
                    var addSkill = dream.SkillNames.Except(theDream.SkillNames).ToList();
                    if (deleteSkill.Count > 0)
                    {
                        foreach (var skill in deleteSkill)
                        {
                            theUser.Skills.Find(x => x.SkillName == skill).OccurrenceFrequency--;
                        }
                        userOperate.Update(theUser);
                    }
                    if (addSkill.Count > 0)
                    {
                        foreach (var skill in addSkill)
                        {
                            theUser.Skills.Find(x => x.SkillName == skill).OccurrenceFrequency++;
                        }
                        userOperate.Update(theUser);
                    }
                }
                theDream.SkillNames = dream.SkillNames;
                if (dreamOperate.Update(theDream) > 0) return OperateStatus.Success;
                return OperateStatus.Fial;

            }
            catch (Exception ex)
            {
                throw new Exception("UpdateDream have ex : {0}", ex);
            }

        }

        public List<Dream> ListDream()
        {
            try
            {
                List<Dream> dreams = new List<Dream>();
                foreach (var dream in dreamOperate.GetAll(x => x.UserId == id))
                {
                    dreams.Add(dream);
                }
                if (dreams.Count > 0) return dreams;
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("ListDream have ex : {0}", ex);
            }
        }

        public Dream SearchDreamByPlan(string PlanId)
        {
            try
            {
                var dreamId = planOperate.Get(PlanId).DreamId;
                if (dreamId == null) return null;
                return dreamOperate.Get(dreamId);
            }
            catch (Exception ex)
            {
                throw new Exception("Search by Plan have ex : {0}", ex);
            }
        }

        public Dream SearchDreamByPeriodic(string PeriodicId)
        {
            try
            {
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("Search by Periodic have ex : {0}", ex);
            }
        }
        public List<Dream> ListDreamByOneSkill(string skillName)
        {
            try
            {
                var dreamList = new List<Dream>();
                foreach (var dream in dreamOperate.GetAll(x => x.UserId == id))
                {
                    if (dream.SkillNames != null)
                        if (dream.SkillNames.Contains(skillName))
                            dreamList.Add(dream);
                }
                if (dreamList.Count > 0) return dreamList;
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("List Dream by skill have ex : {0}", ex);
            }

        }

        public List<Dream> SearchDreamsByTopic(string dreamTopic)
        {
            try
            {
                List<Dream> dreams = new List<Dream>();
                foreach (var dream in dreamOperate.GetAll(x => x.UserId == id && x.DreamTopic == dreamTopic))
                {
                    dreams.Add(dream);
                }
                return dreams;
            }
            catch (Exception ex)
            {
                throw new Exception("Search single Dream have ex : {0}", ex);
            }
        }

        public List<Dream> ListDreamByType(DreamType dreamType)
        {
            try
            {
                var dreamList = new List<Dream>();
                foreach (var dream in dreamOperate.GetAll(x => x.UserId == id && x.DreamType == dreamType))
                {
                    dreamList.Add(dream);
                }
                if (dreamList.Count > 0) return dreamList;
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("List Dream by Type have ex : {0}", ex);
            }
        }

        public string FindDreamName(string DreamId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(DreamId)) return null;
                var dream = dreamOperate.Get(DreamId);
                if (dream == null) return null;
                else return dream.DreamTopic;
            }
            catch (Exception ex)
            {
                throw new Exception("List Dream by Type have ex : {0}", ex);
            }
        }
    }

}