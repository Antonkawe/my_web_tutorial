const rateLimiter = {
  ipTracker: new Map(),
  limit: 1,
  windowMs: 10000,
  allow(ip) {
    const now = Date.now();
    const timestamps = this.ipTracker.get(ip) || [];
    const recentRequests = timestamps.filter(ts => now - ts < this.windowMs);
    if (recentRequests.length >= this.limit) {
      return false;
    }
    recentRequests.push(now);
    this.ipTracker.set(ip, recentRequests);
    return true;
  },
};

module.exports = async (req) => {
  const userAgent = req.headers["user-agent"] || "";
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";
  const suspiciousAgents = ["curl", "wget", "bot", "PostmanRuntime", "httpclient", "python"];
  const isSuspicious = !userAgent || suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent));
  if (isSuspicious) {
    return new Response("<html><body>Access Denied</body></html>", {
      status: 403,
      headers: {
        "Content-Type": "text/html",
        "X-Robots-Tag": "noindex, nofollow, nosnippet",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none';",
      },
    });
  }
  if (!rateLimiter.allow(ip)) {
    return new Response("<html><body>Too many requests</body></html>", {
      status: 429,
      headers: {
        "Content-Type": "text/html",
        "X-Robots-Tag": "noindex, nofollow, nosnippet",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  }
  return new Response(null, { status: 200 });
};