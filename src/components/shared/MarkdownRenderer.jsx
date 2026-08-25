import React from 'react';

/**
 * Parses and renders Markdown content into styled React elements.
 * Supports:
 *  - Headers (# H1, ## H2, ### H3, #### H4)
 *  - Code blocks (```lang ... ```)
 *  - Tables (| col1 | col2 |)
 *  - Blockquotes (> quote)
 *  - Unordered lists (* / -) and Ordered lists (1. / 2.)
 *  - Horizontal rules (---)
 *  - Inline formatting (bold, code, italics, links)
 *  - Regular paragraphs
 */
export default function MarkdownRenderer({ content, className = '' }) {
  if (!content) return null;

  // Split by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`markdown-content space-y-4 text-zinc-700 ${className}`}>
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const code = match ? match[2] : part.slice(3, -3);
          return (
            <pre
              key={index}
              className="bg-zinc-950 text-zinc-100 p-5 rounded-xl overflow-x-auto my-6 font-mono text-xs md:text-sm border border-zinc-800 leading-relaxed"
            >
              <code>{code.trim()}</code>
            </pre>
          );
        }

        // Split text into blocks by double newlines
        const blocks = part.split(/\n\n+/);

        return blocks.map((block, bIdx) => {
          const trimmed = block.trim();
          if (!trimmed) return null;
          const key = `${index}-${bIdx}`;

          // Horizontal rule
          if (trimmed === '---' || trimmed === '***') {
            return <hr key={key} className="border-zinc-200 my-8" />;
          }

          // Tables
          if (trimmed.startsWith('|') && trimmed.includes('\n|')) {
            const rows = trimmed.split('\n').map((r) => r.trim()).filter(Boolean);
            if (rows.length >= 2) {
              const headerRow = rows[0]
                .split('|')
                .slice(1, -1)
                .map((cell) => cell.trim());
              const isSeparator = rows[1].includes('---');
              const dataRows = (isSeparator ? rows.slice(2) : rows.slice(1)).map((r) =>
                r
                  .split('|')
                  .slice(1, -1)
                  .map((cell) => cell.trim())
              );

              return (
                <div key={key} className="overflow-x-auto my-6 rounded-xl border border-zinc-200">
                  <table className="min-w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-zinc-100 border-b border-zinc-200">
                        {headerRow.map((cell, cIdx) => (
                          <th key={cIdx} className="px-4 py-3 font-bold text-zinc-900">
                            {renderInline(cell)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 bg-white">
                      {dataRows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-zinc-50/50">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-4 py-2.5 text-zinc-700">
                              {renderInline(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
          }

          // Headings
          if (trimmed.startsWith('# ')) {
            return (
              <h1 key={key} className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-black mt-10 mb-4 pb-2 border-b border-zinc-200">
                {renderInline(trimmed.slice(2))}
              </h1>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={key} className="text-xl md:text-2xl lg:text-3xl font-extrabold text-black mt-8 mb-4">
                {renderInline(trimmed.slice(3))}
              </h2>
            );
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={key} className="text-lg md:text-xl lg:text-2xl font-bold text-black mt-6 mb-3">
                {renderInline(trimmed.slice(4))}
              </h3>
            );
          }
          if (trimmed.startsWith('#### ')) {
            return (
              <h4 key={key} className="text-base md:text-lg font-bold text-black mt-4 mb-2">
                {renderInline(trimmed.slice(5))}
              </h4>
            );
          }

          // Blockquote
          if (trimmed.startsWith('> ')) {
            const quoteContent = trimmed
              .split('\n')
              .map((line) => line.replace(/^>\s?/, ''))
              .join(' ');
            return (
              <blockquote
                key={key}
                className="border-l-4 border-black pl-5 italic my-6 text-zinc-800 text-sm md:text-base lg:text-lg bg-zinc-50 py-3 rounded-r-lg"
              >
                {renderInline(quoteContent)}
              </blockquote>
            );
          }

          // Ordered list
          if (/^\d+\.\s/.test(trimmed)) {
            const lines = trimmed.split('\n');
            return (
              <ol key={key} className="list-decimal pl-6 space-y-2 my-4 text-zinc-700 text-sm md:text-base">
                {lines.map((line, lIdx) => {
                  const content = line.replace(/^\d+\.\s+/, '');
                  return <li key={lIdx}>{renderInline(content)}</li>;
                })}
              </ol>
            );
          }

          // Unordered list
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            const lines = trimmed.split('\n');
            return (
              <ul key={key} className="list-disc pl-6 space-y-2 my-4 text-zinc-700 text-sm md:text-base">
                {lines.map((line, lIdx) => {
                  const content = line.replace(/^[*-]\s+/, '');
                  return <li key={lIdx}>{renderInline(content)}</li>;
                })}
              </ul>
            );
          }

          // Paragraph
          return (
            <p key={key} className="leading-relaxed text-zinc-700 my-4 text-sm md:text-base">
              {renderInline(trimmed)}
            </p>
          );
        });
      })}
    </div>
  );
}

/**
 * Parses inline formatting like bold (**text**), code (`text`), links ([text](url)), and italics (*text*).
 */
function renderInline(text) {
  if (!text) return null;

  // Split by markdown inline tokens: **bold**, `code`, [label](url), *italic*
  const tokenRegex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\)|\*.*?\*)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={i} className="font-bold text-black">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={i}
          className="bg-zinc-100 text-zinc-900 px-1.5 py-0.5 rounded font-mono text-xs md:text-sm border border-zinc-200"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (match) {
        return (
          <a
            key={i}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-black underline underline-offset-2 hover:opacity-70 transition-opacity"
          >
            {match[1]}
          </a>
        );
      }
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2 && !part.startsWith('**')) {
      return (
        <em key={i} className="italic text-zinc-800">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}
