export default function middleware(req) {
  const userAgent = req.headers.get("user-agent") || "";
  const referer = req.headers.get("referer") || "";
  const secFetchDest = req.headers.get("sec-fetch-dest") || "";
  const accept = req.headers.get("accept") || "";
  const acceptLanguage = req.headers.get("accept-language") || "";
  const cookie = req.headers.get("cookie") || "";
  const csrfToken = req.headers.get("x-csrf-token") || req.url.includes("csrf_token");
  const isAutomatedTool = /curl|wget|httpie|postman|fetch|python|axios/i.test(userAgent);
  const isInvalidReferer = referer === ""; 
  const isInvalidSecFetchDest = secFetchDest !== "document";
  const isInvalidAcceptHeader = !/text\/html/i.test(accept);
  const isInvalidAcceptLanguage = !acceptLanguage;
  const isInvalidCookie = !cookie || !csrfToken;
  if (isAutomatedTool || isInvalidReferer || isInvalidSecFetchDest || isInvalidAcceptHeader || isInvalidAcceptLanguage || isInvalidCookie) {
    return new Response(
      "403 Forbidden: Akses ditolak! File HTML ini hanya dapat diakses melalui browser.",
      {
        status: 403,
        headers: {
          "Content-Type": "text/plain",
          "X-Protected-By": "AlphaCoder Security System v3",
        },
      }
    );
  }

  return Response.next();
}