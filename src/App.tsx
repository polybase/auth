import {
  ChakraProvider,
} from '@chakra-ui/react'
import { BrowserRouter as Router } from 'react-router-dom'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import theme from './theme/theme'
import AppRoutes from './AppRoutes'
import ScrollToTop from 'modules/common/ScrollToTop'
import PostHogPageView from 'modules/common/PostHogPageView'
import { PolybaseProvider } from '@polybase/react'
import polybase from 'config/polybase'
import { AuthProvider } from 'features/auth/AuthProvider'

export const App = () => {
  return (
    <AuthProvider>
      <PolybaseProvider polybase={polybase}>
        <ChakraProvider theme={theme}>
          <Router>
            <PostHogPageView />
            <ScrollToTop />
            <AppRoutes />
          </Router>
        </ChakraProvider>
      </PolybaseProvider>
    </AuthProvider>
  )
}
