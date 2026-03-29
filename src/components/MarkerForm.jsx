import { useState } from 'react'
import { X } from 'lucide-react'
import { useMap, CATEGORY_LABELS, CATEGORY_ICONS } from '../context/MapContext'
import { useAuth } from '../context/AuthContext'

export default function MarkerForm({ onClose, user, onLoginRequired }) {
  const { addMarker, userLocation } = useMap()
  const [formData, setFormData] = useState({
    title: '',
    category: 'deals',
    description: '',
    imageUrl: '',
    contact: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      onLoginRequired()
      return
    }

    if (!formData.title.trim()) {
      setError('請輸入標題')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Use clicked location or user location as default
      const markerData = {
        ...formData,
        lat: userLocation?.lat || 22.3193,
        lng: userLocation?.lng || 114.1694,
        userId: user.uid
      }

      await addMarker(markerData)
      onClose()
    } catch (err) {
      setError('添加失敗，請重試')
      console.error('Error adding marker:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl animate-slideUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            添加新地點
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              地點名稱 *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="例如：麥當勞旺角店"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              分類 *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: key }))}
                  className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                    formData.category === key
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{CATEGORY_ICONS[key]}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              描述
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="描述這個地點..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              圖片連結
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              地址/聯絡
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="地址或聯絡電話"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '添加中...' : '添加到地圖'}
          </button>

          {/* Login Prompt */}
          {!user && (
            <p className="text-center text-sm text-gray-500">
              登入後可以添加地點
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
