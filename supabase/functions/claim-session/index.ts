import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { anonymousUserId, authenticatedUserId } = await req.json()

    if (!anonymousUserId || !authenticatedUserId) {
      return new Response(
        JSON.stringify({ error: 'Missing anonymousUserId or authenticatedUserId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role key (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Transfer planning_sessions
    const { error: sessionError } = await supabase
      .from('planning_sessions')
      .update({ user_id: authenticatedUserId })
      .eq('user_id', anonymousUserId)

    if (sessionError) {
      console.error('Failed to transfer planning_sessions:', sessionError)
      return new Response(
        JSON.stringify({ error: `Failed to transfer planning_sessions: ${sessionError.message}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Transfer events
    const { error: eventError } = await supabase
      .from('events')
      .update({ user_id: authenticatedUserId })
      .eq('user_id', anonymousUserId)

    if (eventError) {
      console.error('Failed to transfer events:', eventError)
      return new Response(
        JSON.stringify({ error: `Failed to transfer events: ${eventError.message}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Session merge complete: ${anonymousUserId} → ${authenticatedUserId}`)
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
