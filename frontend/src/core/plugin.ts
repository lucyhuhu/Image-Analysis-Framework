interface Plugin {
  /**
   * Gets the name of the plugin.
   */
  getName: () => string

  /**
   * Gets the description of this plugin
   */
  getDescription: () => string
}

export type { Plugin }
