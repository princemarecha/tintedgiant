export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/trucks/:path*", "/expenses/:path*", "/journeys/:path*", "/customs/:path*","/my_account/:path*"], // Matches root and all subpaths under /employees
};
