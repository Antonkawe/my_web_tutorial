export default function middleware(req) {
  const userAgent = req.headers.get("user-agent") || "";
  const isAutomatedTool = /curl|wget|httpie|postman|fetch|python|axios/i.test(userAgent);
  if (isAutomatedTool) {
    return new Response(
      "403 Forbidden: Akses ditolak! File HTML ini hanya dapat diakses melalui browser.",
      {
        status: 403,
        headers: {
          "Content-Type": "text/plain",
          "X-Protected-By": "AlphaCoder Security System",
        },
      }
    );
  }
  return Response.next();
}