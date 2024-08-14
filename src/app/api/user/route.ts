//Make api route for user

import { getUser } from "@/actions/getUser";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

type ResponseData = { name: string, picture_url: string }
export async function GET(req: NextRequest, res: NextResponse) {
    const data = await getUser()
    console.log(`Is data null in api/user? ${data === null}`)

    return NextResponse.json(data)
}