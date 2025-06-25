import { useEffect, useState } from 'react';
import { marked } from 'marked';

interface MarkdownViewerProps {
  markdown: string;
}

export default function MarkdownViewer({ markdown }: MarkdownViewerProps) {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    if (markdown) {
      const html = marked.parse(markdown) as string;
      setHtmlContent(html);
    }
  }, [markdown]);

  return (
    <article
      className="prose max-w-none text-gray-800"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
