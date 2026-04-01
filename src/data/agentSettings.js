// Agent Settings - Remote Control System
// This file controls 金龍's behavior and capabilities

export const DEFAULT_SETTINGS = {
  // Model settings
  model: 'minimax/MiniMax-M2.7',
  
  // Feature flags
  features: {
    // Can use web search
    webSearch: true,
    // Can modify files
    fileWrite: true,
    // Can execute commands (with approval)
    exec: true,
    // Can send messages
    messaging: true,
    // AI features enabled
    aiAssistant: true,
  },
  
  // Behavior flags
  behavior: {
    // Respond in Cantonese
    cantoneseOnly: true,
    // Use formal or casual tone
    formalTone: false,
    // Show thinking process
    showReasoning: false,
    // Auto-approve certain actions
    autoApprove: false,
  },
  
  // Restrictions
  restrictions: {
    // Maximum exec timeout in seconds
    maxExecTimeout: 120,
    // Maximum messages per day
    maxMessagesPerDay: 1000,
    // Allowed file paths (empty = all allowed)
    allowedPaths: [],
    // Blocked commands
    blockedCommands: ['rm -rf /', 'dd if=', 'mkfs'],
  },
  
  // Metadata
  _version: '1.0',
  _lastUpdated: new Date().toISOString(),
  _updatedBy: 'system',
}

// Load settings from localStorage (simulating remote config)
export function loadSettings() {
  try {
    const saved = localStorage.getItem('hk_agent_settings')
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
    }
  } catch (e) {
    console.error('Failed to load settings:', e)
  }
  return DEFAULT_SETTINGS
}

// Save settings to localStorage
export function saveSettings(settings) {
  try {
    localStorage.setItem('hk_agent_settings', JSON.stringify({
      ...settings,
      _lastUpdated: new Date().toISOString(),
    }))
    return true
  } catch (e) {
    console.error('Failed to save settings:', e)
    return false
  }
}

// Check if a feature is enabled
export function isFeatureEnabled(feature) {
  const settings = loadSettings()
  return settings.features[feature] ?? true
}

// Check if a command is allowed
export function isCommandAllowed(cmd) {
  const settings = loadSettings()
  const blocked = settings.restrictions.blockedCommands || []
  return !blocked.some(blocked => cmd.includes(blocked))
}

// Get current settings as JSON
export function getSettingsJSON() {
  return JSON.stringify(loadSettings(), null, 2)
}
