import { useState } from 'react'
import { completeProfile } from '../../api/auth'

export default function ProfilePage() {
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!fullName.trim() || !phoneNumber.trim()) {
      setError('Both fields are required.')
      return
    }

    try {
      setIsLoading(true)
      const result = await completeProfile(fullName, phoneNumber)
      localStorage.setItem('jwt', result.token)
      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user))
        window.location.reload()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Complete your profile</h1>
        <p className="text-gray-500 mb-6">We need a couple more details before you can publish a car.</p>

        {error && (
          <div className="bg-red-50 text-red-600 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="John Doe"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-gray-400 text-xs">(used for WhatsApp contact)</span>
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            placeholder="+506 8888 8888"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save and continue'}
        </button>
      </div>
    </div>
  )
}