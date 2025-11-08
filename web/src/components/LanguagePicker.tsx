import { Code2, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SiTypescript, SiPython, SiJavascript, SiGo, SiCplusplus } from 'react-icons/si'
import { FaJava } from 'react-icons/fa'

const languages = [
  { id: 'typescript', name: 'TypeScript', ext: 'ts', logo: SiTypescript, color: '#3178C6' },
  { id: 'python', name: 'Python', ext: 'py', logo: SiPython, color: '#3776AB' },
  { id: 'javascript', name: 'JavaScript', ext: 'js', logo: SiJavascript, color: '#F7DF1E' },
  { id: 'go', name: 'Go', ext: 'go', logo: SiGo, color: '#00ADD8' },
  { id: 'java', name: 'Java', ext: 'java', logo: FaJava, color: '#ED8B00' },
  { id: 'cpp', name: 'C++', ext: 'cpp', logo: SiCplusplus, color: '#00599C' },
]

interface LanguagePickerProps {
  selectedLanguage?: string
  onSelect: (language: string | undefined) => void
}

export function LanguagePicker({ selectedLanguage, onSelect }: LanguagePickerProps) {
  const handleLanguageClick = (langId: string) => {
    if (selectedLanguage === langId) {
      onSelect(undefined)
    } else {
      onSelect(langId)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-muted p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Code2 className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-bold">Choose Your Language</h2>
        </div>
        {selectedLanguage && (
          <button
            onClick={() => onSelect(undefined)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        Select the programming language you want to use for this challenge. You'll get a template repository with starter code and tests.
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {languages.map((lang) => {
          const isSelected = selectedLanguage === lang.id
          const Logo = lang.logo
          
          return (
            <button
              key={lang.id}
              onClick={() => handleLanguageClick(lang.id)}
              className={cn(
                "rounded-lg p-2 text-center transition-all flex flex-col items-center gap-1.5 relative",
                isSelected
                  ? "bg-accent/10"
                  : "hover:bg-muted/30"
              )}
            >
              <div className="flex h-16 w-16 items-center justify-center">
                <Logo size={32} color={lang.color} />
              </div>
              <div className="flex flex-col items-center">
                <p className={cn(
                  "font-semibold text-xs leading-tight",
                  isSelected ? "text-accent" : "text-foreground"
                )}>
                  {lang.name}
                </p>
                <p className="text-[10px] text-muted-foreground font-mono leading-tight">.{lang.ext}</p>
              </div>
              {isSelected && (
                <div className="absolute top-1 right-1">
                  <Check className="h-3.5 w-3.5 text-accent" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

