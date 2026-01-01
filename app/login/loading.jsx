export default function Loading() {
  return (
    <div className="login-page min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <div className="text-center">
        <div className="spinner border-4 border-emerald-500 border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto mb-4"></div>
        <p className="text-emerald-700">Loading...</p>
      </div>
    </div>
  );
}

