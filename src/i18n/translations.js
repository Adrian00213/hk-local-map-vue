// Internationalization (i18n) Translation System
// Supports: Traditional Chinese, Simplified Chinese, English, Japanese

export const translations = {
  // Navigation
  'nav.map': { 'zh-HK': '地圖', 'zh-CN': '地图', 'en': 'Map', 'ja': 'マップ' },
  'nav.info': { 'zh-HK': '資訊', 'zh-CN': '资讯', 'en': 'Info', 'ja': '情報' },
  'nav.transport': { 'zh-HK': '交通', 'zh-CN': '交通', 'en': 'Transport', 'ja': '交通' },
  'nav.ai': { 'zh-HK': 'AI助理', 'zh-CN': 'AI助理', 'en': 'AI Assistant', 'ja': 'AIアシスタント' },
  'nav.profile': { 'zh-HK': '我的', 'zh-CN': '我的', 'en': 'Profile', 'ja': 'マイページ' },
  
  // Info Page
  'info.title': { 'zh-HK': '美食指南', 'zh-CN': '美食指南', 'en': 'Food Guide', 'ja': 'フードガイド' },
  'info.nearby': { 'zh-HK': '附近', 'zh-CN': '附近', 'en': 'Nearby', 'ja': '近く' },
  'info.top': { 'zh-HK': '人氣', 'zh-CN': '人气', 'en': 'Popular', 'ja': '人気' },
  'info.events': { 'zh-HK': '活動', 'zh-CN': '活动', 'en': 'Events', 'ja': 'イベント' },
  'info.chat': { 'zh-HK': '討論', 'zh-CN': '讨论', 'en': 'Chat', 'ja': 'チャット' },
  
  // Transport
  'transport.nearby': { 'zh-HK': '附近', 'zh-CN': '附近', 'en': 'Nearby', 'ja': '近く' },
  'transport.bus': { 'zh-HK': '巴士', 'zh-CN': '巴士', 'en': 'Bus', 'ja': 'バス' },
  'transport.mtr': { 'zh-HK': '港鐵', 'zh-CN': '地铁', 'en': 'MTR', 'ja': 'MRT' },
  'transport.traffic': { 'zh-HK': '路況', 'zh-CN': '路况', 'en': 'Traffic', 'ja': '交通状況' },
  
  // Profile
  'profile.title': { 'zh-HK': '我的', 'zh-CN': '我的', 'en': 'Profile', 'ja': 'マイページ' },
  'profile.favorites': { 'zh-HK': '我的收藏', 'zh-CN': '我的收藏', 'en': 'My Favorites', 'ja': 'お気に入り' },
  'profile.deals': { 'zh-HK': '我的優惠', 'zh-CN': '我的优惠', 'en': 'My Deals', 'ja': 'キャンペーン' },
  'profile.reviews': { 'zh-HK': '我的點評', 'zh-CN': '我的点评', 'en': 'My Reviews', 'ja': 'レビュー' },
  'profile.settings': { 'zh-HK': '設定', 'zh-CN': '设置', 'en': 'Settings', 'ja': '設定' },
  
  // Settings
  'settings.notifications': { 'zh-HK': '通知設定', 'zh-CN': '通知设置', 'en': 'Notifications', 'ja': '通知設定' },
  'settings.privacy': { 'zh-HK': '私隱設定', 'zh-CN': '隐私设置', 'en': 'Privacy', 'ja': 'プライバシー' },
  'settings.language': { 'zh-HK': '語言設定', 'zh-CN': '语言设置', 'en': 'Language', 'ja': '言語設定' },
  'settings.account': { 'zh-HK': '帳戶設定', 'zh-CN': '账户设置', 'en': 'Account', 'ja': 'アカウント' },
  'settings.push': { 'zh-HK': '推送通知', 'zh-CN': '推送通知', 'en': 'Push Notifications', 'ja': 'プッシュ通知' },
  'settings.sound': { 'zh-HK': '通知聲音', 'zh-CN': '通知声音', 'en': 'Sound', 'ja': 'サウンド' },
  'settings.darkMode': { 'zh-HK': '深色模式', 'zh-CN': '深色模式', 'en': 'Dark Mode', 'ja': 'ダークモード' },
  
  // Common
  'common.save': { 'zh-HK': '儲存', 'zh-CN': '保存', 'en': 'Save', 'ja': '保存' },
  'common.cancel': { 'zh-HK': '取消', 'zh-CN': '取消', 'en': 'Cancel', 'ja': 'キャンセル' },
  'common.confirm': { 'zh-HK': '確認', 'zh-CN': '确认', 'en': 'Confirm', 'ja': '確認' },
  'common.loading': { 'zh-HK': '載入中...', 'zh-CN': '载入中...', 'en': 'Loading...', 'ja': '読み込み中...' },
  'common.error': { 'zh-HK': '發生錯誤', 'zh-CN': '发生错误', 'en': 'Error', 'ja': 'エラー' },
  
  // Languages
  'lang.zh-HK': { 'zh-HK': '繁體中文', 'zh-CN': '繁体中文', 'en': '繁體中文', 'ja': '繁体中国語' },
  'lang.zh-CN': { 'zh-HK': '簡體中文', 'zh-CN': '简体中文', 'en': '简体中文', 'ja': '簡体中国語' },
  'lang.en': { 'zh-HK': 'English', 'zh-CN': 'English', 'en': 'English', 'ja': 'English' },
  'lang.ja': { 'zh-HK': '日本語', 'zh-CN': '日本語', 'en': '日本語', 'ja': '日本語' },
}

// Language code mapping
export const languageCodes = {
  '繁體中文': 'zh-HK',
  '简体中文': 'zh-CN',
  'English': 'en',
  '日本語': 'ja'
}

// Get translation
export const t = (key, locale = 'zh-HK') => {
  const translation = translations[key]
  if (!translation) return key
  return translation[locale] || translation['zh-HK'] || key
}

// Format number based on locale
export const formatNumber = (num, locale = 'zh-HK') => {
  const locales = {
    'zh-HK': 'zh-HK',
    'zh-CN': 'zh-CN',
    'en': 'en-US',
    'ja': 'ja-JP'
  }
  return new Intl.NumberFormat(locales[locale] || 'zh-HK').format(num)
}

// Format date based on locale
export const formatDate = (date, locale = 'zh-HK') => {
  const locales = {
    'zh-HK': 'zh-HK',
    'zh-CN': 'zh-CN',
    'en': 'en-US',
    'ja': 'ja-JP'
  }
  return new Intl.DateTimeFormat(locales[locale] || 'zh-HK').format(new Date(date))
}
