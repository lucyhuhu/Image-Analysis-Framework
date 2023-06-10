import { Plugin } from './plugin'
/**
 * The data plugin frontend interface that plug-ins use to implement and register
 * with the {@link FrameworkFrontend}.
 */
interface DataPluginFrontend extends Plugin {

  /**
   * Gets the form data to send to framework
   */
  getFormData: () => FormData | null

  /**
   * Called (only once) when the plug-in is first registered with the
   * framework, giving the plug-in a chance to perform any initial set-up
   * (if necessary).
   */
  onRegister: () => void

  /**
   * Renders frontend component for this plugin
   */
  render: (handleSubmit: () => void) => JSX.Element

}

export type { DataPluginFrontend }
