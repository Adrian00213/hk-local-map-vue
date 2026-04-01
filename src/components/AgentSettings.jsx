import { useState, useEffect } from 'react'
import { Settings, Globe, Shield, Bot, Code, MessageCircle, Save, RotateCcw, Check, X } from 'lucide-react'

const DEFAULT_SETTINGS = {
  model: 'minimax/MiniMax-M2.7',
  features: {
    webSearch: true,
    fileWrite: true,
    exec: true,
    messaging: true,
    aiAssistant: true,
  },
  behavior: {
    cantoneseOnly: true,
    formalTone: false,
    showReasoning: false,
    autoApprove: false,
  },
  restrictions: {
    maxExecTimeout: 120,
    maxMessagesPerDay: 1000,
    allowedPaths: [],
    blockedCommands: ['rm -rf /', 'dd if=', 'mkfs'],
  },
}

export default function AgentSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('hk_agent_settings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
  }, [])

  const handleSave = () => {
    try {
      const settingsWithMeta = {
        ...settings,
        _lastUpdated: new Date().toISOString(),
        _updatedBy: 'Adrian',
      }
      localStorage.setItem('hk_agent_settings', JSON.stringify(settingsWithMeta))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error('Failed to save:', e)
    }
  }

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.removeItem('hk_agent_settings')
  }

  const toggleFeature = (key) => {
    setSettings(prev => ({
      ...prev,
      features: { ...prev.features, [key]: !prev.features[key] }
    }))
  }

  const toggleBehavior = (key) => {
    setSettings(prev => ({
      ...prev,
      behavior: { ...prev.behavior, [key]: !prev.behavior[key] }
    }))
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">🤖 金龍設定</h2>
            <p className="text-xs text-gray-500">控制 AI 助理行為</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
              saved 
                ? 'bg-green-500 text-white' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
            }`}
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? '已儲存' : '儲存'}
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-purple-500" />
          功能開關
        </h3>
        <div className="space-y-3">
          {[
            { key: 'webSearch', label: '🌐 網頁搜索', desc: '允許搜索網絡資訊' },
            { key: 'fileWrite', label: '📝 檔案寫入', desc: '允許修改專案檔案' },
            { key: 'exec', label: '💻 指令執行', desc: '允許運行系統指令' },
            { key: 'messaging', label: '💬 訊息發送', desc: '允許發送訊息' },
            { key: 'aiAssistant', label: '🤖 AI 助理', desc: '啟用 AI 助理功能' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
                onClick={() => toggleFeature(item.key)}
                className={`w-12 h-6 rounded-full transition-all relative ${
                  settings.features[item.key] ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  settings.features[item.key] ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Behavior Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <MessageCircle className="w-4 h-4 text-pink-500" />
          行為設定
        </h3>
        <div className="space-y-3">
          {[
            { key: 'cantoneseOnly', label: '🇭🇰 純廣東話', desc: '只使用廣東話回覆' },
            { key: 'formalTone', label: '📋 正式語氣', desc: '使用正式商業語氣' },
            { key: 'showReasoning', label: '🧠 顯示思考', desc: '顯示思考過程' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
                onClick={() => toggleBehavior(item.key)}
                className={`w-12 h-6 rounded-full transition-all relative ${
                  settings.behavior[item.key] ? 'bg-pink-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  settings.behavior[item.key] ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-green-500" />
          安全限制
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              最大指令超時 (秒)
            </label>
            <input
              type="number"
              value={settings.restrictions.maxExecTimeout}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                restrictions: { ...prev.restrictions, maxExecTimeout: parseInt(e.target.value) || 120 }
              }))}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              每日最大訊息數
            </label>
            <input
              type="number"
              value={settings.restrictions.maxMessagesPerDay}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                restrictions: { ...prev.restrictions, maxMessagesPerDay: parseInt(e.target.value) || 1000 }
              }))}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Current Settings JSON */}
      <div className="bg-gray-900 rounded-2xl p-4">
        <h3 className="font-semibold text-white mb-2">目前設定 (JSON)</h3>
        <pre className="text-xs text-green-400 overflow-auto max-h-40">
          {JSON.stringify(settings, null, 2)}
        </pre>
      </div>
    </div>
  )
}
