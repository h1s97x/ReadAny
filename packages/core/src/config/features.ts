/**
 * ReadAny Pure - 功能开关配置
 * 
 * 此文件控制哪些功能启用/禁用
 * Pure 版本禁用所有 AI 相关功能
 */

export const FEATURES = {
  // AI 功能
  AI_CHAT: false,
  RAG: false,
  VECTOR_MODEL: false,
  SEMANTIC_SEARCH: false,
  
  // 非 AI 功能（保留）
  TTS: true,
  SYNC: true,
  EXPORT: true,
  STATS: true,
  TRANSLATION: true, // 仅保留 DeepL 等非 AI 翻译
} as const;

export type FeatureFlags = typeof FEATURES;

/**
 * 检查某个功能是否启用
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return FEATURES[feature] === true;
}
