/* ==============================================================
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-01-19    
 * ==============================================================
 */
namespace JustDoit.Web.Services.Models
{
    using System;
    using SquirrelFramework.Domain.Model;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    [Collection("User")]
    public class User : DomainModel
    {
        public string LoginName { get; set; }
        public string DisplayName { get; set; }
        public string Password { get; set; }
        public UserLevel UserLevel { get; set; }
        public List<string> ImagePositives { get; set; }
        public List<Skill> Skills { get; set; }
        public List<Character> Characters { get; set; }
        public List<Habit> Habits { get; set; }

    }

    public class Skill
    {
        public string SkillName { get; set; }
        public int OccurrenceFrequency { get; set; }
    }

    public class Character
    {
        public string CharecterName { get; set; }
        public int OccurrenceFrequency { get; set; }
        public string PeopleDetails { get; set; }
    }

    public class Habit
    {
        public string HabitName { get; set; }
        public string HabitItem { get; set; }
        public List<KeepDate> KeepDates { get; set; }
        public bool isOpen { get; set; }
    }
    public class KeepDate
    {
        [DataType(DataType.Date)]
        public DateTime StartDate { get; set; }
        [DataType(DataType.Date)]
        public DateTime EndDate { get; set; }
    }
    public enum UserLevel
    {
        NormalUser = 0,
        SuperUser = 1
    }
}