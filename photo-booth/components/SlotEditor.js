// components/SlotEditor.js
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function SlotEditor({ layout, onSave }) {
  const [slots, setSlots] = useState(layout.slots || []);
  const [activeSlot, setActiveSlot] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  // คำนวณอัตราส่วนสำหรับการแสดงผล
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const newScale = containerWidth / layout.width;
      setScale(newScale);
    }
  }, [layout.width]);

  const handleAddSlot = () => {
    const newSlot = {
      top: 20,
      left: 20,
      width: 100,
      height: 100
    };
    
    setSlots([...slots, newSlot]);
  };

  const handleSlotClick = (index, e) => {
    e.stopPropagation();
    setActiveSlot(index);
  };

  const handleMouseDown = (e, index, action) => {
    e.stopPropagation();
    setActiveSlot(index);
    
    if (action === 'move') {
      setIsMoving(true);
    } else if (action === 'resize') {
      setIsResizing(true);
    }
    
    setStartPoint({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseMove = (e) => {
    if (activeSlot === null || (!isMoving && !isResizing)) return;
    
    const deltaX = (e.clientX - startPoint.x) / scale;
    const deltaY = (e.clientY - startPoint.y) / scale;
    
    const updatedSlots = [...slots];
    
    if (isMoving) {
      updatedSlots[activeSlot] = {
        ...updatedSlots[activeSlot],
        top: Math.max(0, updatedSlots[activeSlot].top + deltaY),
        left: Math.max(0, updatedSlots[activeSlot].left + deltaX)
      };
    } else if (isResizing) {
      updatedSlots[activeSlot] = {
        ...updatedSlots[activeSlot],
        width: Math.max(20, updatedSlots[activeSlot].width + deltaX),
        height: Math.max(20, updatedSlots[activeSlot].height + deltaY)
      };
    }
    
    setSlots(updatedSlots);
    setStartPoint({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseUp = () => {
    setIsMoving(false);
    setIsResizing(false);
  };

  const handleDeleteSlot = (index, e) => {
    e.stopPropagation();
    const updatedSlots = slots.filter((_, i) => i !== index);
    setSlots(updatedSlots);
    if (activeSlot === index) {
      setActiveSlot(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Edit Layout Slots</h2>
      
      <div 
        ref={containerRef}
        className="relative border border-gray-300 rounded-lg mb-4 mx-auto"
        style={{
          width: '100%',
          maxWidth: '500px',
          height: `${layout.height * (500 / layout.width)}px`,
          maxHeight: '70vh'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Layout Background */}
        {layout.image && (
          <Image
            src={layout.image}
            alt={layout.name || "Layout template"}
            fill
            className="object-contain"
          />
        )}
        
        {/* Slots */}
        {slots.map((slot, index) => (
          <div
            key={index}
            className={`absolute border-2 ${
              activeSlot === index ? 'border-blue-500' : 'border-green-400'
            } bg-blue-100 bg-opacity-40 cursor-move`}
            style={{
              top: slot.top * scale,
              left: slot.left * scale,
              width: slot.width * scale,
              height: slot.height * scale,
            }}
            onClick={(e) => handleSlotClick(index, e)}
            onMouseDown={(e) => handleMouseDown(e, index, 'move')}
          >
            {/* Resize handle */}
            <div 
              className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
              onMouseDown={(e) => handleMouseDown(e, index, 'resize')}
            />
            
            {/* Delete button */}
            <button
              className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white flex items-center justify-center rounded-full"
              onClick={(e) => handleDeleteSlot(index, e)}
            >
              ×
            </button>
            
            <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white px-1">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={handleAddSlot}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Slot
        </button>
        
        <button
          onClick={() => onSave(slots)}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Save Slots
        </button>
      </div>
      
      {/* Slot Properties */}
      {activeSlot !== null && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium mb-2">Slot {activeSlot + 1} Properties</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Top (px)</label>
              <input
                type="number"
                value={Math.round(slots[activeSlot].top)}
                onChange={(e) => {
                  const updatedSlots = [...slots];
                  updatedSlots[activeSlot] = {
                    ...updatedSlots[activeSlot],
                    top: Number(e.target.value)
                  };
                  setSlots(updatedSlots);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Left (px)</label>
              <input
                type="number"
                value={Math.round(slots[activeSlot].left)}
                onChange={(e) => {
                  const updatedSlots = [...slots];
                  updatedSlots[activeSlot] = {
                    ...updatedSlots[activeSlot],
                    left: Number(e.target.value)
                  };
                  setSlots(updatedSlots);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Width (px)</label>
              <input
                type="number"
                value={Math.round(slots[activeSlot].width)}
                onChange={(e) => {
                  const updatedSlots = [...slots];
                  updatedSlots[activeSlot] = {
                    ...updatedSlots[activeSlot],
                    width: Number(e.target.value)
                  };
                  setSlots(updatedSlots);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Height (px)</label>
              <input
                type="number"
                value={Math.round(slots[activeSlot].height)}
                onChange={(e) => {
                  const updatedSlots = [...slots];
                  updatedSlots[activeSlot] = {
                    ...updatedSlots[activeSlot],
                    height: Number(e.target.value)
                  };
                  setSlots(updatedSlots);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Export Code */}
      <div className="mt-4">
        <h3 className="font-medium mb-2">Slot Configuration Code</h3>
        <pre className="bg-gray-100 p-3 rounded-lg overflow-auto text-xs">
          {JSON.stringify(slots, null, 2)}
        </pre>
      </div>
    </div>
  );
}