import React from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useStore } from '../store/useStore';
import { LinkCard } from './LinkCard';
import { Plus } from 'lucide-react';
import { AddLinkModal } from './AddLinkModal';

export const ProductList: React.FC = () => {
  const { links, reorderLinks } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((item) => item.id === active.id);
      const newIndex = links.findIndex((item) => item.id === over.id);
      reorderLinks(oldIndex, newIndex);
    }
  };

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={links.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {links.map((item) => (
              <LinkCard key={item.id} item={item} />
            ))}
            
            {links.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No links yet. Add some links or import products to get started!
                </p>
              </div>
            )}

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Link
            </button>
          </div>
        </SortableContext>
      </DndContext>

      <AddLinkModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </>
  );
};