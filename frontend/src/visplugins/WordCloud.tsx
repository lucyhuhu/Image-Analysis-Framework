/**
 * Word Cloud Visualization Plugin
 *
 * Generates a word cloud based on the labels and object detection results, with
 * word size being dictated by signal strength.
 */

import { VisPlugin } from '../core/visplugin'
import { FrameworkFrontend } from '../core/framework'
import ReactWordcloud from 'react-wordcloud'

class WordCloudPlugin implements VisPlugin {
  #pluginName: string = 'Word Cloud'
  #description: string = 'Word cloud based on the labels and objects detected from the images!'
  #framework: FrameworkFrontend | null = null

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
  render (): JSX.Element {
    const wordCount = new Map<string, number>()
    const responseData = JSON.parse(JSON.stringify(this.#framework?.getData())).annotations

    let allWords: any = []
    let allLabels: any = []
    const words = []
    for (let i = 0; i < responseData.length; i++) {
      const currWords = responseData[i].responses.OBJECT_LOCALIZATION
      const currLabels = responseData[i].responses.LABEL_DETECTION
      allWords = allWords.concat(currWords)
      allLabels = allLabels.concat(currLabels)
    }

    let i = 0
    while (i < allWords.length) {
      const word = allWords[i].name
      const score = allLabels[i].score
      const count = wordCount.get(word) ?? 0
      if (count < 2) {
        words.push({ text: word, value: score })
      }
      wordCount.set(word, count + 1)
      i++
    }

    let j = 0
    while (j < allLabels.length) {
      const label = allLabels[j]['google.cloud.vision.v1.EntityAnnotation.description']
      const score = allLabels[j]['google.cloud.vision.v1.EntityAnnotation.score']
      const count = wordCount.get(label) ?? 0
      if (count < 2) {
        words.push({ text: label, value: score })
      }
      wordCount.set(label, count + 1)
      j++
    }

    if (words.length > 0) {
      return (
        <ReactWordcloud
          options={{
            fontSizes: [25, 60]
          }}
          words={words}
          size={[600, 300]}
        />
      )
    } else {
      return (
        <p>No words found</p>
      )
    }
  }

  /**
     * Called (only once) when the plug-in is first registered with the
     * framework, giving the plug-in a chance to perform any initial set-up
     * (if necessary).
     */
  onRegister (framework: FrameworkFrontend): void {
    this.#framework = framework
  }
}

function init (): VisPlugin {
  return new WordCloudPlugin()
}

export { init }
