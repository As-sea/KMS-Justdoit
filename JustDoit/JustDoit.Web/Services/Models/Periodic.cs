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

    [Collection("Periodic")]
    public class Periodic : DomainModel
    {
        public string PeriodicName { set; get; }
        public string PeriodicItem { get; set; }

        //I have no idea about how to write this...... public TimeSpan Duration { get; set; }
        public int Times { get; set; }

        public int CompletionTimes { get; set; }
        public DateTime CompletionDate { get; set; }

        public bool isOpen { get; set; }

        public string DreamId { get; set; }
        public string UserId { get; set; }
        public List<string> ImageNames { get; set; }
    }
}