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
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    [Collection("Dream")]
    public class Dream : DomainModel
    {
        public string DreamTopic { get; set; }
        public string DreamItem { get; set; }
        public DreamType DreamType { get; set; }
        public int InfluenceLevel { get; set; } //1-10
        public int DifficultyLevel { get; set; } //1-10
        [DataType(DataType.Date)]
        public DateTime CreateDate { get; set; }
        public List<string> SkillNames { get; set; }
        public string UserId { get; set; }
    }
    public enum DreamType
    {
        Dream = 0,
        Career = 1,
        Life = 2
    }
}