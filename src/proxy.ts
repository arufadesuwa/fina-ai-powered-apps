import { type NextRequest } from "next/server";
import { supabaseProxy } from "./lib/supabase/proxy";

export async function proxy(request: NextRequest) {
    return await supabaseProxy(request);
}

export const config = {
    mather: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
    ]
}