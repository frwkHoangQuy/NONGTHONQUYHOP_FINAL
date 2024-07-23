using Microsoft.AspNetCore.Mvc;

namespace WebApplication3.Controllers
{
    public class LoginController : Controller
    {
        private readonly IConfiguration _configuration;
        public LoginController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public IActionResult Index()
        {
            ViewBag.BaseUrl = _configuration.GetValue<string>("BaseUrl");
            return View("Login");
        }
    }
}
