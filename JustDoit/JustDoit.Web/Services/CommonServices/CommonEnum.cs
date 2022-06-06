/* ==============================================================
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-01-19    
 * ==============================================================
 */
namespace JustDoit.Web.Services.CommonServices
{
    public class CommonEnum
    {
        public enum OperateStatus
        {
            //Common
            Success = 0,
            UnknowError = 1,
            Fial = 2,
            UpdateUserHasException = 3,

            //Plan Situation
            TopicRequiredNotHaveValue = 101,
            DateNull = 102,
            DateIsWrong = 103,
            NoImageInUser = 104,
            NoCharacterInUser = 105,
            UserAndDreamIdNotMatch = 106,
            ConformityOutOfRange = 107,
            UpdatePlanIdInTodoHasError = 108,

            //Character Situation
            RepeatCharacter = 201,

            //Image Situation
            RepeatImage = 301,
            ImageLimited = 302,
            DeleteImageInPlanHasError = 303,

            //Skil Situation
            RepeatSkill = 401,
            DeleteSkillInDreamFail = 402,

            //Dream Situation
            CareerLimited = 501,
            LifeLimited = 502,
            RequiredNotHaveValue = 503,
            SkillHasException = 504,
            RepeatTopic = 505,
            NoSkillInUser = 506,
            UpdateDreamIdInPlanHasError = 507,

            //Habit Sistuation
            RepeatHabit = 601,
            NotFoundHabit = 602,
            DeleteHabitFail = 603,
            ListHabitsNull = 604,
            HabitStatusError = 605,
            HabitKeepdateHasWrongWhenCreate = 606,
            HabitHadCompleted = 607,

            //Todo
            TopicIsNull = 701,
            DateFormatIsWrong = 702,
            PlanIdNotFound = 703,
            TodoTypeHasUnknowWrong = 704,
            RemindValueIsWrong = 705,
            TypeIsNotMatch = 706,

            //Message
            NewPasswordIsNull = 801,
            UpdatePasswordFail = 802,
            UpdateDisplayFail = 803,


        }

        public enum UserOperateStatus
        {
            SuperLoginSuccess = 1000,
            NormalSuccess = 1001,
            UnknowError = 1002,

            //resgister
            MissRequired = 1101,
            ExistedUser = 1102,
            UnexistedUser = 1103,
            RegisterFail = 1104,

            //Login
            NotFoundObject = 1011,
            PasswordError = 1012,

            //LogOut

            //super
            DeleteSuccess = 1020,
            NoPower = 1021,

        }
    }
}