import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import '../globals.css'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-slate-900">
        <div className="container py-6">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">ICTHubs Admin</h1>
            <nav className="flex gap-4 text-sm">
              <a className="text-slate-700 hover:text-black" href="/admin">Dashboard</a>
              <a className="text-slate-700 hover:text-black" href="/admin/posts">Posts</a>
              <a className="text-slate-700 hover:text-black" href="/admin/categories">Categories</a>
              <a className="text-slate-700 hover:text-black" href="/admin/media">Media</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
