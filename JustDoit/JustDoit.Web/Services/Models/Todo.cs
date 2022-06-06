/* ==============================================================
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-01-19    
 * ==============================================================
 */
namespace JustDoit.Web.Services.Models
{
    using SquirrelFramework.Domain.Model;
    using System;
    [Collection("Todo")]
    public class Todo : DomainModel
    {
        public string TodoTopic { get; set; }
        public string TodoItem { get; set; }
        public TodoType TodoType { get; set; }

        public DateTime DateFrom { get; set; }//when type is Idea DateFrom is createDate

        public DateTime? DateTo { get; set; }

        public bool? isAdvanceRemind { get; set; }
        public DateTime? AdvanceRemind { get; set; }
        public string PlanId { get; set; }
        public string UserId { get; set; }
        public bool? isComplete { get; set; }
    }
    public enum TodoType
    {
        IdeaTodo = 0,
        FreeTimeTodo = 1,
        NoFreeTimeTodo = 2
    }
}