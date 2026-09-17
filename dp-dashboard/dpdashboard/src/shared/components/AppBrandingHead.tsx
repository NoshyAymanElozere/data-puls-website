import { useEffect } from 'react'
import { useAppBranding } from '@/shared/hooks/useAppBranding'

function updateFaviconLinks(href: string) {
  const iconSelectors = ['link[rel="icon"]', 'link[rel="shortcut icon"]']
  iconSelectors.forEach((selector) => {
    document.querySelectorAll<HTMLLinkElement>(selector).forEach((el) => {
      el.href = href
    })
  })

  let primary = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!primary) {
    primary = document.createElement('link')
    primary.rel = 'icon'
    document.head.appendChild(primary)
  }
  primary.href = href
}

/** Syncs document title and crisp, enlarged favicon from backend app settings. */
export function AppBrandingHead() {
  const { appName, logoUrl } = useAppBranding('auto')

  useEffect(() => {
    if (appName) {
      document.title = appName
    }
  }, [appName])

  useEffect(() => {
    if (!logoUrl) return

    // If logo matches the default backend asset, our pre-rendered static
    // favicon-32x32 / favicon.ico are already perfectly cropped and ultra-sharp.
    if (logoUrl.includes('ChatGPT-Image')) {
      return
    }

    // Otherwise, attempt to load and auto-crop transparent whitespace dynamically
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = img.naturalWidth
        tempCanvas.height = img.naturalHeight
        const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true })
        if (!tempCtx) throw new Error('No 2d context')

        tempCtx.drawImage(img, 0, 0)
        const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
        const data = imgData.data

        let minX = tempCanvas.width
        let maxX = 0
        let minY = tempCanvas.height
        let maxY = 0
        let hasContent = false

        for (let y = 0; y < tempCanvas.height; y++) {
          for (let x = 0; x < tempCanvas.width; x++) {
            const alpha = data[(y * tempCanvas.width + x) * 4 + 3]
            if (alpha > 20) {
              hasContent = true
              if (x < minX) minX = x
              if (x > maxX) maxX = x
              if (y < minY) minY = y
              if (y > maxY) maxY = y
            }
          }
        }

        if (hasContent) {
          const contentW = maxX - minX + 1
          const contentH = maxY - minY + 1
          const maxDim = Math.max(contentW, contentH)
          const padding = Math.round(maxDim * 0.04)
          const squareSize = maxDim + padding * 2
          const cropX0 = (minX + maxX) / 2 - squareSize / 2
          const cropY0 = (minY + maxY) / 2 - squareSize / 2

          const canvas = document.createElement('canvas')
          canvas.width = 64
          canvas.height = 64
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'
            ctx.drawImage(tempCanvas, cropX0, cropY0, squareSize, squareSize, 0, 0, 64, 64)
            const croppedDataUrl = canvas.toDataURL('image/png')
            updateFaviconLinks(croppedDataUrl)
            return
          }
        }
      } catch {
        // In case of CORS or canvas restrictions, fallback to original logoUrl
      }
      updateFaviconLinks(logoUrl)
    }

    img.onerror = () => {
      updateFaviconLinks(logoUrl)
    }

    img.src = logoUrl
  }, [logoUrl])

  return null
}

