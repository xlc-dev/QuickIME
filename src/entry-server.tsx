// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>QuickIME – An Input Method Editor that doesn't suck</title>
          <link rel="icon" href="icon.png" />
          <meta name="author" content="xlcdev" />
          <meta property="og:type" content="website" />
          <meta name="theme-color" content="#a59dff" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="application-name" content="QuickIME" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="QuickIME" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <link
            rel="apple-touch-icon"
            sizes="192x192"
            href="/icons/-192x192.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="512x512"
            href="/icons/-512x512.png"
          />
          <meta
            property="og:title"
            content="QuickIME – An Input Method Editor that doesn't suck"
          />
          <meta
            name="twitter:title"
            content="QuickIME – An Input Method Editor that doesn't suck"
          />
          <meta
            property="og:description"
            content="A local-first Input Method Editor (IME) for Japanese, aiming for a fast and frustration-free experience. Since all IME's on Linux/Windows/Android are annoying or slow."
          />
          <meta
            name="description"
            content="A local-first Input Method Editor (IME) for Japanese, aiming for a fast and frustration-free experience. Since all IME's on Linux/Windows/Android are annoying or slow."
          />
          <meta
            name="twitter:description"
            content="A local-first Input Method Editor (IME) for Japanese, aiming for a fast and frustration-free experience. Since all IME's on Linux/Windows/Android are annoying or slow."
          />
          <meta
            property="og:image"
            content="https://xlc-dev.github.io/QuickIME/icon.png"
          />
          <meta
            name="twitter:image"
            content="https://xlc-dev.github.io/QuickIME/icon.png"
          />
          <meta
            property="og:url"
            content="https://xlc-dev.github.io/QuickIME/"
          />

          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}

          <script>
            {`
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', async () => {
                  try {
                    await navigator.serviceWorker.register('/sw.js');
                    console.log('SW registered');
                  } catch (e) {
                    console.error('SW registration failed', e);
                  }
                });
              }
            `}
          </script>
        </body>
      </html>
    )}
  />
));
