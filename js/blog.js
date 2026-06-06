// Blog loader: fetch posts from Supabase if configured
(function(){
  document.addEventListener('DOMContentLoaded', async () => {
    const list = document.getElementById('blog-list');
    if (!list) return;

    const client = window.SUPABASE;
    if (!client) return; // enhancements.js will render fallback

    try {
      const { data, error } = await client
        .from('posts')
        .select('id,title,excerpt,created_at,published')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(12);
      if (error) throw error;

      list.innerHTML = '';
      if (!data || data.length === 0) {
        const empty = document.getElementById('blog-empty');
        if (empty) empty.textContent = 'No posts yet. Check back soon!';
        return;
      }

      data.forEach(p => {
        const card = document.createElement('article');
        card.className = 'blog-card';
        const h3 = document.createElement('h3');
        h3.textContent = p.title || 'Untitled';
        const ex = document.createElement('p');
        ex.className = 'blog-excerpt';
        ex.textContent = p.excerpt || '';
        const meta = document.createElement('div');
        meta.className = 'blog-meta';
        const d = p.created_at ? new Date(p.created_at) : new Date();
        meta.textContent = d.toLocaleDateString();
        card.appendChild(h3); card.appendChild(ex); card.appendChild(meta);
        list.appendChild(card);
      });
    } catch (err) {
      console.error('Blog load failed', err);
      const empty = document.getElementById('blog-empty');
      if (empty) empty.textContent = 'Could not load posts right now.';
    }
  });
})();
