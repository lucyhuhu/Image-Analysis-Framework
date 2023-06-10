/**
 * Web Scraper Data Plugin
 *
 * This data plugin will scrape a given URL for up to MAX_IMAGES images
 * with the <img> tag. The front-end data plugin will provide a URL to the back-end
 * to scrape.
 *
 * This plugin is contingent on the images being publicly available and resourced.
 * Any images that are not accessible are excluded from being scraped.
 */

import React, { ChangeEvent } from 'react'
import { DataPluginFrontend } from '../core/dataplugin'

class ScraperPluginFrontend implements DataPluginFrontend {
  #pluginName: string = 'Web Scraper'
  #description: string = "Submit a URL in the box below and we'll scrape the site for images."
  #formData: FormData | null = null
  #url: string = ''

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
    const handleNewText = (e: ChangeEvent<HTMLInputElement>): void => {
      e.preventDefault()
      this.#url = e.target.value
      console.log(this.#url)
    }

    const handleFormSubmit = (e: React.FormEvent): void => {
      e.preventDefault()
      this.#formData = new FormData()
      if (this.#url.length !== 0) {
        this.#formData.append('url', this.#url)
        handleSubmit()
      }
    }

    const formElement = (
      <form onSubmit={handleFormSubmit}>
        <input
          onChange={handleNewText}
          name='url'
          type='text'
          id='scraperFormText'
          className='formText'
        />
        <button type='submit'>Scrape</button>
      </form>
    )
    return formElement
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
  return new ScraperPluginFrontend()
}

export { init }
