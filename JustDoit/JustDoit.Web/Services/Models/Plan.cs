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
    [Collection("Plan")]
    public class Plan : DomainModel
    {
        public string PlanTopic { get; set; }
        public string PlanItem { get; set; }
        [DataType(DataType.Date)]
        public DateTime DateFrom { get; set; }
        [DataType(DataType.Date)]
        public DateTime DateTo { get; set; }
        public List<string> CharacterNames { get; set; }
        public List<ImageAssociated> ImageAssociateds { get; set; }
        public string UserId { get; set; }
        public string DreamId { get; set; }
    }
    public class ImageAssociated
    {
        public string ImageName { get; set; }
        public int Conformity { get; set; } //1-10
    }
}