using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace WebApplication3.Controllers
{
    public class LoginController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<LoginController> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        public LoginController(IConfiguration configuration, ILogger<LoginController> logger, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
        }

        public IActionResult Index()
        {
            ViewBag.BaseUrl = _configuration.GetValue<string>("BaseUrl");
            return View("Login");
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginRequest loginRequest)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                var response = await client.PostAsJsonAsync($"{_configuration.GetValue<string>("BaseUrl")}/User/login", loginRequest);

                if (response.IsSuccessStatusCode)
                {
                    var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponse>();

                    if (loginResponse != null)
                    {
                        if (!string.IsNullOrEmpty(loginResponse.Data?.JWToken))
                        {
                            HttpContext.Session.SetString("Token", loginResponse.Data.JWToken);
                            return RedirectToAction("Index", "Home");
                        }
                        else
                        {
                            ModelState.AddModelError(string.Empty, "Wrong username or password");
                        }
                    }
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "Unauthorized login attempt.");
                }
            }
            catch (HttpRequestException e)
            {
                ModelState.AddModelError(string.Empty, $"Error calling the external login service: {e.Message}");
            }
            catch (NotSupportedException)
            {
                ModelState.AddModelError(string.Empty, "The response content type is not supported.");
            }
            catch (JsonException)
            {
                ModelState.AddModelError(string.Empty, "Error deserializing login response.");
            }
            catch (Exception e)
            {
                ModelState.AddModelError(string.Empty, $"An unexpected error occurred: {e.Message}");
            }

            return View("Login");
        }

        [HttpPost]
        public IActionResult Logout()
        {
            HttpContext.Session.Remove("Token");
            return RedirectToAction("Index", "Login");
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
        public bool Success { get; set; }
        public string Message { get; set; }
        public UserData Data { get; set; }
        public string Exception { get; set; }
        public string CurrentDate { get; set; }
    }

    public class UserData
    {
        public string ID { get; set; }
        public string TaiKhoan { get; set; }
        public string HoTen { get; set; }
        public string SoDinhDanh { get; set; }
        public bool IsVerified { get; set; }
        public string JWToken { get; set; }
        public string QuyenUser { get; set; }
        public string QTHTDonVi { get; set; }
        public int ID_DoanhNghiep { get; set; }
        public int ID_QuanHuyen { get; set; }
        public int ID_PhuongXa { get; set; }
    }
}
