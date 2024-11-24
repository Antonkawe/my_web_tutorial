module.exports = async (req) => {
  const userAgent = req.headers.get("user-agent") || "";
  const referer = req.headers.get("referer") || "";
  const secFetchDest = req.headers.get("sec-fetch-dest") || "";
  const accept = req.headers.get("accept") || "";
  const acceptLanguage = req.headers.get("accept-language") || "";
  const cookie = req.headers.get("cookie") || "";
  const csrfToken = req.headers.get("x-csrf-token") || req.url.includes("csrf_token");
  const origin = req.headers.get("origin") || "";
  const acceptEncoding = req.headers.get("accept-encoding") || "";
  const connection = req.headers.get("connection") || "";
  const isAutomatedTool = /curl|wget|httpie|postman|fetch|python|axios/i.test(userAgent);
  const allowedDomain = "https://www.antoncodder.online";
  const isInvalidReferer =
    referer && !referer.startsWith(allowedDomain);
  const isInvalidOrigin =
    origin && !origin.startsWith(allowedDomain);
  const isInvalidSecFetchDest = secFetchDest !== "document";
  const isInvalidAcceptHeader = !/text\/html/i.test(accept);
  const isInvalidAcceptLanguage = !acceptLanguage;
  const isInvalidCookie = !cookie || !csrfToken;
  const isInvalidAcceptEncoding = !/gzip|deflate|br/i.test(acceptEncoding);
  const isInvalidConnection = connection !== "keep-alive";
  if (
    isAutomatedTool ||
    isInvalidReferer ||
    isInvalidOrigin ||
    isInvalidSecFetchDest ||
    isInvalidAcceptHeader ||
    isInvalidAcceptLanguage ||
    isInvalidCookie ||
    isInvalidAcceptEncoding ||
    isInvalidConnection
  ) {
    return new Response(
      "403 Forbidden: Akses ditolak! File HTML ini hanya dapat diakses melalui domain Anda.",
      {
        status: 403,
        headers: {
          "Content-Type": "text/plain",
          "X-Protected-By": "AlphaCoder Security System v6",
        },
      }
    );
  }
  return Response.next();
};