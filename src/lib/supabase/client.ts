import { environment } from "@/config/environment"
import { createBrowserClient } from "@supabase/ssr"

export const CreateCLient = () => createBrowserClient(environment.supabaseUrl!, environment.supabaseKey!)