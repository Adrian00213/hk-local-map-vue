import { useState } from 'react'
import { X, Link2, Check } from 'lucide-react'

export default function ShareModal({ marker, onClose }) {
  const [copied, setCopied] = useState(false)

  const shareUrl = `https://adrian00213.github.io/hk-local-map/?lat=${marker.lat}&lng=${marker.lng}&title=${encodeURIComponent(marker.title)}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: marker.title,
          text: `${marker.title} - ${marker.description || ''}`,
          url: shareUrl
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err)
        }
      }
    } else {
      copyToClipboard()
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            分享地點
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Title */}
          <div className="text-center">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {marker.title}
            </h3>
            {marker.description && (
              <p className="text-sm text-gray-500 mt-1">{marker.description}</p>
            )}
          </div>

          {/* URL */}
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-300 truncate"
            />
            <button
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-primary text-white hover:bg-opacity-90'
              }`}
            >
              {copied ? (
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  已複製
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Link2 className="w-4 h-4" />
                  複製
                </span>
              )}
            </button>
          </div>

          {/* Share Button */}
          <button
            onClick={shareViaWebShare}
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            分享俾朋友
          </button>

          {/* Social Share */}
          <div className="flex justify-center gap-4 pt-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(marker.title + ' ' + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xl hover:opacity-90"
            >
              💬
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl hover:opacity-90"
            >
              f
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(marker.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-xl hover:opacity-90"
            >
              𝕏
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
