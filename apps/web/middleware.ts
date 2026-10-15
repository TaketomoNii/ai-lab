import { withAuth } from "next-auth/middleware";

export default withAuth({ pages: { signIn: "/login" } });

export const config = { matcher: ["/protected/:path*", "/decks/:path*", "/editor", "/editor/:path*"] };
