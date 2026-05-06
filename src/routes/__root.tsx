import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile/MobileShell";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
          Go home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1" },
      { name: "theme-color", content: "#0a0d18" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { title: "Veritas AI — Detect AI-Generated Content" },
      { name: "description", content: "Mobile AI detector for text, images and video. Tap-to-reveal flagged content." },
      { property: "og:title", content: "Veritas AI — Detect AI-Generated Content" },
      { name: "twitter:title", content: "Veritas AI — Detect AI-Generated Content" },
      { property: "og:description", content: "Mobile AI detector for text, images and video. Tap-to-reveal flagged content." },
      { name: "twitter:description", content: "Mobile AI detector for text, images and video. Tap-to-reveal flagged content." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f8662138-75be-4513-97ab-9e99c6b3aa8f/id-preview-85bfadd3--50da763c-f9ca-4b5e-98a1-61a97e1833b5.lovable.app-1778064122647.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f8662138-75be-4513-97ab-9e99c6b3aa8f/id-preview-85bfadd3--50da763c-f9ca-4b5e-98a1-61a97e1833b5.lovable.app-1778064122647.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: () => (
    <MobileShell />
  ),
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
