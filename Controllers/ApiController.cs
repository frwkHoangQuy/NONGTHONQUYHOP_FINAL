using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.Net.Http;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;
using System;
using System.Text.Json;

namespace WebApplication3.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginApiController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;

        public LoginApiController(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
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
                            HttpContext.Session.SetString("Token", loginResponse.Data.JWToken); // Storing token in session
                            return Ok(loginResponse);
                        }
                        else
                        {
                            return StatusCode(StatusCodes.Status500InternalServerError, "JWT token is missing in the login response.");
                        }
                    }
                }

                return Unauthorized();
            }
            catch (HttpRequestException e)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, $"Error calling the external login service: {e.Message}");
            }
            catch (NotSupportedException) // When content type is not valid JSON
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "The response content type is not supported.");
            }
            catch (JsonException) // Invalid JSON
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error deserializing login response.");
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {e.Message}");
            }
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
