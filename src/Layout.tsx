import type { PropsWithChildren } from 'react'
import { lazy, Suspense, useMemo } from 'react'

import RenderLayoutSections from 'src/components/cms/RenderLayoutSections'
import { useCMS } from 'src/components/cms/useCMS'
import Footer from 'src/components/common/Footer'
import Navbar from 'src/components/common/Navbar'
import Toast from 'src/components/common/Toast'
import RegionalizationBar from 'src/components/regionalization/RegionalizationBar'
import { useUI } from 'src/sdk/ui/Provider'

const CartSidebar = lazy(() => import('src/components/cart/CartSidebar'))
const RegionModal = lazy(
  () => import('src/components/regionalization/RegionalizationModal')
)

function Layout({ children }: PropsWithChildren) {
  const { cart: displayCart, modal: displayModal } = useUI()

  const options = useMemo(() => ({ contentType: 'globalAlert' }), [])
  const page = useCMS(options)

  return (
    <>
      <RenderLayoutSections sections={page?.sections} />

      <Navbar />

      <Toast />

      <main>
        <RegionalizationBar classes="display-mobile" />
        {children}
      </main>

      <Footer />

      {displayCart && (
        <Suspense fallback={null}>
          <CartSidebar />
        </Suspense>
      )}

      {displayModal && (
        <Suspense fallback={null}>
          <RegionModal />
        </Suspense>
      )}
    </>
  )
}

export default Layout
