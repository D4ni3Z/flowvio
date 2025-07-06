import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Abbiamo aggiunto 'name' per personalizzare l'invito
interface InvitePayload {
  client_id: string;
  email: string;
  name: string; // Il nome del cliente
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { client_id, email, name }: InvitePayload = await req.json();

    if (!client_id || !email || !name) {
      return new Response(JSON.stringify({ error: 'client_id, email, and name are required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('PROJECT_URL') ?? '', // Nome aggiornato
      Deno.env.get('SERVICE_ROLE_KEY') ?? '' // Nome aggiornato
    );

    // --- LOGICA PRINCIPALE ---

    // 1. Creare l'utente nel sistema di autenticazione di Supabase
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      email_confirm: true, // L'utente viene creato come già confermato
      user_metadata: {
        full_name: name, // Possiamo salvare metadati utili
      },
    });

    if (userError) {
      // Se l'utente esiste già, Supabase restituisce un errore specifico
      if (userError.message.includes('User already registered')) {
         return new Response(JSON.stringify({ error: 'Un utente con questa email esiste già.' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 409, // 409 Conflict è lo status corretto per una risorsa che esiste già
        });
      }
      throw userError; // Per tutti gli altri errori, fermiamo l'esecuzione
    }

    // 2. Aggiornare la tabella 'clients' con il nuovo user_id
    const { error: updateError } = await supabaseAdmin
      .from('clients')
      .update({ user_id: userData.user.id }) // Colleghiamo l'ID del nuovo utente
      .eq('id', client_id); // Al cliente corretto

    if (updateError) {
      // Se l'aggiornamento fallisce, è un problema serio.
      // In un'app di produzione, qui si potrebbe aggiungere logica per cancellare l'utente appena creato.
      throw updateError;
    }

    return new Response(JSON.stringify({ message: `Invite sent successfully to ${email}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});