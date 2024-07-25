using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;

namespace WebApplication3.Middlewares
{
    public class SessionCheckMiddleware
    {
        private readonly RequestDelegate _next;

        public SessionCheckMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var path = context.Request.Path.Value;

            // Kiểm tra nếu session token tồn tại
            var token = context.Session.GetString("Token");

            // Nếu không có token và không phải truy cập trang login thì chuyển hướng đến trang login
            if (string.IsNullOrEmpty(token) && !path.Equals("/Login", StringComparison.OrdinalIgnoreCase) &&
                !path.Equals("/Login/Login", StringComparison.OrdinalIgnoreCase))
            {
                context.Response.Redirect("/Login");
                return;
            }

            // Nếu có token và đang cố gắng truy cập trang login thì chuyển hướng đến trang home
            if (!string.IsNullOrEmpty(token) && (path.Equals("/Login", StringComparison.OrdinalIgnoreCase) ||
                path.Equals("/Login/Login", StringComparison.OrdinalIgnoreCase)))
            {
                context.Response.Redirect("/");
                return;
            }

            await _next(context);
        }
    }
}
