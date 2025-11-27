import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonical?: string
  ogImage?: string
  ogType?: string
  noindex?: boolean
}

const SITE_URL = 'https://shellycli.tech'

export function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage = `${SITE_URL}/og-image.png`,
  ogType = 'website',
  noindex = false,
}: SEOProps) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title
    }

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }
      element.content = content
    }

    // Update or create property meta tags (for Open Graph)
    const updatePropertyMetaTag = (property: string, content: string) => {
      updateMetaTag(property, content, 'property')
    }

    // Description
    if (description) {
      updateMetaTag('description', description)
      updatePropertyMetaTag('og:description', description)
      updateMetaTag('twitter:description', description, 'name')
    }

    // Keywords
    if (keywords) {
      updateMetaTag('keywords', keywords)
    }

    // Canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
      if (!canonicalLink) {
        canonicalLink = document.createElement('link')
        canonicalLink.rel = 'canonical'
        document.head.appendChild(canonicalLink)
      }
      canonicalLink.href = canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical}`
    }

    // Open Graph tags
    if (title) {
      updatePropertyMetaTag('og:title', title)
      updateMetaTag('twitter:title', title, 'name')
    }

    updatePropertyMetaTag('og:image', ogImage)
    updateMetaTag('twitter:image', ogImage, 'name')
    updatePropertyMetaTag('og:type', ogType)

    // Update og:url
    const currentUrl = canonical || window.location.pathname
    updatePropertyMetaTag('og:url', currentUrl.startsWith('http') ? currentUrl : `${SITE_URL}${currentUrl}`)
    updateMetaTag('twitter:url', currentUrl.startsWith('http') ? currentUrl : `${SITE_URL}${currentUrl}`, 'name')

    // Robots
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow')
  }, [title, description, keywords, canonical, ogImage, ogType, noindex])

  return null
}

