export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando información de pago...</p>
      </div>
    </div>
  )
}
