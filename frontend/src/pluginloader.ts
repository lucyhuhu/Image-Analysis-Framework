import { DataPluginFrontend } from './core/dataplugin'
import { VisPlugin } from './core/visplugin'
import { init as UploadPluginFrontendInit } from './dataplugins-frontend/upload'
import { init as UnsplashPluginFrontendInit } from './dataplugins-frontend/unsplash'
import { init as ScraperPluginFrontendInit } from './dataplugins-frontend/scraper'
import { init as PieChartPluginInit } from './visplugins/PieChart'
import { init as BarGraphPluginInit } from './visplugins/BarGraph'
import { init as WordCloudPluginInit } from './visplugins/WordCloud'

const dataPlugins: Array<() => DataPluginFrontend> = [
  UploadPluginFrontendInit,
  UnsplashPluginFrontendInit,
  ScraperPluginFrontendInit
]

const visPlugins: Array<() => VisPlugin> = [
  PieChartPluginInit,
  BarGraphPluginInit,
  WordCloudPluginInit
]

function loadDataPlugins (): DataPluginFrontend[] {
  return dataPlugins.map(pluginInit => pluginInit())
}

function loadVisPlugins (): VisPlugin[] {
  return visPlugins.map(pluginInit => pluginInit())
}

export { loadDataPlugins, loadVisPlugins }
