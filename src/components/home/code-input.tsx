"use client";
import hljs from "highlight.js";
import {
  type HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createHighlighter, type Highlighter } from "shiki";
import { twMerge } from "tailwind-merge";
import { useTheme } from "@/components/theme-provider";

export interface CodeInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
}

const SUPPORTED_LANGUAGES = [
  { id: "auto", name: "Auto-detect" },
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "csharp", name: "C#" },
  { id: "rust", name: "Rust" },
  { id: "go", name: "Go" },
  { id: "html", name: "HTML" },
  { id: "css", name: "CSS" },
  { id: "json", name: "JSON" },
  { id: "yaml", name: "YAML" },
  { id: "markdown", name: "Markdown" },
  { id: "bash", name: "Bash" },
  { id: "sql", name: "SQL" },
];

const SAMPLE_CODE = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }
  // TODO: handle tax calculation
  // TODO: handle currency conversion
  return total;
}`;

const AUTO_DETECT_LANG_IDS = SUPPORTED_LANGUAGES.filter(
  (l) => l.id !== "auto",
).map((l) => l.id);

function detectByHeuristics(code: string): string | null {
  const javaPatterns = [
    /\bpublic\s+class\s+\w+/,
    /\bSystem\.out\.print/,
    /\bimport\s+java\./,
    /\bimport\s+org\.springframework\./,
    /\bimport\s+jakarta\./,
    /\bvoid\s+main\s*\(/,
    /@Override/,
    /@RestController/,
    /@RequestMapping/,
    /\bprivate\s+\w+\s+\w+\s*[;=]/,
    /\bprotected\s+\w+/,
    /\bpublic\s+\w+\s+\w+\s*\(/,
  ];

  const csharpPatterns = [
    /\busing\s+System/,
    /\bnamespace\s+\w+/,
    /\bConsole\.WriteLine/,
    /\bpublic\s+class\s+\w+/,
    /\basync\s+Task/,
    /\bprivate\s+void\s+\w+/,
    /\bvar\s+\w+\s+=/,
  ];

  const javaMatches = javaPatterns.filter((p) => p.test(code)).length;
  if (javaMatches >= 1) return "java";

  const csharpMatches = csharpPatterns.filter((p) => p.test(code)).length;
  if (csharpMatches >= 2) return "csharp";

  return null;
}

export function CodeInput({
  value: controlledValue,
  onChange,
  className,
  ...props
}: CodeInputProps) {
  const [internalValue, setInternalValue] = useState(SAMPLE_CODE);
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [highlightedHtmlDark, setHighlightedHtmlDark] = useState("");
  const [highlightedHtmlLight, setHighlightedHtmlLight] = useState("");
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  useEffect(() => {
    createHighlighter({
      themes: ["vesper", "github-light"],
      langs: [
        "javascript",
        "typescript",
        "python",
        "java",
        "csharp",
        "rust",
        "go",
        "html",
        "css",
        "json",
        "yaml",
        "markdown",
        "bash",
        "sql",
      ],
    }).then((h) => {
      setHighlighter(h);
      setIsLoading(false);
    });
  }, []);

  const detectLanguage = useCallback((code: string): string => {
    // First, try our heuristics for Java and C#
    const heuristicResult = detectByHeuristics(code);
    if (heuristicResult) return heuristicResult;

    // Fallback to highlight.js
    const result = hljs.highlightAuto(code, AUTO_DETECT_LANG_IDS);
    return result.language || "plaintext";
  }, []);

  const currentLanguage = useMemo(() => {
    if (selectedLanguage !== "auto") {
      return selectedLanguage;
    }
    return detectedLanguage || "plaintext";
  }, [selectedLanguage, detectedLanguage]);

  useEffect(() => {
    if (!highlighter || !currentValue.trim()) {
      setHighlightedHtmlDark("");
      setHighlightedHtmlLight("");
      return;
    }

    const applyHighlight = async () => {
      try {
        const lang = currentLanguage === "auto" ? "plaintext" : currentLanguage;

        const htmlDark = highlighter.codeToHtml(currentValue, {
          lang: lang,
          theme: "vesper",
        });

        const htmlLight = highlighter.codeToHtml(currentValue, {
          lang: lang,
          theme: "github-light",
        });

        setHighlightedHtmlDark(htmlDark);
        setHighlightedHtmlLight(htmlLight);
      } catch {
        setHighlightedHtmlDark("");
        setHighlightedHtmlLight("");
      }
    };

    applyHighlight();
  }, [highlighter, currentValue, currentLanguage]);

  useEffect(() => {
    if (selectedLanguage === "auto" && currentValue) {
      const detected = detectLanguage(currentValue);
      setDetectedLanguage(detected);
    }
  }, [currentValue, selectedLanguage, detectLanguage]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang);
  };

  const lines = currentValue.split("\n");

  return (
    <div
      className={twMerge(
        "overflow-hidden rounded border border-[var(--border-primary)] bg-[var(--bg-input)]",
        className,
      )}
      {...props}
    >
      <CodeHeader
        languages={SUPPORTED_LANGUAGES}
        selectedLanguage={selectedLanguage}
        detectedLanguage={selectedLanguage === "auto" ? detectedLanguage : null}
        onLanguageChange={handleLanguageChange}
        isLoading={isLoading}
      />
      <div className="flex h-[360px] w-[780px]">
        <LineNumbers lineCount={lines.length} />
        <CodeEditor
          value={currentValue}
          onChange={handleChange}
          highlightedHtmlDark={highlightedHtmlDark}
          highlightedHtmlLight={highlightedHtmlLight}
          isLoading={isLoading}
          theme={theme}
        />
      </div>
    </div>
  );
}

interface CodeHeaderProps {
  languages: typeof SUPPORTED_LANGUAGES;
  selectedLanguage: string;
  detectedLanguage: string | null;
  onLanguageChange: (lang: string) => void;
  isLoading: boolean;
}

function CodeHeader({
  languages,
  selectedLanguage,
  detectedLanguage,
  onLanguageChange,
  isLoading,
}: CodeHeaderProps) {
  return (
    <div className="flex h-10 items-center justify-between border-b border-[var(--border-primary)] px-4">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-red-500" />
        <div className="h-3 w-3 rounded-full bg-amber-500" />
        <div className="h-3 w-3 rounded-full bg-emerald-500" />
      </div>
      <div className="flex items-center gap-2">
        {selectedLanguage === "auto" && detectedLanguage && !isLoading && (
          <span className="text-xs text-[var(--text-tertiary)]">
            {languages.find((l) => l.id === detectedLanguage)?.name ||
              detectedLanguage}
          </span>
        )}
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="rounded bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--border-focus)]"
        >
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function LineNumbers({ lineCount }: { lineCount: number }) {
  return (
    <div className="flex w-12 flex-col items-end border-r border-[var(--border-primary)] bg-[var(--bg-surface)] py-3 pr-2 font-mono text-[12px] leading-6 text-[var(--text-tertiary)]">
      {Array.from({ length: Math.max(lineCount, 16) }, (_, i) => (
        <span key={String(i + 1)}>{i + 1}</span>
      ))}
    </div>
  );
}

type Theme = "light" | "dark";

interface CodeEditorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  highlightedHtmlDark: string;
  highlightedHtmlLight: string;
  isLoading: boolean;
  theme: Theme;
}

function CodeEditor({
  value,
  onChange,
  highlightedHtmlDark,
  highlightedHtmlLight,
  isLoading,
  theme,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRefDark = useRef<HTMLDivElement>(null);
  const highlightRefLight = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (textareaRef.current) {
      if (highlightRefDark.current) {
        highlightRefDark.current.scrollTop = textareaRef.current.scrollTop;
        highlightRefDark.current.scrollLeft = textareaRef.current.scrollLeft;
      }
      if (highlightRefLight.current) {
        highlightRefLight.current.scrollTop = textareaRef.current.scrollTop;
        highlightRefLight.current.scrollLeft = textareaRef.current.scrollLeft;
      }
    }
  }, []);

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Dark theme layer - always rendered, controlled by opacity */}
      <div
        ref={highlightRefDark}
        className={`absolute inset-0 overflow-auto whitespace-pre-wrap break-words p-3 pl-4 font-mono text-[12px] leading-6 ${
          theme === "dark" ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        {isLoading ? (
          <pre className="text-[var(--text-tertiary)]">{value}</pre>
        ) : highlightedHtmlDark ? (
          <div dangerouslySetInnerHTML={{ __html: highlightedHtmlDark }} />
        ) : (
          <pre className="text-[var(--text-primary)]">{value}</pre>
        )}
      </div>
      {/* Light theme layer - always rendered, controlled by opacity */}
      <div
        ref={highlightRefLight}
        className={`absolute inset-0 overflow-auto whitespace-pre-wrap break-words p-3 pl-4 font-mono text-[12px] leading-6 ${
          theme === "light" ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        {isLoading ? (
          <pre className="text-[var(--text-tertiary)]">{value}</pre>
        ) : highlightedHtmlLight ? (
          <div dangerouslySetInnerHTML={{ __html: highlightedHtmlLight }} />
        ) : (
          <pre className="text-[var(--text-primary)]">{value}</pre>
        )}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onScroll={handleScroll}
        className="absolute inset-0 flex-1 resize-none bg-transparent py-3 pl-3 pr-4 font-mono text-[12px] leading-6 text-transparent caret-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
        placeholder="// paste your code here..."
        spellCheck={false}
      />
    </div>
  );
}
