/**
 * Base AI Provider Class
 * Abstract class that all AI providers must extend
 */

import type { AIProviderConfig, IAIProvider } from '../types';

export abstract class AIBaseProvider implements IAIProvider {
  protected config?: AIProviderConfig;
  protected initialized: boolean = false;

  constructor(public readonly name: string) {}

  /**
   * Initialize the provider with configuration
   */
  async initialize(config: AIProviderConfig): Promise<void> {
    this.config = config;
    await this.onInitialize();
    this.initialized = true;
  }

  /**
   * Hook for provider-specific initialization
   */
  protected abstract onInitialize(): Promise<void>;

  /**
   * Check if provider is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Ensure provider is initialized before operations
   */
  protected ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error(`${this.name} provider is not initialized`);
    }
  }

  /**
   * Get configuration
   */
  protected getConfig(): AIProviderConfig {
    if (!this.config) {
      throw new Error(`${this.name} provider configuration is not set`);
    }
    return this.config;
  }
}
