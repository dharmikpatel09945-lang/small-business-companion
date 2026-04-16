import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  "https://eudjxkvoornjeirfehjj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1ZGp4a3Zvb3JuamVpcmZlaGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjM0MTEsImV4cCI6MjA5MDkzOTQxMX0.TLgzSclVnE6MzhOwiRO03E9TZTKDi9Gz7qRA9DM-FXQ"
)

async function testSign() {
  const email = `test-${Date.now()}@example.com`;
  const password = "password123";
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })
  console.log("Sign up result:", data)
  console.log("Sign up error:", error)
}
testSign()
