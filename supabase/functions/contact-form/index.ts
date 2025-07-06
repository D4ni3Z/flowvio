import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log(`Function "contact-form" up and running!`)

serve(async (req) => {
  // Gestisce la richiesta pre-flight CORS per i browser
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Estrae i dati inviati dal form
    const { name, email, phone, event_date, message, user_id } = await req.json()

    // Valida i dati essenziali
    if (!name || !email || !message || !user_id) {
      return new Response(JSON.stringify({ error: 'Name, email, message, and user_id are required.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }
    
    // Crea un client Supabase con i permessi di amministratore per scrivere nel database
    // Usa le variabili d'ambiente del progetto Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Inserisce il nuovo lead nella tabella
    const { data, error } = await supabaseClient
      .from('leads')
      .insert({
        name,
        email,
        phone,
        event_date,
        message,
        user_id,
        source: 'Contact Form' // Possiamo tracciare l'origine
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Restituisce una risposta di successo
    return new Response(JSON.stringify({ success: true, lead: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    // Gestisce eventuali errori
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})