//Make api route for user

import { getUser } from "@/actions/user/getUser";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

type ResponseData = { name: string, picture_url: string }
export async function GET(req: NextRequest, res: NextResponse) {
    const data = await getUser()

    return NextResponse.json(data)
}