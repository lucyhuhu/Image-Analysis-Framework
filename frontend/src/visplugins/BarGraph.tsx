/**
 * Bar Graph Visualization Plugin
 *
 * Generates a bar graph of the 8 strongest signals among all images.
 */

import React from 'react'
import { VisPlugin } from '../core/visplugin'
import { FrameworkFrontend } from '../core/framework'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

class BarGraphPlugin implements VisPlugin {
  #pluginName: string = 'Bar Graph'
  #description: string = 'Bar graph based on the top 8 labels detected from the images!'
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
    const labels = []
    const scores = []

    let allDetections: any = []
    for (let i = 0; i < responseData.length; i++) {
      const currColors = responseData[i].responses.LABEL_DETECTION
      allDetections = allDetections.concat(currColors)
    }

    allDetections.sort((a: any, b: any) =>
      (a['google.cloud.vision.v1.EntityAnnotation.score'] > b['google.cloud.vision.v1.EntityAnnotation.score'])
        ? -1
        : ((b['google.cloud.vision.v1.EntityAnnotation.score'] > a['google.cloud.vision.v1.EntityAnnotation.score']) ? 1 : 0))

    let i = 0
    while (i < 8 && i < allDetections.length) {
      const detection = allDetections[i]
      labels.push(detection['google.cloud.vision.v1.EntityAnnotation.description'])
      scores.push(detection['google.cloud.vision.v1.EntityAnnotation.score'])
      i++
    }

    const options = {
      indexAxis: 'y' as const,
      elements: {
        bar: {
          borderWidth: 0
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
          position: 'right' as const
        }
      }
    }

    const data = {
      labels,
      datasets: [
        {
          data: scores,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)'
        }
      ]
    }

    return (
      <Bar
        options={options}
        data={data}
        height={300}
        width={700}
      />
    )
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
  return new BarGraphPlugin()
}

export { init }
