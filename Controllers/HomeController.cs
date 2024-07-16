using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebApplication3.Models;

namespace WebApplication3.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View("index");
        }

        public IActionResult ChiTietTinTuc()
        {
            return View("chi-tiet-tin-tuc");
        }
    }
}
