import { prisma } from '@/lib/prisma'

export default async function AdminHome() {
  const [totalPosts, publishedPosts, draftPosts, categories] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.count({ where: { status: 'DRAFT' } }),
    prisma.category.count(),
  ])

  const latest = await prisma.post.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 5,
    select: { id: true, title: true, status: true, updatedAt: true },
  })

  return (
    <main>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-6"><div className="text-slate-500 text-sm">Total posts</div><div className="text-3xl font-bold">{totalPosts}</div></div>
          <div className="card p-6"><div className="text-slate-500 text-sm">Published</div><div className="text-3xl font-bold text-green-600">{publishedPosts}</div></div>
          <div className="card p-6"><div className="text-slate-500 text-sm">Drafts</div><div className="text-3xl font-bold text-amber-600">{draftPosts}</div></div>
          <div className="card p-6"><div className="text-slate-500 text-sm">Categories</div><div className="text-3xl font-bold">{categories}</div></div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Latest articles</h2>
        <div className="card p-4 divide-y">
          {latest.length === 0 && <div className="p-4 text-slate-500">No posts yet</div>}
          {latest.map((p) => (
            <div key={p.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-slate-500">{p.status} · {new Date(p.updatedAt).toLocaleString()}</div>
              </div>
              <a className="text-brand-green text-sm" href={`/admin/posts/${p.id}`}>Open →</a>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
