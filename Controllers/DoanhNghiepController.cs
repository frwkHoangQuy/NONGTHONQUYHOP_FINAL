using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

    public class DoanhNghiepController : Controller
    {
        private readonly IConfiguration _configuration;

        public DoanhNghiepController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult Index()

        {
            ViewBag.BaseUrl = _configuration.GetValue<string>("BaseUrl");
            return View("DoanhNghiep");
        }
    }
