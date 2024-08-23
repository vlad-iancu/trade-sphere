// import { auth } from "@/auth"

import { auth } from "@/auth"
import { NextResponse } from "next/server";

// import { NextRequest } from "next/server";

export { auth as middleware } from "@/auth"

// export async function middleware(request: NextRequest) {
//     auth()

// }


export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)",]
}
