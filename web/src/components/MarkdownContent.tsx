import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { Link } from 'react-router-dom'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { colors } from '@/theme/colors'

// Custom light theme for code blocks
const lightTheme = {
  'code[class*="language-"]': {
    color: colors.text.primary,
    background: 'transparent',
    textShadow: 'none',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.8125rem',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: '1.4',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: colors.text.primary,
    background: 'transparent',
    textShadow: 'none',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.8125rem',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: '1.4',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
    padding: '0',
    margin: '0',
    overflow: 'auto',
  },
  'pre[class*="language-"] code': {
    color: colors.text.primary,
  },
  comment: { color: '#6a737d', fontStyle: 'italic' },
  prolog: { color: '#6a737d' },
  doctype: { color: '#6a737d' },
  cdata: { color: '#6a737d' },
  punctuation: { color: colors.text.secondary },
  property: { color: '#005cc5' },
  tag: { color: '#22863a' },
  boolean: { color: '#005cc5' },
  number: { color: '#005cc5' },
  constant: { color: '#005cc5' },
  symbol: { color: '#005cc5' },
  deleted: { color: '#d73a49' },
  selector: { color: '#6f42c1' },
  'attr-name': { color: '#6f42c1' },
  string: { color: '#032f62' },
  char: { color: '#032f62' },
  builtin: { color: '#6f42c1' },
  inserted: { color: '#22863a' },
  operator: { color: colors.text.secondary },
  entity: { color: '#6f42c1', cursor: 'help' },
  url: { color: '#032f62' },
  'attr-value': { color: '#032f62' },
  keyword: { color: '#d73a49' },
  function: { color: '#6f42c1' },
  'class-name': { color: '#005cc5' },
  regex: { color: '#032f62' },
  important: { color: '#d73a49', fontWeight: 'bold' },
  variable: { color: '#e36209' },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
}

interface MarkdownContentProps {
  content: string
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="relative my-1.5 w-full">
      <div className="absolute top-1 right-1 z-10">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center p-1 rounded transition-colors hover:opacity-80 opacity-60 hover:opacity-100"
          style={{
            backgroundColor: 'transparent',
            color: colors.text.primary,
          }}
          title={copied ? "Copied!" : "Copy to clipboard"}
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={lightTheme as any}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '0.25rem 1.75rem 0.25rem 0.25rem',
          fontSize: '0.75rem',
          lineHeight: '1.3',
          fontFamily: 'JetBrains Mono, monospace',
          backgroundColor: 'transparent',
          overflowX: 'auto',
          border: 'none',
          borderRadius: '0',
          display: 'block',
          width: '100%',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'JetBrains Mono, monospace',
            display: 'block',
            overflowX: 'auto',
            margin: 0,
            padding: 0,
            lineHeight: '1.3',
          }
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="markdown-content" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom styling for headings
          h1: ({ node, ...props }) => (
            <h1 
              className="text-4xl font-bold mb-6 mt-8 first:mt-0" 
              style={{ color: colors.text.primary }}
              {...props} 
            />
          ),
          h2: ({ node, ...props }) => (
            <h2 
              className="text-3xl font-bold mb-4 mt-8" 
              style={{ color: colors.text.primary }}
              {...props} 
            />
          ),
          h3: ({ node, ...props }) => (
            <h3 
              className="text-2xl font-bold mb-3 mt-6" 
              style={{ color: colors.text.primary }}
              {...props} 
            />
          ),
          h4: ({ node, ...props }) => (
            <h4 
              className="text-xl font-bold mb-2 mt-4" 
              style={{ color: colors.text.primary }}
              {...props} 
            />
          ),
          // Paragraphs
          p: ({ node, ...props }) => (
            <p 
              className="text-[#4B463F] leading-relaxed mb-4" 
              {...props} 
            />
          ),
          // Lists
          ul: ({ node, ...props }) => (
            <ul 
              className="list-disc list-inside text-[#4B463F] space-y-2 mb-4 ml-4" 
              {...props} 
            />
          ),
          ol: ({ node, ...props }) => (
            <ol 
              className="list-decimal list-inside text-[#4B463F] space-y-2 mb-4 ml-4" 
              {...props} 
            />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),
          // Code blocks
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            
            if (!inline) {
              const codeString = String(children).replace(/\n$/, '')
              
              return (
                <CodeBlock code={codeString} language={language || 'text'} />
              )
            }
            
            return (
              <code 
                className="px-1.5 py-0.5 rounded text-sm font-medium"
                style={{ 
                  fontFamily: 'JetBrains Mono, monospace',
                  color: colors.accent.primary,
                  backgroundColor: 'transparent',
                }}
                {...props}
              >
                {children}
              </code>
            )
          },
          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote 
              className="border-l-4 border-[#171512] pl-6 py-2 my-4 italic text-[#4B463F]"
              {...props} 
            />
          ),
          // Links
          a: ({ node, href, ...props }: any) => {
            const isInternal = href && (href.startsWith('/') || href.startsWith('#'))
            
            if (isInternal) {
              return (
                <Link
                  to={href || '#'}
                  className="text-[#171512] underline hover:opacity-70 transition-opacity"
                  {...props}
                />
              )
            }
            
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#171512] underline hover:opacity-70 transition-opacity"
                {...props}
              />
            )
          },
          // Horizontal rules
          hr: ({ node, ...props }) => (
            <hr 
              className="border-t border-[#4B463F] my-8 opacity-30"
              {...props} 
            />
          ),
          // Tables
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table 
                className="min-w-full border-collapse border border-[#171512]"
                {...props} 
              />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th 
              className="border border-[#171512] px-4 py-2 bg-[#E8E0C8] font-bold text-left"
              style={{ color: colors.text.primary }}
              {...props} 
            />
          ),
          td: ({ node, ...props }) => (
            <td 
              className="border border-[#171512] px-4 py-2 text-[#4B463F]"
              {...props} 
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

