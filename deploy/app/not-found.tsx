export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Page introuvable</h1>
        <p className="text-white/70 mb-6">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <a
          href="/"
          className="inline-block px-6 py-3 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  )
}
