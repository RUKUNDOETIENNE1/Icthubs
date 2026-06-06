export default function Page() {
  return (
    <main className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">ICTHubs Content Engine</h1>
        <p className="text-slate-600 mt-2">Admin dashboard scaffold is ready. Next: auth + protected routes.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-2">Posts</h2>
          <p className="text-slate-600">Create, edit, publish and schedule articles.</p>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-2">Media Library</h2>
          <p className="text-slate-600">Upload and manage images, videos and files.</p>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-2">Categories & Tags</h2>
          <p className="text-slate-600">Organize content and improve discoverability.</p>
        </div>
      </div>
    </main>
  )
}
