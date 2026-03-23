import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCar } from '../../api/cars'
import type { Car } from '../../types'

export default function CarDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState<Car | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState(0)

  useEffect(() => {
    if (id) loadCar(parseInt(id))
  }, [id])

  const loadCar = async (carId: number) => {
    try {
      const data = await getCar(carId)
      setCar(data)
    } catch (error) {
      console.error('Failed to load car:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading...</div>
  if (!car) return <div className="text-center py-20 text-gray-400">Car not found.</div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to listings
          </button>
          <h1 className="text-xl font-bold text-blue-700">CR Autos</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden mb-6">
          <img
            src={car.photoUrls[selectedPhoto]}
            alt={`${car.maker} ${car.model}`}
            className="w-full h-80 object-cover"
          />
          <div className="flex gap-2 p-4 overflow-x-auto">
            {car.photoUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Photo ${index + 1}`}
                onClick={() => setSelectedPhoto(index)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${
                  selectedPhoto === index ? 'border-blue-500' : 'border-transparent'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {car.maker} {car.model} {car.year}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400 dark:text-gray-500">Maker</span>
              <p className="font-medium text-gray-800 dark:text-gray-100">{car.maker}</p>
            </div>
            <div>
              <span className="text-gray-400 dark:text-gray-500">Model</span>
              <p className="font-medium text-gray-800 dark:text-gray-100">{car.model}</p>
            </div>
            <div>
              <span className="text-gray-400 dark:text-gray-500">Year</span>
              <p className="font-medium text-gray-800 dark:text-gray-100">{car.year}</p>
            </div>
            <div>
              <span className="text-gray-400 dark:text-gray-500">Province</span>
              <p className="font-medium text-gray-800 dark:text-gray-100">{car.province}</p>
            </div>
            <div>
              <span className="text-gray-400 dark:text-gray-500">Canton</span>
              <p className="font-medium text-gray-800 dark:text-gray-100">{car.canton}</p>
            </div>
            <div>
              <span className="text-gray-400 dark:text-gray-500">District</span>
              <p className="font-medium text-gray-800 dark:text-gray-100">{car.district}</p>
            </div>
          </div>
        </div>

        <a
          href={car.whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-green-500 hover:bg-green-600 text-white text-center font-bold py-4 rounded-xl transition text-lg"
        >
          💬 Talk to the Seller via WhatsApp
        </a>
      </div>
    </div>
  )
}