
/**
 * The interface by which {@link DataPluginFrontend} and {@link VisPlugin} instances
 * can directly interact with the framework.
 */
interface FrameworkFrontend {
  /**
   * Gets processed images data.
   */
  getData: () => JSON

  /**
   * Gets the images in base64 strings.
   */
  getImages: () => string[]
}

export type { FrameworkFrontend }
