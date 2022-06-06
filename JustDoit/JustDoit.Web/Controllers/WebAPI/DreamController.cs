/* ==============================================================
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-01-19    
 * ==============================================================
 */
namespace JustDoit.Web.Controllers.WebAPI
{
    using JustDoit.Web.Services.DreamManagement;
    using JustDoit.Web.Services.Models;
    using System.Collections.Generic;
    using System.Web.Http;
    using static JustDoit.Web.Services.CommonServices.CommonEnum;

    public class DreamController : ApiController
    {
        DreamServices dreamServices = new DreamServices();
        SkillServices skillServices = new SkillServices();



        [Route("dream/skills/create/{skillName}")]
        [HttpGet]
        public OperateStatus CreateSkill(string skillName)
        {
            var status = skillServices.AddSkill(skillName);
            return status;
        }


        [Route("dream/skills/remove/{skillName}")]
        [HttpGet]
        public OperateStatus CreateImage(string skillName)
        {
            var status = skillServices.DeleteSkill(skillName);
            return status;
        }


        [Route("dream/skills/list")]
        [HttpGet]
        public IEnumerable<Skill> ListSkill()
        {
            return skillServices.ListSkills();
        }


        [Route("dream/skills/listbydream/{dreamId}")]
        [HttpGet]
        public IEnumerable<Skill> ListByDream(string dreamId)
        {
            return skillServices.ListSkillByDream(dreamId);
        }


        [Route("dream/skills/search/{skillName}")]
        [HttpGet]
        public Skill SearchSkill(string skillName)
        {
            return skillServices.SearchSingleSkillByskillName(skillName);
        }





        [Route("dream/dreams/create")]
        [HttpPost]
        public OperateStatus CreateDream([FromBody] Dream dream)
        {
            var status = dreamServices.CreateDream(dream);
            return status;
        }


        [Route("dream/dreams/change")]
        [HttpPost]
        public OperateStatus ChangeSkill([FromBody] Dream dream)
        {
            var status = dreamServices.UpdateDream(dream);
            return status;
        }


        [Route("dream/dreams/remove/{id}")]
        [HttpGet]
        public OperateStatus RemoveSkill(string id)
        {
            var status = dreamServices.DeleteDream(id);
            return status;
        }

        [Route("dream/dreams/findName/{id}")]
        [HttpGet]
        public string FindDreamName(string id)
        {
            var name = dreamServices.FindDreamName(id);
            return name;
        }


        [Route("dream/dreams/list")]
        [HttpGet]
        public IEnumerable<Dream> ListDream()
        {
            return dreamServices.ListDream();
        }


        [Route("dream/dreams/findbyplan/{planId}")]
        [HttpGet]
        public Dream ListByPlan(string planId)
        {
            return dreamServices.SearchDreamByPlan(planId);
        }



        [Route("dream/dreams/listbyskill/{skillName}")]
        [HttpGet]
        public IEnumerable<Dream> ListBySkill(string skillName)
        {
            return dreamServices.ListDreamByOneSkill(skillName);
        }



        [Route("dream/dreams/listbytype/{type}")]
        [HttpGet]
        public IEnumerable<Dream> ListByType(int type)
        {
            DreamType dreamType = 0;
            if (type == 1) { dreamType = DreamType.Career; }
            else if (type == 2) { dreamType = DreamType.Life; }
            else { dreamType = DreamType.Dream; }
            return dreamServices.ListDreamByType(dreamType);
        }



        [Route("dream/dreams/find/{topic}")]
        [HttpGet]
        public IEnumerable<Dream> SearchByTopic(string topic)
        {
            return dreamServices.SearchDreamsByTopic(topic);
        }

    }
}
