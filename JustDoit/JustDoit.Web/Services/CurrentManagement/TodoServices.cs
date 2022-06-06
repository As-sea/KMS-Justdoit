/* ==============================================================
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-01-19    
 * ==============================================================
 */
namespace JustDoit.Web.Services.CurrentManagement
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

    public class TodoServices
    {
        UserRepository userOperate = new UserRepository();
        PlanRepository planOperate = new PlanRepository();
        TodoRepository todoOperate = new TodoRepository();
        string id;
        public TodoServices() => this.id = new TempServices().getCookie();// "622ef70507c04472fc4f659f";// "62811a3e07c0446c08e55bf7"; //new UserBaseService().GetCookieValue();

        public OperateStatus CreateTodo(Todo todo)
        {
            try
            {
                todo.Id = null;
                var userItem = userOperate.Get(id);
                if (string.IsNullOrWhiteSpace(todo.TodoTopic)) return OperateStatus.TopicIsNull;
                if (string.IsNullOrWhiteSpace(todo.UserId)) todo.UserId = id;
                if (todo.TodoType == TodoType.IdeaTodo)
                {
                    todo.DateFrom = DateTime.Now;
                    todo.DateTo = null;
                    todo.isAdvanceRemind = null;
                    todo.AdvanceRemind = null;
                    todo.isComplete = null;
                }
                else if (todo.TodoType == TodoType.FreeTimeTodo)
                {
                    if (todo.DateFrom == null || todo.DateFrom == DateTime.MinValue) return OperateStatus.DateFormatIsWrong;
                    if (todo.DateTo == null || todo.DateTo == DateTime.MinValue) return OperateStatus.DateFormatIsWrong;
                    todo.isComplete = false;
                    if (todo.isAdvanceRemind != null && todo.isAdvanceRemind == true)
                    {
                        if (todo.AdvanceRemind == null || todo.AdvanceRemind == DateTime.MinValue) return OperateStatus.RemindValueIsWrong;
                    }
                    else
                    {
                        todo.AdvanceRemind = null;
                    }
                    if (!string.IsNullOrWhiteSpace(todo.PlanId))
                    {
                        var planService = new PlanServices();
                        if (planService.ListPlan().Find(x => x.Id == todo.PlanId) == null) return OperateStatus.PlanIdNotFound;
                    }
                }
                else if (todo.TodoType == TodoType.NoFreeTimeTodo)
                {
                    if (todo.DateFrom == null || todo.DateFrom == DateTime.MinValue) return OperateStatus.DateFormatIsWrong;
                    if (todo.DateTo == null || todo.DateTo == DateTime.MinValue) return OperateStatus.DateFormatIsWrong;
                    if (todo.isAdvanceRemind != null && todo.isAdvanceRemind == true)
                    {
                        if (todo.AdvanceRemind == null || todo.AdvanceRemind == DateTime.MinValue) return OperateStatus.RemindValueIsWrong;
                    }
                    else
                    {
                        todo.AdvanceRemind = null;
                    }
                    if (!string.IsNullOrWhiteSpace(todo.PlanId))
                    {
                        var planService = new PlanServices();
                        if (planService.ListPlan().Find(x => x.Id == todo.PlanId) == null) return OperateStatus.PlanIdNotFound;
                    }
                    todo.isComplete = false;
                }
                else
                {
                    return OperateStatus.TodoTypeHasUnknowWrong;
                }
                todoOperate.Add(todo);
                return OperateStatus.Success;
            }
            catch (Exception ex)
            {
                throw new Exception($"create todo have ex : {ex}");
            }

        }

        public List<Todo> ListTodo()
        {
            try
            {
                var todoList = new List<Todo>();
                foreach (var todo in todoOperate.GetAll(x => x.UserId == id))
                {
                    todoList.Add(todo);
                }
                if (todoList.Count <= 0) return null;
                return todoList;
            }
            catch (Exception ex)
            {
                throw new Exception("list todo have ex : {0}", ex);
            }
        }

        public List<Todo> ListTodoByPlan(string planId)
        {
            try
            {
                var todoList = new List<Todo>();
                foreach (var todo in todoOperate.GetAll(x => x.PlanId == planId && x.UserId == id))
                {
                    todoList.Add(todo);
                }
                if (todoList.Count > 0) return todoList;
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("list todo by plan have ex : {0}", ex);
            }
        }

        public OperateStatus UpdateTodo(Todo todo)
        {
            try
            {
                var theTodo = todoOperate.Get(todo.Id);
                var theUser = userOperate.Get(id);
                if (!string.IsNullOrWhiteSpace(todo.TodoTopic)) theTodo.TodoTopic = todo.TodoTopic;
                theTodo.TodoItem = todo.TodoItem;
                if (!(theTodo.TodoType == todo.TodoType && todo.TodoType == TodoType.IdeaTodo))
                {
                    if (todo.TodoType == TodoType.FreeTimeTodo)
                    {
                        if (todo.DateFrom == null || todo.DateFrom == DateTime.MinValue) return OperateStatus.DateFormatIsWrong;
                        if (todo.DateTo == null || todo.DateTo == DateTime.MinValue) return OperateStatus.DateFormatIsWrong;
                        if (todo.isAdvanceRemind != null && todo.isAdvanceRemind == true)
                        {
                            if (todo.AdvanceRemind == null || todo.AdvanceRemind == DateTime.MinValue) return OperateStatus.RemindValueIsWrong;
                        }
                        else
                        {
                            todo.AdvanceRemind = null;
                        }
                        if (!string.IsNullOrWhiteSpace(todo.PlanId))
                        {
                            var planService = new PlanServices();
                            if (planService.ListPlan().Find(x => x.Id == todo.PlanId) == null) return OperateStatus.PlanIdNotFound;
                        }
                        theTodo.TodoType = todo.TodoType;
                        theTodo.DateFrom = todo.DateFrom;
                        theTodo.DateTo = todo.DateTo;
                        theTodo.isAdvanceRemind = todo.isAdvanceRemind;
                        theTodo.AdvanceRemind = todo.AdvanceRemind;
                        theTodo.PlanId = todo.PlanId;
                        theTodo.isComplete = todo.isComplete;
                    }
                    else if (todo.TodoType == TodoType.NoFreeTimeTodo)
                    {
                        if (todo.DateFrom == null || todo.DateFrom == DateTime.MinValue) return OperateStatus.DateFormatIsWrong;
                        if (todo.DateTo == null || todo.DateTo == DateTime.MinValue) return OperateStatus.DateFormatIsWrong;
                        if (todo.isAdvanceRemind != null && todo.isAdvanceRemind == true)
                        {
                            if (todo.AdvanceRemind == null || todo.AdvanceRemind == DateTime.MinValue) return OperateStatus.RemindValueIsWrong;
                        }
                        else
                        {
                            todo.AdvanceRemind = null;
                        }
                        if (!string.IsNullOrWhiteSpace(todo.PlanId))
                        {
                            var planService = new PlanServices();
                            if (planService.ListPlan().Find(x => x.Id == todo.PlanId) == null) return OperateStatus.PlanIdNotFound;
                        }
                        theTodo.TodoType = todo.TodoType;
                        theTodo.DateFrom = todo.DateFrom;
                        theTodo.DateTo = todo.DateTo;
                        theTodo.isAdvanceRemind = todo.isAdvanceRemind;
                        theTodo.AdvanceRemind = todo.AdvanceRemind;
                        theTodo.PlanId = todo.PlanId;
                        theTodo.isComplete = todo.isComplete;
                    }
                    else
                    {
                        return OperateStatus.TodoTypeHasUnknowWrong;
                    }
                }
                if (todoOperate.Update(theTodo) > 0)
                    return OperateStatus.Success;
                return OperateStatus.Fial;
            }
            catch (Exception ex)
            {
                throw new Exception("update todo have ex : {0}", ex);
            }
        }

        public OperateStatus DeleteTodo(string todoId)
        {
            try
            {
                if (todoOperate.Delete(todoId) > 0) return OperateStatus.Success;
                return OperateStatus.Fial;
            }
            catch (Exception ex)
            {
                throw new Exception("delete todo have ex : {0}", ex);
            }
        }

        public Todo SearchTodoById(string todoId)
        {
            try
            {
                return todoOperate.Get(x => x.Id == todoId);
            }
            catch (Exception ex)
            {
                throw new Exception("search todo have ex : {0}", ex);
            }
        }

        public List<Todo> ListTodoByType(TodoType type)
        {
            try
            {
                var todoList = new List<Todo>();
                foreach (var todo in todoOperate.GetAll(x => x.UserId == id && x.TodoType == type))
                {
                    todoList.Add(todo);
                }
                if (todoList.Count > 0) return todoList;
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("list todo by type have ex : {0}", ex);
            }
        }

        public List<Todo> ListTodoUnlessIdea()
        {
            try
            {
                var todoList = new List<Todo>();
                foreach (var todo in todoOperate.GetAll(x => x.UserId == id && x.TodoType != TodoType.IdeaTodo))
                {
                    todoList.Add(todo);
                }
                if (todoList.Count > 0) return todoList;
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("list todo by type have ex : {0}", ex);
            }
        }

        public List<Todo> ListTodoByAdvance(DateTime dateFrom, DateTime dateTo)
        {
            try
            {
                var todos = ListTodo().FindAll(x => x.isAdvanceRemind == true && x.TodoType > 0).ToList();
                var todoList = new List<Todo>();
                if (todos != null && todos.Count > 0)
                {
                    foreach (var todo in todos)
                    {
                        if (DateTime.Compare(todo.DateFrom, dateTo) <= 0 && DateTime.Compare((DateTime)todo.DateTo, dateFrom) >= 0)
                        {
                            todoList.Add(todo);
                        }
                    }
                    if (todos.Count > 0) return todoList;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("list advance todo have ex : {0}", ex);
            }
        }

        public List<Todo> ListByTypeAndTodo(TodoType type)
        {
            try
            {
                var todoList = new List<Todo>();
                foreach (var todo in todoOperate.GetAll(x => x.UserId == id && x.TodoType == type && x.isComplete == false))
                {
                    todoList.Add(todo);
                }
                if (todoList.Count > 0) return todoList;
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("list type&todo have ex : {0}", ex);
            }
        }

        public List<Todo> ListByTypeAndDone(TodoType type)
        {
            try
            {
                var todoList = new List<Todo>();
                foreach (var todo in todoOperate.GetAll(x => x.UserId == id && x.TodoType == type && x.isComplete == true))
                {
                    todoList.Add(todo);
                }
                if (todoList.Count > 0) return todoList;
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("list type&done have ex : {0}", ex);
            }
        }

        public List<Todo> ListTodoByDate(DateTime date)
        {
            try
            {
                var todos = ListTodo().FindAll(x => x.TodoType > 0).ToList();
                var todoList = new List<Todo>();
                if (todos != null && todos.Count > 0)
                {
                    foreach (var todo in todos)
                    {
                        DateTime dateStart = Convert.ToDateTime(date.ToShortDateString());
                        DateTime dateEnd = Convert.ToDateTime(date.ToShortDateString() + " " + DateTime.MaxValue.ToShortTimeString());
                        if (DateTime.Compare(todo.DateFrom, dateEnd) <= 0 && DateTime.Compare((DateTime)todo.DateTo, dateStart) >= 0)
                        {
                            todoList.Add(todo);
                        }
                    }
                    if (todos.Count > 0) return todoList;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception($"list todo by one day have ex : {ex}");
            }
        }

        public List<Todo> ListNofreeTodoSortByTime(DateTime date)
        {
            try
            {
                var todos = ListTodoByDate(date);
                var todoList = new List<Todo>();
                if (todos != null && todos.Count > 0)
                {
                    foreach (var todo in todos)
                    {
                        if (todo.TodoType == TodoType.NoFreeTimeTodo) todoList.Add(todo);
                    }
                    todoList = todoList.OrderByDescending(x => x.DateFrom).ToList();
                    if (todos.Count > 0) return todoList;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("list todo by one day have ex : {0}", ex);
            }
        }

        public OperateStatus CompleteTodo(string todoId)
        {
            try
            {
                var todoItem = todoOperate.Get(todoId);
                if (todoItem.TodoType <= 0) return OperateStatus.TypeIsNotMatch;
                if (todoItem.isComplete != null) todoItem.isComplete = true;
                if (todoOperate.Update(todoItem) > 0) return OperateStatus.Success;
                return OperateStatus.Fial;
            }
            catch (Exception ex)
            {
                throw new Exception("complete todo have ex : {0}", ex);
            }
        }
    }
}