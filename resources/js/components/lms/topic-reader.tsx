import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type TopicReaderProps = {
    title: string;
    contentMarkdown: string | null;
    embedLink?: string | null;
};

export function TopicReader({ title, contentMarkdown, embedLink }: TopicReaderProps) {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {contentMarkdown && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {contentMarkdown}
                    </ReactMarkdown>
                </div>
            )}
            {embedLink && (
                <div className="aspect-video overflow-hidden rounded-lg border">
                    <iframe
                        src={embedLink}
                        className="size-full"
                        allowFullScreen
                        title="Embedded content"
                    />
                </div>
            )}
        </div>
    );
}
