import { useEffect, useRef, useState } from 'react';
import './VanMeterFloorPlan.css';

const VanMeterFloorPlan = () => {
  const canvasRef = useRef(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Define room and grid properties
  const ROOM_WIDTH = 42; // Room width
  const ROOM_HEIGHT = 50; // Room height
  const ROOM_GAP = 5; // Gap between rooms
  const CANVAS_PADDING = 20; // Padding around the canvas

  // Grid configuration
  const ROOMS_PER_ROW = 29; // Rooms per row
  const NUM_ROWS = 2; // Number of rows

  // Calculate total canvas size
  const CANVAS_WIDTH = ROOMS_PER_ROW * (ROOM_WIDTH + ROOM_GAP) + CANVAS_PADDING * 2;
  const CANVAS_HEIGHT = NUM_ROWS * (ROOM_HEIGHT + ROOM_GAP) + CANVAS_PADDING * 2;

  // Generate rooms
  const rooms = [];
  let roomCount = 1;

  for (let row = 0; row < NUM_ROWS; row++) {
    for (let col = 0; col < ROOMS_PER_ROW; col++) {
      const x = CANVAS_PADDING + col * (ROOM_WIDTH + ROOM_GAP);
      const y = CANVAS_PADDING + row * (ROOM_HEIGHT + ROOM_GAP);

      rooms.push({
        id: `room-${roomCount}`,
        name: `Rm ${roomCount}`,
        x,
        y,
        width: ROOM_WIDTH,
        height: ROOM_HEIGHT,
        color: '#E3F2FD',
        details: {
          size: '100 sq ft',
          windows: Math.floor(Math.random() * 3) + 1,
          type: 'Standard Room',
        },
      });

      roomCount++;
    }
  }

  // Merge Room 5 and Room 6 into a Kitchen
  const room5 = rooms.find((room) => room.id === 'room-5');
  const room6 = rooms.find((room) => room.id === 'room-6');
  if (room5 && room6) {
    room5.name = 'Kitchen';
    room5.width = ROOM_WIDTH * 2 + ROOM_GAP; // Combined width of two rooms plus the gap
    room5.details = {
      size: '200 sq ft',
      windows: room5.details.windows + room6.details.windows,
      type: 'Kitchen',
    };
    // Remove room6 from the array
    const index = rooms.indexOf(room6);
    if (index !== -1) {
      rooms.splice(index, 1);
    }
  }

  const room21 = rooms.find((room) => room.id === 'room-21');
  const room22 = rooms.find((room) => room.id === 'room-22');
  if (room21 && room22) {
    room21.name = 'Lounge';
    room21.width = ROOM_WIDTH * 2 + ROOM_GAP; // Combined width of two rooms plus the gap
    room21.details = {
      size: '200 sq ft',
      windows: room21.details.windows + room22.details.windows,
      type: 'Lounge',
    };
    // Remove room6 from the array
    const index = rooms.indexOf(room22);
    if (index !== -1) {
      rooms.splice(index, 1);
    }
  }

  const room13 = rooms.find((room) => room.id === 'room-13');
  if (room13) {
    room13.name = 'Bath';
    room13.width = ROOM_WIDTH;
    room13.details = {
      size: '200 sq ft',
      windows: room13.windows,
      type: 'Lounge',
    };
  }

  const drawFloorPlan = (ctx) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw each room
    rooms.forEach((room) => {
      // Fill room
      ctx.fillStyle = selectedRoom?.id === room.id ? '#BBDEFB' : room.color;
      ctx.fillRect(room.x, room.y, room.width, room.height);

      // Draw border
      ctx.strokeStyle = selectedRoom?.id === room.id ? '#1976D2' : '#90CAF9';
      ctx.lineWidth = selectedRoom?.id === room.id ? 2 : 1;
      ctx.strokeRect(room.x, room.y, room.width, room.height);

      // Add room name
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
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

    // Check which room was clicked
    const clickedRoom = rooms.find(
      (room) =>
        x >= room.x &&
        x <= room.x + room.width &&
        y >= room.y &&
        y <= room.y + room.height
    );

    setSelectedRoom(clickedRoom || null);
  };

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Change cursor if over a room
    const isOverRoom = rooms.some(
      (room) =>
        x >= room.x &&
        x <= room.x + room.width &&
        y >= room.y &&
        y <= room.y + room.height
    );

    canvas.style.cursor = isOverRoom ? 'pointer' : 'default';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">VanMeter Floor Plan</h2>
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
              <p>
                <strong>Size:</strong> {selectedRoom.details.size}
              </p>
              <p>
                <strong>Windows:</strong> {selectedRoom.details.windows}
              </p>
              <p>
                <strong>Type:</strong> {selectedRoom.details.type}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VanMeterFloorPlan;
