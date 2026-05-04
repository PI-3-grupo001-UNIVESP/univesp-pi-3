import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lytbaqklqzmuyhsznhkc.supabase.co";
const supabaseKey = "sb_publishable_inpB0utBimkCfAhrICrVrw_FAfXxUMs";

export const supabase = createClient(supabaseUrl, supabaseKey);