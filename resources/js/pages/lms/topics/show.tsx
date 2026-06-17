import { Head } from '@inertiajs/react';
import { TopicReader } from '@/components/lms/topic-reader';
import Heading from '@/components/heading';
import lms from '@/routes/lms';
import { dashboard } from '@/routes';

type Teacher = { id: number; name: string };
type Course = { id: number; title: string };
type Section = { id: number; title: string; course: Course };
type TopicData = {
    id: number;
    title: string;
    content_markdown: string | null;
    embed_link: string | null;
    section: Section;
};

export default function TopicShow({ topic }: { topic: TopicData }) {
    return (
        <>
            <Head title={topic.title} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="mb-2">
                    <Heading title={topic.title} variant="small" />
                    <p className="text-xs text-muted-foreground">
                        {topic.section.course.title} &middot; {topic.section.title}
                    </p>
                </div>

                <TopicReader
                    title={topic.title}
                    contentMarkdown={topic.content_markdown}
                    embedLink={topic.embed_link}
                />
            </div>
        </>
    );
}

TopicShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard.url() },
        { title: 'My Courses', href: lms.courses.index.url() },
    ],
};
