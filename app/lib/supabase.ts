import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://qaarwurjmxckxyvehhzy.supabase.co',
  'sb_publishable_Fxh-dld3zgf-l-BJn38WlA_6BxFxI3i'
)

export const intasendKey = process.env.NEXT_PUBLIC_INTASEND_KEY || 'ISPubKey_test_b77c9031-302c-4e7a-a36f-ec47c2ebb5ca'