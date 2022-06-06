/* ==============================================================
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-01-19    
 * ==============================================================
 */
namespace JustDoit.Web.Services.PlanManagement
{
    using JustDoit.Web.Repository;
    using JustDoit.Web.Services.CommonServices.Temp;
    using JustDoit.Web.Services.UserManagement;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using static JustDoit.Web.Services.CommonServices.CommonEnum;

    public class ImageServices
    {
        UserRepository userOperate = new UserRepository();
        PlanRepository planOperate = new PlanRepository();
        PeriodicRepository periodicOperate = new PeriodicRepository();
        string id;
        public ImageServices() => this.id = new TempServices().getCookie();// "622ef70507c04472fc4f659f";//"62811a3e07c0446c08e55bf7"; //new UserBaseService().GetCookieValue();
        public OperateStatus AddImage(string imageName)
        
        
        {
            try
            {
                if (ListImage()?.Count >= 6) return OperateStatus.ImageLimited;
                var userItem = userOperate.Get(id);
                if (userItem.ImagePositives == null)
                {
                    userItem.ImagePositives = new List<string>();
                }
                else
                {
                    foreach (var image in userItem.ImagePositives)
                    {
                        if (image == imageName.TrimEnd()) return OperateStatus.RepeatImage;
                    }
                }
                userItem.ImagePositives.Add(imageName.TrimEnd());
                if (userOperate.Update(userItem) > 0) return OperateStatus.Success;
                return OperateStatus.Fial;
            }
            catch (Exception ex)
            {
                throw new Exception("AddImage have ex : {0}", ex);
            }

        }

        public List<string> ListImage()
        {
            try
            {
                return userOperate.Get(id).ImagePositives;
            }
            catch (Exception ex)
            {
                throw new Exception("ListImage have ex : {0}", ex);
            }
        }

        public OperateStatus DeleteImage(string imageName)
        {
            try
            {
                foreach (var plan in planOperate.GetAll(x => x.UserId == id && (x.ImageAssociateds != null || x.ImageAssociateds.Count > 0)))
                {
                    if (plan.ImageAssociateds.Remove(plan.ImageAssociateds.Where(x => x.ImageName == imageName).FirstOrDefault()))
                        if (planOperate.Update(plan) <= 0) return OperateStatus.DeleteImageInPlanHasError;

                }
                var useItem = userOperate.Get(id);
                if (useItem.ImagePositives != null)
                {
                    if (useItem.ImagePositives.RemoveAll(x => x == imageName) > 0)
                        if (userOperate.Update(useItem) > 0)
                            return OperateStatus.Success;
                }
                return OperateStatus.Fial;
            }
            catch (Exception ex)
            {
                throw new Exception("DeleteImage have ex : {0}", ex);
            }

        }

        public string SearchSingleByImageName(string imageName)
        {
            try
            {
                return userOperate.Get(id).ImagePositives.Find(x => x == imageName);
            }
            catch (Exception ex)
            {
                throw new Exception("SearchSingleByImageName have ex : {0}", ex);
            }
        }

        public List<string> ListImageByPlan(string planId)
        {
            try
            {
                var imageAllList = planOperate.Get(planId).ImageAssociateds;
                if (imageAllList == null || imageAllList.Count <= 0) return null;
                var imageList = new List<string>();
                foreach (var image in imageAllList)
                {
                    imageList.Add(image.ImageName);
                }
                return imageList;
            }
            catch (Exception ex)
            {
                throw new Exception("List image by Plan have ex : {0}", ex);
            }
        }
        public List<string> ListImageByPeriodic(string periodicId)
        {
            try
            {
                return null;

            }
            catch (Exception ex)
            {
                throw new Exception("List Image bu Periodic have ex : {0}", ex);
            }
        }
        public OperateStatus UpdateImage(string oldName, string newName)
        {
            try
            {
                var planService = new PlanServices();
                var planList = planService.ListPlanByImage(oldName);
                if (planList != null)
                {
                    foreach (var plan in planList)
                    {
                        plan.ImageAssociateds.Where(x => x.ImageName == oldName).FirstOrDefault().ImageName = newName.TrimEnd();
                        planOperate.Update(plan);
                    }
                }
                var useItem = userOperate.Get(id);
                if (useItem.ImagePositives != null)
                {
                    if (useItem.ImagePositives.Remove(useItem.ImagePositives.Where(x => x == oldName).FirstOrDefault()))
                    {
                        useItem.ImagePositives.Add(newName.TrimEnd());
                        if (userOperate.Update(useItem) > 0)
                            return OperateStatus.Success;
                    }
                }
                return OperateStatus.Fial;
            }
            catch (Exception ex)
            {
                throw new Exception("UpdateImage have ex : {0}", ex);
            }
        }
    }
}