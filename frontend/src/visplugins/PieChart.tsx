/**
 * Bar Graph Visualization Plugin
 *
 * Generates a pie chart of the most dominant colors with the images.
 */

import React from 'react'
import { VisPlugin } from '../core/visplugin'
import { FrameworkFrontend } from '../core/framework'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

class PieChartPlugin implements VisPlugin {
  #pluginName: string = 'Pie Chart'
  #description: string = 'Pie chart based on the top 8 dominant color from the images!'
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
    const responseData = JSON.parse(JSON.stringify(this.#framework?.getData())).annotations
    const dominantColors = []
    const fractions = []

    let allColors: any = []

    for (let i = 0; i < responseData.length; i++) {
      const currColors = responseData[i].responses.IMAGE_PROPERTIES
      allColors = allColors.concat(currColors)
    }

    allColors.sort((a: any, b: any) => (a.fraction > b.fraction) ? -1 : ((b.fraction > a.fraction) ? 1 : 0))

    let i = 0
    while (i < 8 && i < allColors.length) {
      const colors = allColors[i]
      dominantColors.push('rgba(' + String(colors.red) + ', ' + String(colors.green) + ', ' + String(colors.blue) + ', 1)')
      fractions.push(colors.fraction)
      i++
    }

    const data = {
      datasets: [
        {
          label: 'fraction: ',
          data: fractions,
          backgroundColor: dominantColors,
          borderWidth: 0
        }
      ]
    }

    return (<Pie data={data} />)
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
  return new PieChartPlugin()
}

export { init }
