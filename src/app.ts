import { createClient } from '@supabase/supabase-js'
import express from 'express';
import dotenv from 'dotenv';

require('dotenv').config()

const env = process.env.NODE_ENV;



// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SB_URL as string, process.env.ANON as string)