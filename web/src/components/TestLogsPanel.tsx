import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, X, Copy, Check, AlertTriangle } from 'lucide-react';
import { TestLogs, FormattedLogLine } from '@/lib/api';
import { useTheme } from '@/theme/ThemeContext';

interface TestLogsPanelProps {
  testLogs: TestLogs | null;
  hasLogs: boolean;
  result?: string;
  onClose?: () => void;
}

const MIN_HEIGHT = 200;
const MAX_HEIGHT = 600;
const DEFAULT_HEIGHT = 300;

export function TestLogsPanel({ testLogs, hasLogs, result, onClose }: TestLogsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Debug logging
  useEffect(() => {
    console.log("TestLogsPanel render:", {
      hasLogs,
      hasTestLogs: !!testLogs,
      result,
      isExpanded,
      lines: testLogs?.formattedLines?.length || 0,
    });
  }, [testLogs, hasLogs, result, isExpanded]);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [isResizing, setIsResizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { backgroundColor, borderColor, textColor } = useTheme();

  // Auto-expand if tests failed
  useEffect(() => {
    if (result === 'fail' && hasLogs) {
      setIsExpanded(true);
    }
  }, [result, hasLogs]);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (isExpanded && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [testLogs, isExpanded]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!panelRef.current) return;
      const rect = panelRef.current.getBoundingClientRect();
      const newHeight = window.innerHeight - e.clientY;
      const clampedHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight));
      setHeight(clampedHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleCopy = async () => {
    if (!testLogs) return;
    await navigator.clipboard.writeText(testLogs.rawOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLineColor = (line: FormattedLogLine): string => {
    switch (line.type) {
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'test':
        return 'text-blue-400';
      case 'compile':
        return 'text-cyan-400';
      case 'info':
        return 'text-green-400';
      default:
        return 'text-foreground/80';
    }
  };

  const getLineBg = (line: FormattedLogLine): string => {
    switch (line.type) {
      case 'error':
        return 'bg-red-500/10';
      case 'warning':
        return 'bg-yellow-500/10';
      default:
        return '';
    }
  };

  const hasFailedTests = result === 'fail';

  // Always show the panel - it will display "No logs yet" when empty
  // This makes it clear the feature exists and is waiting for logs
  // Show more prominently if tests failed

  return (
    <div
      ref={panelRef}
      className="fixed bottom-0 left-0 right-0 z-40 border-t shadow-2xl transition-all duration-300 ease-in-out"
      style={{
        backgroundColor,
        borderColor,
        height: isExpanded ? `${height}px` : 'auto',
        transform: isExpanded ? 'translateY(0)' : 'translateY(calc(100% - 48px))',
        boxShadow: hasFailedTests 
          ? '0 -4px 20px rgba(239, 68, 68, 0.3)' 
          : isExpanded 
            ? '0 -4px 20px rgba(0, 0, 0, 0.3)' 
            : '0 -2px 10px rgba(0, 0, 0, 0.2)',
        borderTopColor: hasFailedTests ? 'rgba(239, 68, 68, 0.5)' : borderColor,
        borderTopWidth: hasFailedTests ? '2px' : '1px',
      }}
    >
      {/* Header Bar */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ borderBottom: isExpanded ? `1px solid ${borderColor}` : 'none' }}
      >
        <div className="flex items-center gap-3">
          {hasFailedTests && (
            <AlertTriangle className="h-5 w-5 text-red-500" />
          )}
          <span className="font-mono text-sm font-semibold" style={{ color: textColor }}>
            {hasFailedTests ? 'Tests failed' : hasLogs ? 'Test Logs' : 'Test Logs'}
          </span>
          {testLogs && (
            <span className="text-xs font-mono" style={{ color: textColor, opacity: 0.6 }}>
              {testLogs.formattedLines.length} lines
            </span>
          )}
          {!testLogs && hasFailedTests && (
            <span className="text-xs font-mono" style={{ color: textColor, opacity: 0.6 }}>
              No logs yet
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isExpanded && testLogs && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="p-1.5 rounded hover:bg-muted/50 transition-colors"
              title="Copy logs"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" style={{ color: textColor, opacity: 0.7 }} />
              )}
            </button>
          )}
          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1.5 rounded hover:bg-muted/50 transition-colors"
              title="Close"
            >
              <X className="h-4 w-4" style={{ color: textColor, opacity: 0.7 }} />
            </button>
          )}
          {isExpanded ? (
            <ChevronDown className="h-5 w-5" style={{ color: textColor, opacity: 0.7 }} />
          ) : (
            <ChevronUp className="h-5 w-5" style={{ color: textColor, opacity: 0.7 }} />
          )}
        </div>
      </div>

      {/* Resize Handle */}
      {isExpanded && (
        <div
          className="absolute top-0 left-0 right-0 h-1.5 cursor-ns-resize hover:bg-accent/50 transition-colors group"
          onMouseDown={handleResizeStart}
          style={{ backgroundColor: borderColor }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-0.5 bg-foreground/30 group-hover:bg-foreground/50 rounded transition-colors" />
        </div>
      )}

      {/* Content */}
      {isExpanded && testLogs && (
        <div
          ref={contentRef}
          className="h-full overflow-y-auto font-mono text-xs"
          style={{ 
            color: textColor,
            height: `calc(100% - 48px)`,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          <div className="p-4 space-y-0.5">
            {testLogs.formattedLines.map((line, index) => {
              const bgClass = getLineBg(line);
              return (
                <div
                  key={index}
                  className={`whitespace-pre-wrap break-words px-2 py-0.5 rounded ${getLineColor(line)} ${bgClass}`}
                >
                  {line.content}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {isExpanded && !testLogs && (
        <div className="flex flex-col items-center justify-center h-full p-8 gap-4">
          <p className="text-sm font-mono text-center" style={{ color: textColor, opacity: 0.6 }}>
            {hasLogs === false 
              ? "No test logs available yet."
              : "Loading test logs..."}
          </p>
          {hasLogs === false && (
            <div className="text-xs font-mono text-center" style={{ color: textColor, opacity: 0.5 }}>
              Run <code className="px-1.5 py-0.5 rounded bg-muted">dsa test</code> and <code className="px-1.5 py-0.5 rounded bg-muted">dsa submit</code> to see test output here.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

