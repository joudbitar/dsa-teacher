# SEO Setup Guide for Shelly

This guide walks you through setting up Google Search Console and ensuring Shelly is properly indexed by search engines.

## Prerequisites

- Shelly website deployed at `https://shellycli.tech`
- Access to Google account
- Access to website's HTML (for verification)

## Step 1: Google Search Console Setup

### 1.1 Create a Google Search Console Account

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Sign in with your Google account
3. Click "Add Property"

### 1.2 Add Your Property

1. Enter your website URL: `https://shellycli.tech`
2. Choose verification method. Recommended: **HTML tag method**

### 1.3 Verify Ownership

**Option A: HTML Tag Method (Recommended)**

1. Google will provide a meta tag like:
   ```html
   <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
   ```
2. Add this tag to `web/index.html` in the `<head>` section
3. Deploy the updated file
4. Click "Verify" in Google Search Console

**Option B: Domain Name Provider Method**

1. Add a TXT record to your domain's DNS settings
2. Follow Google's instructions for your DNS provider
3. Click "Verify" in Google Search Console

### 1.4 Submit Sitemap

1. Once verified, go to "Sitemaps" in the left sidebar
2. Enter: `https://shellycli.tech/sitemap.xml`
3. Click "Submit"
4. Google will start crawling your sitemap

## Step 2: Verify SEO Implementation

### 2.1 Check Meta Tags

Verify that meta tags are present in `web/index.html`:

- ✅ Title tag
- ✅ Meta description
- ✅ Meta keywords
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Canonical URL

### 2.2 Check Structured Data

Use Google's [Rich Results Test](https://search.google.com/test/rich-results) to verify structured data:

1. Enter your website URL
2. Check for Organization, Website, and SoftwareApplication schemas
3. Fix any errors or warnings

### 2.3 Check Robots.txt

Verify `robots.txt` is accessible:

- URL: `https://shellycli.tech/robots.txt`
- Should allow all crawlers
- Should reference sitemap location

### 2.4 Check Sitemap

Verify `sitemap.xml` is accessible:

- URL: `https://shellycli.tech/sitemap.xml`
- Should list all main pages
- Should be properly formatted XML

## Step 3: Monitor Indexing Status

### 3.1 Check Coverage Report

1. In Google Search Console, go to "Coverage"
2. Check for any indexing errors
3. Review "Valid" pages to ensure they're indexed
4. Fix any "Excluded" pages if needed

### 3.2 Request Indexing

For new or updated pages:

1. Use "URL Inspection" tool in Search Console
2. Enter the page URL
3. Click "Request Indexing"
4. Wait for Google to crawl and index

## Step 4: Monitor Search Performance

### 4.1 Performance Report

1. Go to "Performance" in Search Console
2. Monitor:
   - Total clicks
   - Total impressions
   - Average position
   - Click-through rate (CTR)

### 4.2 Track Target Keywords

Monitor rankings for:

- "shelly"
- "shelly cli"
- "learn DSA"
- "data structures and algorithms"
- "learn data structures"
- "coding challenges"

### 4.3 Set Up Email Notifications

1. Go to "Settings" → "Users and permissions"
2. Add email addresses for notifications
3. Configure alert preferences

## Step 5: Ongoing SEO Maintenance

### 5.1 Update Sitemap

When adding new pages:

1. Update `web/public/sitemap.xml`
2. Add new URL entries
3. Update lastmod dates
4. Resubmit sitemap in Search Console

### 5.2 Monitor Core Web Vitals

1. Check "Core Web Vitals" report in Search Console
2. Ensure good scores for:
   - Largest Contentful Paint (LCP)
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)

### 5.3 Fix Mobile Usability Issues

1. Check "Mobile Usability" report
2. Ensure all pages are mobile-friendly
3. Fix any issues found

### 5.4 Monitor Security Issues

1. Check "Security Issues" report
2. Address any security warnings immediately
3. Keep SSL certificate valid

## Step 6: Additional Search Engines

### 6.1 Bing Webmaster Tools

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site
3. Verify ownership
4. Submit sitemap: `https://shellycli.tech/sitemap.xml`

### 6.2 Other Search Engines

Consider submitting to:

- DuckDuckGo (uses Bing/Yahoo results)
- Yandex (for international reach)

## Troubleshooting

### Pages Not Indexing

1. Check robots.txt isn't blocking crawlers
2. Verify pages return 200 status code
3. Ensure pages have unique, descriptive content
4. Check for duplicate content issues
5. Use "URL Inspection" to request indexing

### Low Rankings

1. Improve page content quality
2. Add more relevant keywords naturally
3. Build quality backlinks
4. Ensure fast page load times
5. Improve user experience metrics

### Structured Data Errors

1. Use Google's Rich Results Test
2. Fix JSON-LD syntax errors
3. Ensure required fields are present
4. Validate schema.org structure

## Resources

- [Google Search Console Help](https://support.google.com/webmasters)
- [Google's SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)

## Checklist

- [ ] Google Search Console account created
- [ ] Website verified in Search Console
- [ ] Sitemap submitted
- [ ] Robots.txt verified
- [ ] Meta tags implemented
- [ ] Structured data verified
- [ ] Mobile-friendly verified
- [ ] Core Web Vitals checked
- [ ] Target keywords monitored
- [ ] Bing Webmaster Tools setup (optional)

## Notes

- It may take several days to weeks for Google to fully index your site
- Regular content updates help maintain search visibility
- Monitor Search Console weekly for issues
- Keep sitemap updated when adding new pages
