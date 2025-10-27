// SortableImageList.tsx

import {
    DndContext,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    arrayMove,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export type ImageItem = {
    id: string;
    src: string;
};

type Props = {
    images: ImageItem[];
    onChange: (images: ImageItem[]) => void;
};

export default function SortableImages({ images, onChange }: Props) {
    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = images.findIndex((img) => img.id === active.id);
        const newIndex = images.findIndex((img) => img.id === over.id);

        const reordered = arrayMove(images, oldIndex, newIndex);
        onChange(reordered);
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={images.map((img) => img.id)} strategy={horizontalListSortingStrategy}>
                <div className="flex gap-2 overflow-x-auto mt-4">
                    {images.map((img) => (
                        <SortableImage key={img.id} id={img.id} src={img.src} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}

function SortableImage({ id, src }: { id: string; src: string }) {
    const {setNodeRef, attributes, listeners, transform, transition} = useSortable({id});

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const isImage = src.match(/\.(jpeg|jpg|png)$/i)
    const isVideo = src.match(/\.(mp4|webm|mov)$/i)
    // console.log(src)
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="w-28 h-28 flex-shrink-0 rounded border border-gray-300 overflow-hidden cursor-grab"
        >
            {isImage && <img src={src} alt="media" className="w-full h-full object-cover" />}
            {isVideo && (
                <video
                    src={src}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                />
            )}
        </div>
    );
}
