import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { getCars } from '../../api/cars'
import { useAuth } from '../../auth/useAuth'
import type { Car } from '../../types'

export default function HomePage() {
  const { user, handleGoogleSuccess, logout } = useAuth()
  const navigate = useNavigate()
  const [cars, setCars] = useState<Car[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [maker, setMaker] = useState('')
  const [year, setYear] = useState('')
  const [model, setModel] = useState('')

  useEffect(() => {
    loadCars()
  }, [])

  const loadCars = async (filters = {}) => {
    try {
      setIsLoading(true)
      const data = await getCars(filters)
      setCars(data)
    } catch (error) {
      console.error('Failed to load cars:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilter = () => {
    loadCars({
      maker: maker || undefined,
      year: year ? parseInt(year) : undefined,
      model: model || undefined,
    })
  }

  const handleClearFilters = () => {
    setMaker('')
    setYear('')
    setModel('')
    loadCars()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">CR Autos</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">Hi, {user.fullName}</span>
                <button
                  onClick={() => navigate('/publish')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                >
                  + Publish Car
                </button>
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.error('Login failed')}
              />
            )}
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Maker</label>
            <input
              type="text"
              value={maker}
              onChange={e => setMaker(e.target.value)}
              placeholder="e.g. Toyota"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Year</label>
            <input
              type="number"
              value={year}
              onChange={e => setYear(e.target.value)}
              placeholder="e.g. 2020"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Model</label>
            <input
              type="text"
              value={model}
              onChange={e => setModel(e.target.value)}
              placeholder="e.g. Corolla"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleFilter}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            Search
          </button>
          <button
            onClick={handleClearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 px-2 py-2"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Car Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">Loading cars...</div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No cars found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map(car => (
              <div
                key={car.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/cars/${car.id}`)}
              >
                <img
                  src={car.photoUrls[0]}
                  alt={`${car.maker} ${car.model}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="font-bold text-gray-800 text-lg">
                    {car.maker} {car.model}
                  </h2>
                  <p className="text-gray-500 text-sm">{car.year}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {car.province}, {car.canton}
                  </p>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      window.open(car.whatsAppUrl, '_blank')
                    }}
                    className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-lg transition"
                  >
                    💬 Talk to the Seller
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}