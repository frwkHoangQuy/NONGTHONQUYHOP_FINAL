using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using WebApplication3.Models;

namespace WebApplication3.Controllers
{
    public class HomeController : Controller
    {
        private readonly IConfiguration _configuration;

        public HomeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult Index()
        {
            ViewBag.BaseUrl = _configuration.GetValue<string>("BaseUrl");
            return View("index");
        }

        public IActionResult ChiTietTinTuc()
        {
            ViewBag.BaseUrl = _configuration.GetValue<string>("BaseUrl");
            return View("chi-tiet-tin-tuc");
        }
    }
}
