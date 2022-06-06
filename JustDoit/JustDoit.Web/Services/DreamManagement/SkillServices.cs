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
    using JustDoit.Web.Services.UserManagement;
    using System;
    using System.Collections.Generic;
    using static JustDoit.Web.Services.CommonServices.CommonEnum;

    public class SkillServices
    {
        UserRepository userOperate = new UserRepository();
        DreamRepository dreamOperate = new DreamRepository();
        string id;
        public SkillServices() => this.id = new TempServices().getCookie();//"622ef70507c04472fc4f659f";//"62811a3e07c0446c08e55bf7"; //new UserBaseService().GetCookieValue();
        public OperateStatus AddSkill(string skillName)
        {
            try
            {
                User theUser = userOperate.Get(id);
                if (theUser.Skills != null)
                {
                    if (theUser.Skills.FindAll(x => x.SkillName == skillName.TrimEnd()).Count != 0) return OperateStatus.RepeatSkill;
                }
                else
                {
                    theUser.Skills = new List<Skill>();
                }
                Skill skill = new Skill { SkillName = skillName.TrimEnd(), OccurrenceFrequency = 0 };
                theUser.Skills.Add(skill);
                if (userOperate.Update(theUser) > 0) return OperateStatus.Success;
                else return OperateStatus.Fial;
            }
            catch (Exception ex)
            {
                throw new Exception("addSkill have ex : {0}", ex);
            }
        }

        public List<Skill> ListSkills()
        {
            try
            {
                User theUser = userOperate.Get(id);
                return theUser.Skills;
            }
            catch (Exception ex)
            {
                throw new Exception("ListSkills have ex : {0}", ex);
            }

        }

        public OperateStatus DeleteSkill(string skillName)
        {
            try
            {
                foreach (var dream in dreamOperate.GetAll(x => x.UserId == id))
                {
                    if (dream.SkillNames != null)
                    {
                        int? index = dream.SkillNames.FindIndex(x => x == skillName);
                        if (index != null && index >= 0)
                        {
                            dream.SkillNames.RemoveAt((int)index);
                        }
                        dreamOperate.Update(dream);
                    }
                }
                var user = userOperate.Get(id);
                if (user.Skills != null)
                {
                    if (user.Skills.RemoveAll(x => x.SkillName == skillName) > 0)
                    {
                        if (userOperate.Update(user) > 0)
                            return OperateStatus.Success;
                    }
                }
                return OperateStatus.Fial;
            }
            catch (Exception ex)
            {
                throw new Exception("DeleteSkill have ex : {0}", ex);
            }
        }

        public List<Skill> ListSkillByDream(string dreamId)
        {
            try
            {
                var skillsList = dreamOperate.Get(dreamId).SkillNames;
                if (skillsList == null) return null;
                List<Skill> skillList = new List<Skill>();
                var userSkills = userOperate.Get(id).Skills;
                foreach (var skill in skillsList)
                {
                    skillList.Add(userSkills.Find(x => x.SkillName == skill));
                }
                if (skillList.Count > 0) return skillList;
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("List Skill by Dream have ex : {0}", ex);
            }
        }

        public Skill SearchSingleSkillByskillName(string skillName)
        {
            try
            {
                return userOperate.Get(id).Skills.Find(x => x.SkillName == skillName);
            }
            catch (Exception ex)
            {
                throw new Exception("Search single Skill have ex : {0}", ex);
            }
        }
    }
}