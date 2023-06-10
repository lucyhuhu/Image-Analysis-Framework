import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './core/App'

import { FrameworkFrontendImpl } from './core/frameworkimpl'

const framework = new FrameworkFrontendImpl()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <App framework={framework} />
  </React.StrictMode>
)
