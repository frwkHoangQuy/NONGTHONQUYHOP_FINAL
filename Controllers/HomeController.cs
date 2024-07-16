using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
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
            var BaseUrl = _configuration.GetValue<string>("BaseUrl");
            ViewBag.BaseUrl = BaseUrl;
            return View("index");
        }

        public IActionResult ChiTietTinTuc()
        {
            return View("chi-tiet-tin-tuc");
        }
    }
}

