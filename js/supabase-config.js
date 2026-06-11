// Supabase Configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
let supabase;

try {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (error) {
  console.error('Failed to initialize Supabase:', error);
}

// Newsletter subscription function
async function subscribeToNewsletter(email) {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .insert([{ email: email }])
    .select();

  if (error) {
    // Check if it's a duplicate email error
    if (error.code === '23505') {
      throw new Error('This email is already subscribed');
    }
    throw error;
  }

  return data;
}
