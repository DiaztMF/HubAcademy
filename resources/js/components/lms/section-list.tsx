import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import type { RouteParams } from 'wayfinder';

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
    courseId: number;
    activeTopicId?: number;
};

export function SectionList({ sections, courseId, activeTopicId }: SectionListProps) {
    function handleTopicClick(courseId: number, topicId: number) {
        const routeName = 'lms.courses.topics.show' as unknown as string;
        router.get(route(routeName, { course: courseId, topic: topicId } as RouteParams));
    }

    return (
        <Accordion type="multiple" className="w-full">
            {sections.map((section) => (
                <AccordionItem key={section.id} value={`section-${section.id}`}>
                    <AccordionTrigger className="text-sm font-medium">
                        {section.title}
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul className="space-y-1">
                            {section.topics.map((topic) => (
                                <li key={topic.id}>
                                    <button
                                        onClick={() => handleTopicClick(courseId, topic.id)}
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
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
