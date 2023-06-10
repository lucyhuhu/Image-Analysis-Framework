/**
 * Local Upload Data Plugin
 *
 * This plugin allows users to upload their own images to run through the Google
 * Cloud Vision API
 */

import React, { ChangeEvent } from 'react'
import { DataPluginFrontend } from '../core/dataplugin'

class UploadPluginFrontend implements DataPluginFrontend {
  #pluginName: string = 'Upload Files'
  #description: string = "We'll use your upload files for your visualization"
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
    let files: FileList | null

    const handleFile = (e: ChangeEvent<HTMLInputElement>): void => {
      e.preventDefault()
      files = e.target.files
    }

    const handleFormSubmit = (e: React.FormEvent): void => {
      e.preventDefault()
      this.#formData = new FormData()
      if (files !== null && files !== undefined) {
        for (let i = 0; i < files.length; i++) {
          this.#formData.append('files', files[i])
        }
        handleSubmit()
      }
    }

    const formElement = (
      <form onSubmit={handleFormSubmit}>
        <input
          onChange={handleFile}
          name='file'
          type='file'
          id='formFileMultiple'
          accept='image/*'
          multiple
        />
        <button type='submit'>Upload</button>
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
  return new UploadPluginFrontend()
}

export { init }
