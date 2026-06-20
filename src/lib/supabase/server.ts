import { environment } from "@/config/environment";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers"

export const createClient = async () => {
    const cookieStore = await cookies();
    return createServerClient(environment.supabaseKey!, environment.supabaseUrl!, {cookies:{getAll(){return cookieStore.getAll()}, setAll(cookiesToSet){try{cookiesToSet.forEach(({name, value, options})=>cookieStore.set(name, value, options))}catch{}}}})
}