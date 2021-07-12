import React, { lazy, useContext } from 'react'
import { Route, Router, Switch } from 'react-router-dom'

import GlobalStyle from './style/Global'
import PageLoader from './components/PageLoader'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import history from './routerHistory'

import { ThemeContext } from 'contexts/ThemeContext'
import './config/i186n/i186n'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Home = lazy(() => import('./views/Home'))
const NotFound = lazy(() => import('./views/NotFound'))

const App: React.FC = () => {
  const { themeMatch } = useContext(ThemeContext)
  return (
    <Router history={history}>
      <GlobalStyle themeMatch={themeMatch} />
      <SuspenseWithChunkError fallback={<PageLoader />}>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          {/* 404 */}
          <Route component={NotFound} />
        </Switch>
      </SuspenseWithChunkError>
    </Router>
  )
}

export default React.memo(App)
