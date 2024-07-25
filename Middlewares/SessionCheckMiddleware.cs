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

            var token = context.Session.GetString("Token");

            if (string.IsNullOrEmpty(token) && !path.Equals("/Login", StringComparison.OrdinalIgnoreCase) &&
                !path.Equals("/Login/Login", StringComparison.OrdinalIgnoreCase))
            {
                context.Response.Redirect("/Login");
                return;
            }

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
