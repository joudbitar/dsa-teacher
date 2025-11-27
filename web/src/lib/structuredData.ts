const SITE_URL = 'https://shellycli.tech'

export interface OrganizationSchema {
  '@context': string
  '@type': string
  name: string
  url: string
  logo?: string
  description?: string
  sameAs?: string[]
}

export interface WebsiteSchema {
  '@context': string
  '@type': string
  name: string
  url: string
  description: string
  publisher: {
    '@type': string
    name: string
  }
}

export interface SoftwareApplicationSchema {
  '@context': string
  '@type': string
  name: string
  applicationCategory: string
  operatingSystem: string
  description: string
  url: string
  downloadUrl?: string
  softwareVersion?: string
}

export interface BreadcrumbSchema {
  '@context': string
  '@type': string
  itemListElement: Array<{
    '@type': string
    position: number
    name: string
    item: string
  }>
}

export interface CourseSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  provider: {
    '@type': string
    name: string
    url: string
  }
  courseCode?: string
  educationalLevel?: string
}

/**
 * Generate Organization schema for Shelly
 */
export function getOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Shelly',
    url: SITE_URL,
    description: 'Learn data structures and algorithms by building them from scratch. Hands-on coding challenges with real GitHub repos and CLI tools.',
    logo: `${SITE_URL}/turtle_logo.png`,
    sameAs: [
      // Add social media links here when available
    ],
  }
}

/**
 * Generate Website schema
 */
export function getWebsiteSchema(): WebsiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Shelly',
    url: SITE_URL,
    description: 'Learn data structures and algorithms by building them from scratch. Shelly provides hands-on coding challenges with real GitHub repos and CLI tools.',
    publisher: {
      '@type': 'Organization',
      name: 'Shelly',
    },
  }
}

/**
 * Generate SoftwareApplication schema for Shelly CLI
 */
export function getSoftwareApplicationSchema(): SoftwareApplicationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Shelly CLI',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Linux, macOS, Windows',
    description: 'Command-line interface for testing and submitting data structure and algorithm challenges. Run tests locally, get hints, and track your progress.',
    url: `${SITE_URL}/docs`,
    downloadUrl: 'https://raw.githubusercontent.com/joudbitar/dsa-teacher/main/scripts/install-cli.sh',
  }
}

/**
 * Generate BreadcrumbList schema
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  }
}

/**
 * Generate Course schema for a challenge module
 */
export function getCourseSchema(
  name: string,
  description: string,
  courseCode?: string
): CourseSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: 'Shelly',
      url: SITE_URL,
    },
    courseCode,
    educationalLevel: 'Beginner to Intermediate',
  }
}

/**
 * Inject JSON-LD script into document head
 */
export function injectStructuredData(schema: object, id?: string): void {
  const scriptId = id || `structured-data-${Date.now()}`
  
  // Remove existing script with same ID if it exists
  const existingScript = document.getElementById(scriptId)
  if (existingScript) {
    existingScript.remove()
  }

  const script = document.createElement('script')
  script.id = scriptId
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(schema, null, 2)
  document.head.appendChild(script)
}

/**
 * Remove structured data script by ID
 */
export function removeStructuredData(id: string): void {
  const script = document.getElementById(id)
  if (script) {
    script.remove()
  }
}

