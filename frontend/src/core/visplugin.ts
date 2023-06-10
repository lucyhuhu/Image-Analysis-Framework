import { FrameworkFrontend } from './framework'
import { Plugin } from './plugin'
/**
 * The visualization plugin frontend interface that
 * plug-ins use to implement and register with the {@link FrameworkFrontend}.
 */
interface VisPlugin extends Plugin {

  /**
   * Called (only once) when the plug-in is first registered with the
   * framework, giving the plug-in a chance to perform any initial set-up
   * (if necessary).
   *  @param framework The {@link FrameworkFrontend} instance with which the plugin
    *                  was registered.
   */
  onRegister: (framework: FrameworkFrontend) => void

  /**
   * Renders frontend component for this plugin
   */
  render: () => JSX.Element

}

export type { VisPlugin }
