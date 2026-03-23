import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCar } from '../../api/cars'
import { useAuth } from '../../auth/useAuth'
import { locations } from '../../data/locations'
import type { Province, Canton } from '../../data/locations'

export default function PublishPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const [maker, setMaker] = useState('')
  const [year, setYear] = useState('')
  const [model, setModel] = useState('')
  const [province, setProvince] = useState('')
  const [canton, setCanton] = useState('')
  const [district, setDistrict] = useState('')

  if (!user) {
    navigate('/')
    return null
  }

  const selectedProvince = locations.find((p: Province) => p.name === province)
  const selectedCanton = selectedProvince?.cantons.find((c: Canton) => c.name === canton)

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setPhotos(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const handleSubmit = async () => {
    if (!maker || !year || !model || !province || !canton || !district) {
      setError('All fields are required.')
      return
    }
    if (photos.length < 3) {
      setError('Please upload at least 3 photos.')
      return
    }

    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('maker', maker)
      formData.append('year', year)
      formData.append('model', model)
      formData.append('province', province)
      formData.append('canton', canton)
      formData.append('district', district)
      photos.forEach(photo => formData.append('photos', photo))

      const carId = await createCar(formData)
      navigate(`/cars/${carId}`)
    } catch {
      setError('Failed to publish. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            ← Back
          </button>
          <h1 className="text-xl font-bold text-blue-700">Publish a Car</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          {error && (
            <div className="bg-red-50 text-red-600 rounded-lg p-3 mb-4 text-sm">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="maker" className="block text-sm font-medium text-gray-700 mb-1">Maker</label>
              <input
                id="maker"
                type="text"
                value={maker}
                onChange={e => setMaker(e.target.value)}
                placeholder="e.g. Toyota"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                id="year"
                type="number"
                value={year}
                onChange={e => setYear(e.target.value)}
                placeholder="e.g. 2020"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input
                id="model"
                type="text"
                value={model}
                onChange={e => setModel(e.target.value)}
                placeholder="e.g. Corolla"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">Province</label>
              <select
                id="province"
                title="Province"
                value={province}
                onChange={e => { setProvince(e.target.value); setCanton(''); setDistrict('') }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select...</option>
                {locations.map((p: Province) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="canton" className="block text-sm font-medium text-gray-700 mb-1">Canton</label>
              <select
                id="canton"
                title="Canton"
                value={canton}
                onChange={e => { setCanton(e.target.value); setDistrict('') }}
                disabled={!province}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select...</option>
                {selectedProvince?.cantons.map((c: Canton) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <select
                id="district"
                title="District"
                value={district}
                onChange={e => setDistrict(e.target.value)}
                disabled={!canton}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select...</option>
                {selectedCanton?.districts.map((d: string) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Photos */}
          <div className="mb-6">
            <label htmlFor="photos" className="block text-sm font-medium text-gray-700 mb-1">
              Photos <span className="text-gray-400 text-xs">(minimum 3)</span>
            </label>
            <input
              id="photos"
              type="file"
              multiple
              accept="image/jpeg,image/png"
              title="Upload car photos"
              onChange={handlePhotos}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {previews.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {previews.map((src, i) => (
                  <img key={i} src={src} alt={`Preview ${i + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? 'Publishing...' : 'Publish Car'}
          </button>
        </div>
      </div>
    </div>
  )
}