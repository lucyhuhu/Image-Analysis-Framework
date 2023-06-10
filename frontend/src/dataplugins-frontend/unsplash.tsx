/**
 * Unsplash Data Plugin
 *
 * This data plugin will use the Unsplash API, found at
 * https://unsplash.com/developers, and will randomly return one image
 * from the dataset. The front-end will provide that one image.
 */

import React from 'react'
import { DataPluginFrontend } from '../core/dataplugin'

class Unsplash implements DataPluginFrontend {
  #pluginName: string = 'Unsplash'
  #description: string = "We'll get a random photo from Unsplash for your visualizations!"
  #url: string = ''
  #formData: FormData | null = null

  /**
   * Gets the name of the plugin.
   */
  getName (): string {
    return this.#pluginName
  }

  /**
   * Gets the description of this plugin
   */
  getDescription (): string {
    return this.#description
  }

  /**
   * Renders frontend component for this plugin
   */
  render (handleSubmit: () => void): JSX.Element {
    const getImage = async (): Promise<void> => {
      const unsplashApiKey = process.env.REACT_APP_UNSPLASH_API_KEY
      if (unsplashApiKey == null || unsplashApiKey.length === 0) {
        throw new Error('Unsplash API key is not set')
      }
      const unsplashApiCall = `https://api.unsplash.com/photos/random/?client_id=${unsplashApiKey}`

      const response = await fetch(unsplashApiCall)
      const jsonData = await response.json()
      this.#url = jsonData.urls.regular
      this.#formData = new FormData()
      this.#formData.append('image', this.#url)

      handleSubmit()
    }

    return (
      <button onClick={getImage}>Get Unsplash Image</button>
    )
  }

  /**
   * Gets the form data to send to framework
   */
  getFormData (): FormData | null {
    return this.#formData
  }

  /**
   * Called (only once) when the plug-in is first registered with the
   * framework, giving the plug-in a chance to perform any initial set-up
   * (if necessary).
   */
  onRegister (): void {}
}

function init (): DataPluginFrontend {
  return new Unsplash()
}

export { init }
