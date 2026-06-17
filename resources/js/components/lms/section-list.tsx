import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

type Topic = {
    id: number;
    title: string;
    section_id: number;
    order: number;
};

type Section = {
    id: number;
    title: string;
    order: number;
    topics: Topic[];
};

type SectionListProps = {
    sections: Section[];
    baseUrl: string;
    activeTopicId?: number;
};

export function SectionList({ sections, baseUrl, activeTopicId }: SectionListProps) {
    return (
        <div className="space-y-1">
            {sections.map((section) => (
                <Collapsible key={section.id} defaultOpen className="border-b py-2">
                    <CollapsibleTrigger className="flex w-full items-center gap-2 py-1 text-sm font-medium">
                        <ChevronRight className="size-4 shrink-0 transition-transform group-open:rotate-90" />
                        {section.title}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <ul className="ml-4 mt-1 space-y-1 border-l pl-3">
                            {section.topics.map((topic) => (
                                <li key={topic.id}>
                                    <button
                                        onClick={() => router.get(`${baseUrl}/${topic.id}`)}
                                        className={cn(
                                            'w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent',
                                            activeTopicId === topic.id && 'bg-accent font-medium text-accent-foreground'
                                        )}
                                    >
                                        {topic.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </CollapsibleContent>
                </Collapsible>
            ))}
        </div>
    );
}
