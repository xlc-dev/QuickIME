import { createMiddleware } from "@solidjs/start/middleware";
import { json } from "@solidjs/router";

const SAFE_METHODS = ["GET", "HEAD", "OPTIONS", "TRACE"];
const TRUSTED_ORIGINS = (import.meta.env.VITE_TRUSTED_ORIGINS || "")
  .split(",")
  .map((origin: string) => origin.trim())
  .filter(Boolean);

const IS_DEV = process.env.NODE_ENV === "development";

export default createMiddleware({
  onRequest(event) {
    const { request, response } = event;
    const url = new URL(request.url);

    if (!IS_DEV && url.protocol === "http:") {
      const httpsUrl = new URL(url.toString());
      httpsUrl.protocol = "https:";
      return new Response(null, {
        status: 308,
        headers: { Location: httpsUrl.toString() },
      });
    }

    const connectSrcParts = [
      "'self'",
      IS_DEV ? "data:" : "",
      IS_DEV ? "ws://localhost:*" : "",
      IS_DEV ? "wss://localhost:*" : "",
      "https://eu-assets.i.posthog.com",
      "https://eu.i.posthog.com",
    ];

    const connectSrc = connectSrcParts.filter(Boolean).join(" ");

    const csp = [
      "default-src 'self'",
      `connect-src ${connectSrc}`,
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://eu-assets.i.posthog.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "worker-src 'self'",
      "form-action 'self'",
      "base-uri 'self'",
      "manifest-src 'self'",
      "media-src 'none'",
      "object-src 'none'",
      "frame-src 'none'",
      "child-src 'none'",
      // "require-trusted-types-for 'script'", // Firefox doesn't support this yet
    ].join("; ");

    response.headers.set("Content-Security-Policy", csp);
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
      "Permissions-Policy",
      "accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), bluetooth=(), camera=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), gamepad=(), geolocation=(), gyroscope=(), hid=(), idle-detection=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), speaker-selection=(), sync-xhr=(), usb=(), xr-spatial-tracking=()"
    );

    if (url.protocol === "https:") {
      response.headers.set(
        "Strict-Transport-Security",
        "max-age=63072000; includeSubDomains; preload"
      );
    }

    if (!SAFE_METHODS.includes(request.method)) {
      const origin = request.headers.get("Origin");
      if (origin) {
        if (origin !== url.origin && !TRUSTED_ORIGINS.includes(origin)) {
          // console.warn(`Blocked request from untrusted origin: ${origin}`);
          return json({ error: "invalid origin" }, { status: 403 });
        }
      } else if (url.protocol === "https:") {
        const referer = request.headers.get("Referer");
        if (!referer) {
          // console.warn("Blocked request with no referer on HTTPS");
          return json({ error: "referer not supplied" }, { status: 403 });
        }
        let refOrigin: string;
        try {
          refOrigin = new URL(referer).origin;
        } catch {
          // console.warn(`Blocked request with invalid referer: ${referer}`);
          return json({ error: "referer invalid" }, { status: 403 });
        }
        if (refOrigin !== url.origin && !TRUSTED_ORIGINS.includes(refOrigin)) {
          // console.warn(`Blocked request from untrusted referer origin: ${refOrigin}`);
          return json({ error: "referer invalid" }, { status: 403 });
        }
      }
    }
  },

  onBeforeResponse(event) {
    const { request, response: currentResponse } = event;
    const origin = request.headers.get("Origin");
    const varyValues = new Set(
      (currentResponse.headers.get("Vary") || "")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    );
    varyValues.add("Origin");

    if (origin && TRUSTED_ORIGINS.includes(origin)) {
      if (request.method === "OPTIONS" && request.headers.get("Access-Control-Request-Method")) {
        varyValues.add("Access-Control-Request-Method");
        varyValues.add("Access-Control-Request-Headers");

        const preflightHeaders = {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "OPTIONS, POST, PUT, PATCH, DELETE",
          "Access-Control-Allow-Headers": "Authorization, Content-Type",
          "Access-Control-Max-Age": "86400",
          "Access-Control-Allow-Credentials": "true",
          Vary: Array.from(varyValues).join(", "),
        };

        return json(null, { headers: preflightHeaders });
      }

      currentResponse.headers.set("Access-Control-Allow-Origin", origin);
      currentResponse.headers.set("Access-Control-Allow-Credentials", "true");
    }

    currentResponse.headers.set("Vary", Array.from(varyValues).join(", "));
  },
});
