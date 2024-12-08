import { useEffect, useRef, useState } from 'react';
import './BakerFloorPlan.css';

const BakerFloorPlan = () => {
  const canvasRef = useRef(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Define grid properties
  const ROOM_SIZE = 60;
  const ROOM_GAP = 5;
  const CANVAS_PADDING = 20;

  // Define layout dimensions
  const ROOMS_PER_ROW = 11; // Main hallway (horizontal area)
  const NUM_ROWS = 2; // Main hallway
  const WING_ROWS = 7;
  const WING_COLS = 2;

  // Calculate total canvas dimensions
  const MAIN_WIDTH = ROOMS_PER_ROW * (ROOM_SIZE + ROOM_GAP) - ROOM_GAP;
  const WING_WIDTH = WING_COLS * (ROOM_SIZE + ROOM_GAP) - ROOM_GAP;
  const WING_HEIGHT = WING_ROWS * (ROOM_SIZE + ROOM_GAP) - ROOM_GAP;
  const CANVAS_WIDTH = CANVAS_PADDING * 2 + MAIN_WIDTH + WING_WIDTH * 2 + ROOM_GAP * 2;
  const CANVAS_HEIGHT = CANVAS_PADDING * 2 + WING_HEIGHT + NUM_ROWS * (ROOM_SIZE + ROOM_GAP) - ROOM_GAP;

  // Generate rooms
  const rooms = [];
  let roomCount = 1;

  // Left wing rooms
  for (let row = 0; row < WING_ROWS; row++) {
    for (let col = 0; col < WING_COLS; col++) {
      const x = CANVAS_PADDING + col * (ROOM_SIZE + ROOM_GAP);
      const y = CANVAS_PADDING + row * (ROOM_SIZE + ROOM_GAP);

      rooms.push({
        id: `left-wing-room-${roomCount}`,
        name: `LW ${roomCount}`,
        x: x,
        y: y,
        width: ROOM_SIZE,
        height: ROOM_SIZE,
        color: '#C8E6C9',
        details: {
          size: '100 sq ft',
          windows: Math.floor(Math.random() * 3) + 1,
          type: 'Wing Room'
        }
      });
      roomCount++;
    }
  }

  // Right wing rooms
  for (let row = 0; row < WING_ROWS; row++) {
    for (let col = 0; col < WING_COLS; col++) {
      const x = CANVAS_PADDING + WING_WIDTH + MAIN_WIDTH + ROOM_GAP * 3 + col * (ROOM_SIZE + ROOM_GAP);
      const y = CANVAS_PADDING + row * (ROOM_SIZE + ROOM_GAP);

      rooms.push({
        id: `right-wing-room-${roomCount}`,
        name: `RW ${roomCount}`,
        x: x,
        y: y,
        width: ROOM_SIZE,
        height: ROOM_SIZE,
        color: '#FFCDD2',
        details: {
          size: '100 sq ft',
          windows: Math.floor(Math.random() * 3) + 1,
          type: 'Wing Room'
        }
      });
      roomCount++;
    }
  }

  // Main hallway rooms (now at the bottom)
  for (let row = 0; row < NUM_ROWS; row++) {
    for (let col = 0; col < ROOMS_PER_ROW; col++) {
      if (row === 0 && col === 5) continue; // Skip lounge position

      const x = CANVAS_PADDING + WING_WIDTH + ROOM_GAP + col * (ROOM_SIZE + ROOM_GAP);
      const y = CANVAS_PADDING + WING_HEIGHT + row * (ROOM_SIZE + ROOM_GAP);

      // Special handling for lounge
      if (row === 0 && col === 4) {
        rooms.push({
          id: 'lounge',
          name: 'Lounge',
          x: x,
          y: y,
          width: ROOM_SIZE * 2 + ROOM_GAP,
          height: ROOM_SIZE,
          color: '#FFE0B2',
          details: {
            size: '200 sq ft',
            windows: 4,
            type: 'Common Area',
            features: 'Seating Area, TV Space'
          }
        });
      } else {
        rooms.push({
          id: `room-${roomCount}`,
          name: `Room ${roomCount}`,
          x: x,
          y: y,
          width: ROOM_SIZE,
          height: ROOM_SIZE,
          color: '#E3F2FD',
          details: {
            size: '100 sq ft',
            windows: Math.floor(Math.random() * 3) + 1,
            type: 'Standard Room'
          }
        });
      }
      roomCount++;
    }
  }

  const drawFloorPlan = (ctx) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    rooms.forEach(room => {
      ctx.fillStyle = selectedRoom?.id === room.id
        ? (room.id.includes('wing') ? '#A5D6A7' : '#BBDEFB')
        : room.color;
      ctx.fillRect(room.x, room.y, room.width, room.height);

      ctx.strokeStyle = selectedRoom?.id === room.id ? '#1976D2' : '#90CAF9';
      ctx.lineWidth = selectedRoom?.id === room.id ? 2 : 1;
      ctx.strokeRect(room.x, room.y, room.width, room.height);

      ctx.fillStyle = '#333';
      ctx.font = room.id === 'lounge' ? '14px Arial' : '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        room.name,
        room.x + room.width / 2,
        room.y + room.height / 2
      );
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawFloorPlan(ctx);
  }, [selectedRoom]);

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedRoom = rooms.find(room =>
      x >= room.x && x <= room.x + room.width &&
      y >= room.y && y <= room.y + room.height
    );

    setSelectedRoom(clickedRoom || null);
  };

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const isOverRoom = rooms.some(room =>
      x >= room.x && x <= room.x + room.width &&
      y >= room.y && y <= room.y + room.height
    );

    canvas.style.cursor = isOverRoom ? 'pointer' : 'default';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Floor Plan</h2>
        <p className="text-gray-600">Click on a room to view details</p>
      </div>

      <div className="flex gap-4">
        <div>
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border border-gray-300 rounded-lg shadow-sm bg-white"
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
          />
        </div>

        {selectedRoom && (
          <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-sm w-64">
            <h3 className="text-xl font-semibold mb-2">{selectedRoom.name}</h3>
            <div className="space-y-2">
              <p><strong>Size:</strong> {selectedRoom.details.size}</p>
              <p><strong>Windows:</strong> {selectedRoom.details.windows}</p>
              <p><strong>Type:</strong> {selectedRoom.details.type}</p>
              {selectedRoom.details.features && (
                <p><strong>Features:</strong> {selectedRoom.details.features}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BakerFloorPlan;