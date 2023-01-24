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
import { PenpalProvider } from 'features/penpal/PenpalProvider'
import { ActionProvider } from 'features/action/ActionProvider'

export const App = () => {
  return (
    <Router>
      <ActionProvider>
        <PenpalProvider>
          <AuthProvider>
            <PolybaseProvider polybase={polybase}>
              <ChakraProvider theme={theme}>
                <PostHogPageView />
                <ScrollToTop />
                <AppRoutes />
              </ChakraProvider>
            </PolybaseProvider>
          </AuthProvider>
        </PenpalProvider>
      </ActionProvider>
    </Router>
  )
}
