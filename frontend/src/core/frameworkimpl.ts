import { FrameworkFrontend } from './framework'
import { VisPlugin } from './visplugin'
import { DataPluginFrontend } from './dataplugin'
import { loadDataPlugins, loadVisPlugins } from '../pluginloader'

class FrameworkFrontendImpl implements FrameworkFrontend {
  #currentDataPlugin: DataPluginFrontend | null = null
  #currentVisPlugin: VisPlugin | null = null
  #registeredDataPlugins: DataPluginFrontend[] = []
  #registeredVisPlugins: VisPlugin[] = []
  #dataPluginMap: Map<string, DataPluginFrontend> = new Map<string, DataPluginFrontend>()
  #visPluginMap: Map<string, VisPlugin> = new Map<string, VisPlugin>()
  #resultJson: JSON | null = null
  #images: string[] = []

  constructor () {
    this.#registeredDataPlugins = []
    this.#registeredVisPlugins = []
    loadVisPlugins().forEach(p => {
      console.log('Registering visualization plugin frontend' + p.getName())
      this.registerVisPlugin(p)
    })

    loadDataPlugins().forEach(p => {
      console.log('Registering data plugin frontend' + p.getName())
      this.registerDataPlugin(p)
    })
  }

  getData (): JSON {
    return (this.#resultJson != null) ? this.#resultJson : JSON.parse('{}')
  }

  getImages (): string[] {
    return this.#images
  }

  /**
   * Return a promise that sends the current form data to the backend to
   * begin the image producing and Cloud Vision call and awaits a response
   * including the images and the annotation information.
   */
  async sendData (): Promise<void> {
    const formData = this.#currentDataPlugin?.getFormData()

    const response = await fetch('/image', {
      method: 'POST',
      body: formData
    })
    const json = await response.json()
    this.#resultJson = json
    this.#images = json.imagesources
  }

  /**
   * Register a frontend data plugin. A plugin must be registered to be recognized
   * and selectable by users.
   * @param plugin The plugin to register
   */
  registerDataPlugin (plugin: DataPluginFrontend): void {
    plugin.onRegister()
    this.#registeredDataPlugins.push(plugin)
    this.#dataPluginMap.set(plugin.getName(), plugin)
  }

  /**
   * Register a visualization data plugin. A plugin must be registered to be recognized
   * and selectable by users.
   * @param plugin The plugin to register
   */
  registerVisPlugin (plugin: VisPlugin): void {
    plugin.onRegister(this)
    this.#registeredVisPlugins.push(plugin)
    this.#visPluginMap.set(plugin.getName(), plugin)
  }

  /**
   * Return a promise that syncs the backend's active plugin to be the one
   * identifiable by the provided plugin name and awaits a response to confirm if
   * the plugin is available and active on the backend. Matching frontend and backend
   * data plugins need to have the same name.
   * @param pluginName The name of the data plugin to select.
   */
  async selectDataPlugin (pluginName: string): Promise<void> {
    const plugin = this.#dataPluginMap.get(pluginName)

    await fetch('/plugin', {
      method: 'POST',
      body: JSON.stringify({ name: pluginName })
    })

    this.#currentDataPlugin = (plugin != null) ? plugin : null
  }

  /**
   * Select a visualization plugin from the registered vis plugins to be active.
   * @param pluginName The name of the plugin to become active.
   */
  selectVisPlugin (pluginName: string): void {
    const plugin = this.#visPluginMap.get(pluginName)
    this.#currentVisPlugin = (plugin != null) ? plugin : null
  }

  /**
   * @returns A list of the registered data plugins' names.
   */
  getDataPluginsNames (): string[] {
    return this.#registeredDataPlugins.map((plugin: DataPluginFrontend) => {
      return plugin.getName()
    })
  }

  /**
   * @returns A list of the registered visualization plugins' names.
   */
  getVisPluginsNames (): string[] {
    return this.#registeredVisPlugins.map((plugin: VisPlugin) => {
      return plugin.getName()
    })
  }

  /**
   * @returns The JSX component associated with the active frontend data plugin,
   * or null if there isn't one actie.
   */
  getDataPluginComponent (handleSubmit: () => void): JSX.Element | null {
    return (this.#currentDataPlugin != null) ? this.#currentDataPlugin.render(handleSubmit) : null
  }

  /**
   * @returns The JSX component associated with the active visualization data plugin,
   * or null if there isn't one actie.
   */
  getVisPluginComponent (): JSX.Element | null {
    return (this.#currentVisPlugin != null) ? this.#currentVisPlugin.render() : null
  }

  /**
   * @returns The name of the active frontend data plugin,
   * or null if there isn't one active.
   */
  getCurrDataPluginName (): string | null {
    return (this.#currentDataPlugin != null) ? this.#currentDataPlugin.getName() : null
  }

  /**
   * @returns The description of the active frontend data plugin,
   * or null if there isn't one active.
   */
  getCurrDataPluginDescription (): string | null {
    return (this.#currentDataPlugin != null) ? this.#currentDataPlugin.getDescription() : null
  }

  /**
   * @returns The name of the active frontend visualization plugin,
   * or null if there isn't one active.
   */
  getCurrVisPluginName (): string | null {
    return (this.#currentVisPlugin != null) ? this.#currentVisPlugin.getName() : null
  }

  /**
   * @returns The description of the active frontend visualization plugin,
   * or null if there isn't one active.
   */
  getCurrVisPluginDescription (): string | null {
    return (this.#currentVisPlugin != null) ? this.#currentVisPlugin.getDescription() : null
  }
}

export { FrameworkFrontendImpl }
