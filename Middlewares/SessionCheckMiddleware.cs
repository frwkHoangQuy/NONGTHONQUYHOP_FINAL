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

            if (path.Equals("/Login", StringComparison.OrdinalIgnoreCase) ||
                path.Equals("/api/LoginApi/Login", StringComparison.OrdinalIgnoreCase))
            {
                await _next(context);
                return;
            }

            var token = context.Session.GetString("Token");

            if (string.IsNullOrEmpty(token))
            {
                context.Response.Redirect("/Login");
                return;
            }

            await _next(context);
        }
    }
}
