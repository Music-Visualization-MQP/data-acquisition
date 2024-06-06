import { SupabaseClient, createClient } from "@supabase/supabase-js";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.ANON);
// Create a single supabase client for interacting with your database
const supabase : SupabaseClient = createClient(
  process.env.SB_URL as string,
  process.env.SERVICE as string,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
) as SupabaseClient;

async function func() {
  const { data: credsData, error: grabError } = await supabase.from('spotify_credentials').select('*')
  return { credsData, grabError };
}

func().then((ret) => console.log(ret));
