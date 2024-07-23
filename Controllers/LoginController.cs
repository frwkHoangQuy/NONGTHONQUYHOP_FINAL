using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace WebApplication3.Controllers
{
    public class LoginController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<LoginController> _logger;

        public LoginController(IConfiguration configuration, IHttpClientFactory httpClientFactory, ILogger<LoginController> logger)
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public IActionResult Index()
        {
            ViewBag.BaseUrl = _configuration.GetValue<string>("BaseUrl");
            return View("Login");
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            _logger.LogInformation("Login attempt for user: {Username}", loginRequest.Username);
            var client = _httpClientFactory.CreateClient();
            var response = await client.PostAsJsonAsync($"{_configuration.GetValue<string>("BaseUrl")}/User/login", loginRequest);

            if (response.IsSuccessStatusCode)
            {
                var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponse>();

                if (loginResponse != null)
                {
                    _logger.LogInformation("Login successful for user: {Username}", loginRequest.Username);
                    HttpContext.Session.SetString("Token", loginResponse.Token);
                    return Ok();
                }
                else
                {
                    _logger.LogWarning("Login failed: Response was null for user: {Username}", loginRequest.Username);
                }
            }
            else
            {
                _logger.LogWarning("Login failed: Status code {StatusCode} for user: {Username}", response.StatusCode, loginRequest.Username);
            }

            return Unauthorized();
        }

        [HttpPost]
        public IActionResult Logout()
        {
            HttpContext.Session.Remove("Token");
            return RedirectToAction("Index", "Home");
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public int QuanHuyenID { get; set; }
    }

    public class LoginResponse
    {
        public string Token { get; set; }
    }
}
