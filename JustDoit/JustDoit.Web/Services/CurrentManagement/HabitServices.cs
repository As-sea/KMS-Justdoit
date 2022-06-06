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
    using JustDoit.Web.Services.UserManagement;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using static JustDoit.Web.Services.CommonServices.CommonEnum;

    public class HabitServices
    {
        UserRepository userOperate = new UserRepository();
        string id;
        public HabitServices() => this.id = new TempServices().getCookie();// "622ef70507c04472fc4f659f";// "622ef70507c04472fc4f659f";// new UserBaseService().GetCookieValue(); //"62811a3e07c0446c08e55bf7";
        public OperateStatus CreateHabit(Habit habit)
        {
            try
            {
                var userItem = userOperate.Get(id);
                if (ListHabits() != null)
                {
                    if (ListHabits().FindAll(x => x.HabitName == habit.HabitName.TrimEnd()).Count != 0) return OperateStatus.RepeatHabit;
                }
                else
                {
                    userItem.Habits = new List<Habit>();
                }
                habit.KeepDates = new List<KeepDate>();
                if (ListOpenHabits() != null && ListOpenHabits().Count >= 3)
                {
                    habit.isOpen = false;
                    habit.KeepDates.Add(new KeepDate { StartDate = DateTime.Now, EndDate = DateTime.MinValue });
                }
                else
                {
                    habit.isOpen = true;
                    habit.KeepDates.Add(new KeepDate { StartDate = DateTime.Now, });
                }
                habit.HabitName = habit.HabitName.TrimEnd();
                userItem.Habits.Add(habit);
                if (userOperate.Update(userItem) > 0) return OperateStatus.Success;
                return OperateStatus.Fial;
            }
            catch (Exception ex)
            {
                throw new Exception("Create Habit have ex : {0}", ex);
            }
        }

        public OperateStatus CompleteHabit(string habitName)
        {
            try
            {
                var userItem = userOperate.Get(id);
                if (ListHabits() == null) return OperateStatus.ListHabitsNull;
                var habit = userItem.Habits.Find(x => x.HabitName == habitName);
                if (habit.isOpen != true) return OperateStatus.HabitStatusError;
                if (habit.KeepDates == null) return OperateStatus.HabitKeepdateHasWrongWhenCreate;
                int index = habit.KeepDates.Count - 1;
                KeepDate keep = habit.KeepDates[index];
                if (keep.EndDate != DateTime.MinValue)
                {
                    if (keep.EndDate.ToShortDateString() == DateTime.Now.ToShortDateString()) return OperateStatus.HabitHadCompleted;
                    else if (keep.EndDate.ToShortDateString() == DateTime.Now.AddDays(-1).ToShortDateString()) keep.EndDate = DateTime.Now;
                    else habit.KeepDates.Add(new KeepDate { StartDate = DateTime.Now, EndDate = DateTime.Now });
                }
                else
                {
                    if (keep.StartDate.ToShortDateString() == DateTime.Now.ToShortDateString()) keep.EndDate = DateTime.Now;
                    else
                    {
                        habit.KeepDates.Add(new KeepDate { StartDate = DateTime.Now, EndDate = DateTime.Now });
                    }
                }
                if (userOperate.Update(userItem) > 0) return OperateStatus.Success;
                return OperateStatus.Fial;
            }
            catch (Exception ex)
            {
                throw new Exception("Complete Habit have ex : {0}", ex);
            }
        }

        public OperateStatus ChangeHabitNameOrItem(string oldName, Habit habit)
        {
            try
            {
                var userItem = userOperate.Get(id);
                if (ListHabits() == null) return OperateStatus.ListHabitsNull;
                userItem.Habits.Find(x => x.HabitName == oldName).HabitItem = habit.HabitItem;
                userItem.Habits.Find(x => x.HabitName == oldName).isOpen = habit.isOpen;
                userItem.Habits.Find(x => x.HabitName == oldName).HabitName = habit.HabitName.TrimEnd();
                if (userOperate.Update(userItem) > 0) return OperateStatus.Success;
                return OperateStatus.Fial;
            }
            catch (Exception ex)
            {
                throw new Exception("Change Habit have ex : {0}", ex);
            }
        }

        public OperateStatus ChangeHabitStatus(string habitName)
        {
            try
            {
                var userItem = userOperate.Get(id);
                if (ListHabits() == null) return OperateStatus.ListHabitsNull;
                var status = userItem.Habits.Find(x => x.HabitName == habitName).isOpen;
                userItem.Habits.Find(x => x.HabitName == habitName).isOpen = !status;
                if (userOperate.Update(userItem) > 0) return OperateStatus.Success;
                return OperateStatus.Fial;
            }
            catch (Exception ex)
            {
                throw new Exception("Close Habit have ex : {0}", ex);
            }
        }

        public OperateStatus DeleteHabit(string habitName)
        {
            try
            {
                var userItem = userOperate.Get(id);
                if (ListHabits() == null) return OperateStatus.ListHabitsNull;
                if (!userItem.Habits.Remove(userItem.Habits.Where(x => x.HabitName == habitName).FirstOrDefault())) return OperateStatus.DeleteHabitFail;
                if (userOperate.Update(userItem) > 0) return OperateStatus.Success;
                return OperateStatus.Fial;
            }
            catch (Exception ex)
            {
                throw new Exception("Delete Habit have ex : {0}", ex);
            }
        }

        public List<Habit> ListHabits()
        {
            try
            {
                return userOperate.Get(id).Habits;
            }
            catch (Exception ex)
            {
                throw new Exception("List Habit have ex : {0}", ex);
            }
        }

        public List<Habit> ListOpenHabits()
        {
            try
            {
                if (userOperate.Get(id).Habits != null)
                {
                    return userOperate.Get(id).Habits.FindAll(x => x.isOpen == true).ToList();
                }
                else
                {
                    userOperate.Get(id).Habits = new List<Habit>();
                    return null;
                }

            }
            catch (Exception ex)
            {
                throw new Exception("List Open Habit have ex : {0}", ex);
            }
        }
    }
}