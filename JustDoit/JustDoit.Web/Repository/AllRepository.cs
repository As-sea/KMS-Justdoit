/* ==============================================================
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-01-19    
 * ==============================================================
 */
namespace JustDoit.Web.Repository
{
    using JustDoit.Web.Services.Models;
    using SquirrelFramework.Repository;
    public class AllRepository { }
    public class UserRepository : RepositoryBase<User> { }
    public class DreamRepository : RepositoryBase<Dream> { }
    public class PlanRepository : RepositoryBase<Plan> { }
    public class PeriodicRepository : RepositoryBase<Periodic> { }
    public class TodoRepository : RepositoryBase<Todo> { }

}