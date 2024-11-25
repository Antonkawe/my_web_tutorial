module.exports = async (req) => {
  const userAgent = req.get("User-Agent") || "";
  const suspiciousAgents = ["curl", "wget", "bot", "PostmanRuntime", "httpclient", "python"];
    const isSuspicious = suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent)) || userAgent.trim() === "";

  if (isSuspicious) {
    return new Response(
      "<html><body>Access Denied</body></html>",
      {
        status: 403,
        headers: {
          "Content-Type": "text/html",
          "X-Robots-Tag": "noindex, nofollow, nosnippet",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none';"
        },
      }
    );
  }
  const ip = req.headers["x-forwarded-for"] || req.ip || "unknown";
  if (!rateLimiter.allow(ip)) {
    return new Response(
      "<html><body>Too many requests</body></html>",
      {
        status: 429,
        headers: {
          "Content-Type": "text/html",
          "X-Robots-Tag": "noindex, nofollow, nosnippet",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  }
  return new Response(null, { status: 200 });
};

const rateLimiter = {
  ipTracker: new Map(),
  limit: 1,
  allow(ip) {
    const now = Date.now();
    const requests = this.ipTracker.get(ip) || [];
    const filteredRequests = requests.filter(timestamp => now - timestamp < 10000);
    filteredRequests.push(now);
    this.ipTracker.set(ip, filteredRequests);
    return filteredRequests.length <= this.limit;
  },
};