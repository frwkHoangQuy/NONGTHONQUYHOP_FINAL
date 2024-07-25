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

            // Allow access to the login page and login API endpoint without session
            if (path.Equals("/Login", StringComparison.OrdinalIgnoreCase) ||
                path.Equals("/Login/Login", StringComparison.OrdinalIgnoreCase))
            {
                await _next(context);
                return;
            }

            // Check if the session token exists
            var token = context.Session.GetString("Token");

            // Redirect to login page if the token is missing
            if (string.IsNullOrEmpty(token))
            {
                context.Response.Redirect("/Login");
                return;
            }

            await _next(context);
        }
    }
}
