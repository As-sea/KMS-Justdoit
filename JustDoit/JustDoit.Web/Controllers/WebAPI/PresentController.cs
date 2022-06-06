/* ==============================================================
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-01-19    
 * ==============================================================
 */
namespace JustDoit.Web.Controllers.WebAPI
{
    using JustDoit.Web.Services.CurrentManagement;
    using JustDoit.Web.Services.Models;
    using System;
    using System.Collections.Generic;
    using System.Web.Http;
    using static JustDoit.Web.Services.CommonServices.CommonEnum;

    public class PresentController : ApiController
    {
        TodoServices todoServices = new TodoServices();
        HabitServices habitServices = new HabitServices();

        [Route("present/todos/create")]
        [HttpPost]
        public OperateStatus CreateTodo([FromBody] Todo todo)
        {
            var status = todoServices.CreateTodo(todo);
            return status;
        }


        [Route("present/todos/change")]
        [HttpPost]
        public OperateStatus ChangeTodo([FromBody] Todo todo)
        {
            var status = todoServices.UpdateTodo(todo);
            return status;
        }


        [Route("present/todos/remove/{id}")]
        [HttpGet]
        public OperateStatus RemoveTodo(string id)
        {
            var status = todoServices.DeleteTodo(id);
            return status;
        }


        [Route("present/todos/listbyplan/{planid}")]
        [HttpGet]
        public IEnumerable<Todo> ShowTodoByPlan(string planid)
        {
            return todoServices.ListTodoByPlan(planid);
        }

        [Route("present/todos/listbyType/{type}")]
        [HttpGet]
        public IEnumerable<Todo> ShowTodoByType(int type)
        {
            TodoType todoType;
            if (type == 1) todoType = TodoType.FreeTimeTodo;
            else if (type == 2) todoType = TodoType.NoFreeTimeTodo;
            else todoType = TodoType.IdeaTodo;
            return todoServices.ListTodoByType(todoType);
        }

        [Route("present/todos/listUnlessIdea")]
        [HttpGet]
        public IEnumerable<Todo> showUnlessIdea()
        {
            return todoServices.ListTodoUnlessIdea();
        }

        [Route("present/todos/listbyadvance")]
        [HttpGet]
        public IEnumerable<Todo> ShowTodoInAdvance()
        {
            return todoServices.ListTodoByAdvance(DateTime.Today, DateTime.Today.AddDays(2));
        }

        [Route("present/todos/listbydate/{date}")]
        [HttpGet]
        public IEnumerable<Todo> ShoInTodoList(string date)
        {
            DateTime dateTime = Convert.ToDateTime(date);
            return todoServices.ListTodoByDate(dateTime);
        }

        [Route("present/todos/listintime/{date}")]
        [HttpGet]
        public IEnumerable<Todo> ShowInNofreeList(string date)
        {
            DateTime dateTime = Convert.ToDateTime(date);
            return todoServices.ListNofreeTodoSortByTime(dateTime);
        }


        [Route("present/todos/complete/{id}")]
        [HttpGet]
        public OperateStatus Coplete(string id)
        {
            return todoServices.CompleteTodo(id);
        }



        [Route("present/habits/create")]
        [HttpPost]
        public OperateStatus CreateHabit([FromBody] Habit habit)
        {
            var status = habitServices.CreateHabit(habit);
            return status;
        }


        [Route("present/habits/change/{oldName}")]
        [HttpPost]
        public OperateStatus ChangeHabit(string oldName, [FromBody] Habit habit)
        {
            var status = habitServices.ChangeHabitNameOrItem(oldName, habit);
            return status;
        }


        [Route("present/habits/remove/{habitName}")]
        [HttpGet]
        public OperateStatus DeleteHabit(string habitName)
        {
            var status = habitServices.DeleteHabit(habitName);
            return status;
        }


        [Route("present/habits/changestatus/{habitName}")]
        [HttpGet]
        public OperateStatus ChangeHabit(string habitName)
        {
            var status = habitServices.ChangeHabitStatus(habitName);
            return status;
        }


        [Route("present/habits/complete/{habitName}")]
        [HttpGet]
        public OperateStatus CompleteHabit(string habitName)
        {
            var status = habitServices.CompleteHabit(habitName);
            return status;
        }


        [Route("present/habits/habitlist")]
        [HttpGet]
        public IEnumerable<Habit> LisyHabit()
        {
            return habitServices.ListHabits();
        }


        [Route("present/habits/listinhome")]
        [HttpGet]
        public IEnumerable<Habit> ListOpenHabit()
        {
            return habitServices.ListOpenHabits();
        }
    }
}
