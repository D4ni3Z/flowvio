// Questo file definisce gli header CORS per permettere alla nostra funzione
// di essere chiamata da qualsiasi sito web.

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
