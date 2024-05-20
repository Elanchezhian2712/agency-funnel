// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isPublicRoute = createRouteMatcher(["/api/uploadthing", "/site"]);

// // export default clerkMiddleware((auth, request) => {
// //   if (!isPublicRoute(request)) {
// //     return;
// //   }
// // });

// export default clerkMiddleware();

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };

// import { NextResponse } from "next/server";
// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// // Define public routes using createRouteMatcher
// const publicRouteMatcher = createRouteMatcher(["/sites", "/api/uploadthing"]);

// export default clerkMiddleware((auth, req) => {
//   // No need for async beforeAuth and afterAuth functions

//   const url = req.nextUrl;
//   const hostname = req.headers.get("host");
//   const searchParams = url.searchParams.toString();
//   const pathWithSearchParams = `${url.pathname}${
//     searchParams.length > 0 ? `?${searchParams}` : ""
//   }`;

//   // Check if the route is a public route
//   if (!publicRouteMatcher(req)) {
//     // If not a public route, perform redirection or rewriting as needed
//     if (hostname) {
//       const customSubDomain = hostname
//         .split(`.${process.env.NEXT_PUBLIC_DOMAIN}`)
//         .filter(Boolean)[0];
//       if (customSubDomain) {
//         return NextResponse.rewrite(
//           new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
//         );
//       }
//     }

//     if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
//       return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
//     }

//     if (
//       url.pathname === "/" ||
//       (url.pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAIN)
//     ) {
//       return NextResponse.rewrite(new URL("/site", req.url));
//     }

//     if (
//       url.pathname.startsWith("/agency") ||
//       url.pathname.startsWith("/subaccount")
//     ) {
//       return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
//     }
//   }
// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };

import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ["/site", "/api/uploadthing"],
  async beforeAuth(auth, req) {},
  async afterAuth(auth, req) {
    //rewrite for domains
    const url = req.nextUrl;
    const searchParams = url.searchParams.toString();
    let hostname = req.headers;

    const pathWithSearchParams = `${url.pathname}${
      searchParams.length > 0 ? `?${searchParams}` : ""
    }`;

    //if subdomain exists
    const customSubDomain = hostname
      .get("host")
      ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
      .filter(Boolean)[0];

    if (customSubDomain) {
      return NextResponse.rewrite(
        new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
      );
    }

    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
      return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
    }

    if (
      url.pathname === "/" ||
      (url.pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAIN)
    ) {
      return NextResponse.rewrite(new URL("/site", req.url));
    }

    if (
      url.pathname.startsWith("/agency") ||
      url.pathname.startsWith("/subaccount")
    ) {
      return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
