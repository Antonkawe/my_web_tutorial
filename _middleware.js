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
  const isInvalidReferer = referer === "";
  const isInvalidSecFetchDest = secFetchDest !== "document";
  const isInvalidAcceptHeader = !/text\/html/i.test(accept);
  const isInvalidAcceptLanguage = !acceptLanguage;
  const isInvalidCookie = !cookie || !csrfToken;
  const isInvalidOrigin = origin && !/your-allowed-origin\.com/i.test(origin);
  const isInvalidAcceptEncoding = !/gzip|deflate|br/i.test(acceptEncoding);
  const isInvalidConnection = connection !== "keep-alive";

  if (
    isAutomatedTool ||
    isInvalidReferer ||
    isInvalidSecFetchDest ||
    isInvalidAcceptHeader ||
    isInvalidAcceptLanguage ||
    isInvalidCookie ||
    isInvalidOrigin ||
    isInvalidAcceptEncoding ||
    isInvalidConnection
  ) {
    return new Response(
      "403 Forbidden: Akses ditolak! File HTML ini hanya dapat diakses melalui browser.",
      {
        status: 403,
        headers: {
          "Content-Type": "text/plain",
          "X-Protected-By": "AlphaCoder Security System v5",
        },
      }
    );
  }

  return Response.next();
};