/* ==============================================================
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-01-19    
 * ==============================================================
 */
namespace JustDoit.Web.Controllers.WebAPI
{
    using JustDoit.Web.Services.Models;
    using JustDoit.Web.Services.PlanManagement;
    using JustDoit.Web.Services.UserManagement;
    using System;
    using System.Collections.Generic;
    using System.Web.Http;
    using static JustDoit.Web.Services.CommonServices.CommonEnum;

    public class TermController : ApiController
    {

        ImageServices imageServices = new ImageServices();
        CharacterServices characterServices = new CharacterServices();
        PlanServices planServices = new PlanServices();

        [Route("term/images/create/{imageName}")]
        [HttpGet]
        public OperateStatus CreateImage(string imageName)
        {
            var status = imageServices.AddImage(imageName);
            return status;
        }


        [Route("term/images/change/{oldName}")]
        [HttpPost]
        public OperateStatus UpdateImage(string oldName, [FromBody] string newName)
        {
            var status = imageServices.UpdateImage(oldName, newName);
            return status;
        }


        [Route("term/images/remove/{imageName}")]
        [HttpGet]
        public OperateStatus RemoveImage(string imageName)
        {
            var status = imageServices.DeleteImage(imageName);
            return status;
        }


        [Route("term/images/search/{imageName}")]
        [HttpGet]
        public string SearchIamge(string imageName)
        {
            return imageServices.SearchSingleByImageName(imageName);
        }


        [Route("term/images/list")]
        [HttpGet]
        public IEnumerable<string> ListImage()
        {
            return imageServices.ListImage();
        }


        [Route("term/images/listbyplan/{planId}")]
        [HttpGet]
        public IEnumerable<string> ListByPlan(string planId)
        {
            return imageServices.ListImageByPlan(planId);
        }






        [Route("term/characters/create")]
        [HttpPost]
        public OperateStatus CreatePeople([FromBody] Character character)
        {
            character.OccurrenceFrequency = 0;
            var status = characterServices.AddCharacter(character.CharecterName, character.PeopleDetails);
            return status;
        }


        [Route("term/characters/change/{oldName}")]
        [HttpPost]
        public OperateStatus ChangePeople(string oldName, [FromBody] Character character)
        {
            var status = characterServices.UpdateCharacter(oldName, character.CharecterName, character.PeopleDetails);
            return status;
        }


        [Route("term/characters/remove/{name}")]
        [HttpGet]
        public OperateStatus RemovePeople(string name)
        {
            var status = characterServices.DeleteCharacter(name);
            return status;
        }


        [Route("term/characters/list")]
        [HttpGet]
        public IEnumerable<Character> ListPeople()
        {
            return characterServices.ListCharacter();
        }


        [Route("term/characters/search/{name}")]
        [HttpGet]
        public Character SearchPeople(string name)
        {
            return characterServices.SearchSingleCharacterByName(name);
        }


        [Route("term/characters/listbyplan/{planId}")]
        [HttpGet]
        public IEnumerable<Character> PeopleByPlan(string planId)
        {
            return characterServices.ListCharacterByPlan(planId);
        }







        [Route("term/plans/create")]
        [HttpPost]
        public OperateStatus CreatePlan([FromBody] Plan plan)
        {
            var status = planServices.CreatePlan(plan);
            return status;
        }


        [Route("term/plans/change")]
        [HttpPost]
        public OperateStatus ChangePlan([FromBody] Plan plan)
        {
            var status = planServices.UpdatePlan(plan);
            return status;
        }


        [Route("term/plans/remove/{id}")]
        [HttpGet]
        public OperateStatus RemovePlan(string id)
        {
            var status = planServices.DeletePlan(id);
            return status;
        }


        [Route("term/plans/list")]
        [HttpGet]
        public IEnumerable<Plan> ListPlan()
        {
            return planServices.ListPlan();
        }


        [Route("term/plans/sortbyscorelist")]
        [HttpGet]
        public IEnumerable<Plan> SortListByScore()
        {
            return planServices.ListPlanSortByImageScore();
        }


        [Route("term/plans/listbytime")]
        [HttpPost]
        public IEnumerable<Plan> ListByTime([FromBody] DateFromAndTo dateform)
        {
            DateTime dateFrom = Convert.ToDateTime(dateform.dateFrom);
            DateTime dateTo = Convert.ToDateTime(dateform.dateTo);
            return planServices.SearchPlansByTime(dateFrom, dateTo);
        }


        [Route("term/plans/listbyimage/{imageName}")]
        [HttpGet]
        public IEnumerable<Plan> ListByImage(string imageName)
        {
            return planServices.ListPlanByImage(imageName);
        }


        [Route("term/plans/listbypeople/{characterName}")]
        [HttpGet]
        public IEnumerable<Plan> ListByPeople(string characterName)
        {
            return planServices.ListPlanByCharacter(characterName);
        }


        [Route("term/plans/listbydream/{dreamId}")]
        [HttpGet]
        public IEnumerable<Plan> ListByDream(string dreamId)
        {
            return planServices.ListPlanByDream(dreamId);
        }


        [Route("term/plans/listbytodo/{todoId}")]
        [HttpGet]
        public Plan ListByTodo(string todoId)
        {
            return planServices.ListPlanByTodo(todoId);
        }



    }
    public class DateFromAndTo
    {
        public string dateFrom { get; set; }
        public string dateTo { get; set; }
    }
}
