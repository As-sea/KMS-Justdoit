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
    using JustDoit.Web.Services.CurrentManagement;
    using JustDoit.Web.Services.Models;
    using JustDoit.Web.Services.UserManagement;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using static JustDoit.Web.Services.CommonServices.CommonEnum;

    public class PlanServices
    {
        UserRepository userOperate = new UserRepository();
        PlanRepository planOperate = new PlanRepository();
        DreamRepository dreamOperate = new DreamRepository();
        TodoRepository todoOperate = new TodoRepository();
        string id;
        public PlanServices() => this.id = new TempServices().getCookie();// "622ef70507c04472fc4f659f";//"62811a3e07c0446c08e55bf7"; //new UserBaseService().GetCookieValue();

        public OperateStatus CreatePlan(Plan plan)
        {
            try
            {
                var userItem = userOperate.Get(id);
                if (string.IsNullOrWhiteSpace(plan.PlanTopic)) return OperateStatus.TopicRequiredNotHaveValue;
                if (plan.DateFrom == DateTime.MinValue || plan.DateTo == DateTime.MinValue) return OperateStatus.DateNull;
                if (DateTime.Compare(plan.DateFrom, plan.DateTo) >= 0) return OperateStatus.DateIsWrong;
                if (string.IsNullOrWhiteSpace(plan.UserId)) plan.UserId = id;
                if (plan.CharacterNames != null && plan.CharacterNames.Count > 0)
                {
                    try
                    {
                        foreach (var character in plan.CharacterNames)
                        {
                            if (userItem.Characters.Find(x => x.CharecterName == character) == null) return OperateStatus.NoCharacterInUser;
                            userItem.Characters.Find(x => x.CharecterName == character).OccurrenceFrequency++;
                        }
                        if (userOperate.Update(userItem) <= 0) return OperateStatus.UpdateUserHasException;
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("Create Plan--change character have ex : {0}", ex);
                    }
                }
                if (plan.ImageAssociateds != null && plan.ImageAssociateds.Count > 0)
                {
                    foreach (var score in plan.ImageAssociateds)
                    {
                        if (!userItem.ImagePositives.Contains(score.ImageName)) return OperateStatus.NoImageInUser;
                        if (score.Conformity < 0 || score.Conformity > 10) return OperateStatus.ConformityOutOfRange;
                    }
                }
                if (!string.IsNullOrWhiteSpace(plan.DreamId))
                {
                    if (dreamOperate.Get(plan.DreamId).UserId != id)
                        return OperateStatus.UserAndDreamIdNotMatch;
                }
                planOperate.Add(plan);
                return OperateStatus.Success;
            }
            catch (Exception ex)
            {
                throw new Exception("Create Plan have ex : {0}", ex);
            }
        }

        public List<Plan> ListPlan()
        {
            try
            {
                var plans = new List<Plan>();
                foreach (var plan in planOperate.GetAll(x => x.UserId == id))
                {
                    plans.Add(plan);
                }
                if (plans.Count <= 0) return null;
                return plans;
            }
            catch (Exception ex)
            {
                throw new Exception("List Plan have ex : {0}", ex);
            }
        }

        public List<Plan> ListPlanSortByImageScore()
        {
            try
            {
                var plans = ListPlan();
                var sortedPlanList = new List<Plan>();
                sortedPlanList = plans.OrderByDescending(x => x.ImageAssociateds.Sum(y => y.Conformity)).ThenBy(x => x.DateFrom).ToList();

                if (sortedPlanList.Count > 0) return sortedPlanList;
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("List&Sort Plan have ex : {0}", ex);
            }
        }

        public Plan SearchPlanById(string planId)
        {
            try
            {
                return planOperate.Get(x => x.Id == planId);
            }
            catch (Exception ex)
            {
                throw new Exception("Search Plan have ex : {0}", ex);
            }
        }

        public List<Plan> SearchPlansByTime(DateTime dateFrom, DateTime dateTo)
        {
            try
            {
                var plans = new List<Plan>();
                foreach (var plan in planOperate.GetAll(x => x.UserId == id))
                {
                    if (DateTime.Compare(plan.DateFrom, dateTo) <= 0 && DateTime.Compare(plan.DateTo, dateFrom) >= 0)
                    {
                        plans.Add(plan);
                    }
                }
                if (plans.Count <= 0) return null;
                plans = plans.OrderBy(x => x.DateFrom).ToList();
                return plans;
            }
            catch (Exception ex)
            {
                throw new Exception("Search time Plan have ex : {0}", ex);
            }
        }

        public List<Plan> ListPlanByImage(string image)
        {
            try
            {
                var plans = new List<Plan>();
                foreach (var plan in planOperate.GetAll(x => x.UserId == id))
                {
                    if (plan.ImageAssociateds != null)
                    {
                        if (plan.ImageAssociateds.Find(x => x.ImageName == image) != null)
                        {
                            plans.Add(plan);
                        }
                    }
                }
                if (plans.Count <= 0) return null;
                return plans;
            }
            catch (Exception ex)
            {
                throw new Exception("list Plan by image have ex : {0}", ex);
            }
        }

        public List<Plan> ListPlanByCharacter(string characterName)
        {
            try
            {
                var plans = new List<Plan>();
                foreach (var plan in planOperate.GetAll(x => x.UserId == id))
                {
                    if (plan.CharacterNames != null)
                    {
                        if (plan.CharacterNames.Contains(characterName))
                        {
                            plans.Add(plan);
                        }
                    }
                }
                if (plans.Count <= 0) return null;
                return plans;
            }
            catch (Exception ex)
            {
                throw new Exception("list Plan by people have ex : {0}", ex);
            }
        }

        public List<Plan> ListPlanByDream(string dreamId)
        {
            try
            {
                var plans = new List<Plan>();
                foreach (var plan in planOperate.GetAll(x => x.UserId == id))
                {
                    if (plan.DreamId == dreamId) plans.Add(plan);
                }
                if (plans.Count <= 0) return null;
                return plans;
            }
            catch (Exception ex)
            {
                throw new Exception("list Plan by dream have ex : {0}", ex);
            }
        }

        public Plan ListPlanByTodo(string todoId)
        {
            try
            {
                var planId = todoOperate.Get(todoId).PlanId;

                return planOperate.Get(planId);
            }
            catch (Exception ex)
            {
                throw new Exception("list Plan by todo have ex : {0}", ex);
            }
        }

        public OperateStatus DeletePlan(string planId)
        {
            try
            {
                var theUser = userOperate.Get(id);
                var thePlan = planOperate.Get(planId);
                if (thePlan.CharacterNames != null && thePlan.CharacterNames.Count > 0)
                {
                    foreach (var people in thePlan.CharacterNames)
                    {
                        if (people != null)
                            theUser.Characters.Find(x => x.CharecterName == people).OccurrenceFrequency--;
                    }
                    if (userOperate.Update(theUser) <= 0) return OperateStatus.UpdateUserHasException;
                }
                var todoService = new TodoServices();
                var todoList = todoService.ListTodoByPlan(planId);
                if (todoList != null && todoList.Count > 0)
                {
                    foreach (var todo in todoList)
                    {
                        todo.PlanId = null;
                        if (todoOperate.Update(todo) <= 0) return OperateStatus.UpdatePlanIdInTodoHasError;
                    }
                }

                if (planOperate.Delete(planId) >= 0) return OperateStatus.Success;
                return OperateStatus.Fial;
            }
            catch (Exception ex)
            {
                throw new Exception("Delete Plan have ex : {0}", ex);
            }
        }
        public OperateStatus UpdatePlan(Plan plan)
        {
            try
            {
                var theUser = userOperate.Get(id);
                var thePlan = planOperate.Get(plan.Id);
                if (!string.IsNullOrWhiteSpace(plan.PlanTopic)) thePlan.PlanTopic = plan.PlanTopic;
                thePlan.PlanItem = plan.PlanItem;
                if (plan.DateFrom == DateTime.MinValue || plan.DateTo == DateTime.MinValue) return OperateStatus.DateNull;
                if (DateTime.Compare(plan.DateFrom, plan.DateTo) >= 0) return OperateStatus.DateIsWrong;
                else
                {
                    thePlan.DateFrom = plan.DateFrom;
                    thePlan.DateTo = plan.DateTo;
                }
                if (plan.DreamId != null && thePlan.DreamId != plan.DreamId)
                {

                    if (dreamOperate.Get(plan.DreamId) == null || dreamOperate.Get(plan.DreamId).UserId != id) return OperateStatus.UserAndDreamIdNotMatch;
                    else thePlan.DreamId = plan.DreamId;
                }
                if (plan.ImageAssociateds != null && plan.ImageAssociateds.Count > 0)
                    foreach (var imageItem in plan.ImageAssociateds)
                    {
                        if (!theUser.ImagePositives.Contains(imageItem.ImageName)) return OperateStatus.NoImageInUser;
                    }
                thePlan.ImageAssociateds = plan.ImageAssociateds;

                if (plan.CharacterNames != null)
                {
                    var deletePeople = new List<string>();
                    var addPeople = new List<string>();
                    if (thePlan.CharacterNames != null)
                    {
                        deletePeople = thePlan.CharacterNames.Except(plan.CharacterNames).ToList();
                        addPeople = plan.CharacterNames.Except(thePlan.CharacterNames).ToList();
                    }
                    else
                    {
                        addPeople = plan.CharacterNames.ToList();
                    }

                    if (deletePeople != null && deletePeople.Count > 0)
                    {

                        foreach (var people in deletePeople)
                        {
                            theUser.Characters.Find(x => x.CharecterName == people).OccurrenceFrequency--;
                        }
                        userOperate.Update(theUser);
                    }
                    if (addPeople != null && addPeople.Count > 0)
                    {
                        foreach (var people in addPeople)
                        {
                            theUser.Characters.Find(x => x.CharecterName == people).OccurrenceFrequency++;
                        }
                        userOperate.Update(theUser);
                    }
                }
                thePlan.CharacterNames = plan.CharacterNames;
                if (planOperate.Update(thePlan) > 0) return OperateStatus.Success;
                return OperateStatus.Fial;
            }
            catch (Exception ex)
            {
                throw new Exception("Update Plan have ex : {0}", ex);
            }
        }
    }
}

