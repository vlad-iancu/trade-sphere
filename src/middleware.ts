// import { auth } from "@/auth"

import { auth } from "@/auth"
import { NextResponse } from "next/server";

// import { NextRequest } from "next/server";

//export { auth as middleware } from "@/auth"

// export async function middleware(request: NextRequest) {
//     auth()

// }

export default auth((req) => {
    //const headers = new Headers(req.headers);
    //console.log(headers)
    req.headers.set("x-current-path", req.nextUrl.pathname);
    //headers.set("x-current-path", req.nextUrl.pathname);
    return NextResponse.next({ /*headers,*/ request: req });
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)",]
}
