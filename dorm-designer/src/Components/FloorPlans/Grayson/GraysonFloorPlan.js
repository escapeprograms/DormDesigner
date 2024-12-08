import { useEffect, useRef, useState } from 'react';
import './GraysonFloorPlan.css';

const GraysonFloorPlan = () => {
  const canvasRef = useRef(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Define grid properties
  const ROOM_SIZE = 60;
  const ROOM_GAP = 5;
  const CANVAS_PADDING = 20;

  // Grid configuration
  const ROOMS_PER_ROW = 8; // Rooms per row for both grids
  const NUM_ROWS = 2; // Number of rows for both grids

  // Increase diagonal offset to separate grids
  const DIAGONAL_OFFSET_X = ROOMS_PER_ROW * (ROOM_SIZE + ROOM_GAP) + CANVAS_PADDING;
  const DIAGONAL_OFFSET_Y = NUM_ROWS * (ROOM_SIZE + ROOM_GAP) + CANVAS_PADDING;

  // Calculate total canvas size
  const CANVAS_WIDTH = DIAGONAL_OFFSET_X + ROOMS_PER_ROW * (ROOM_SIZE + ROOM_GAP)+65;
  const CANVAS_HEIGHT = DIAGONAL_OFFSET_Y + NUM_ROWS * (ROOM_SIZE + ROOM_GAP);

  // Vertical rectangle between the grids
  const RECT_WIDTH = 30; // Width of the vertical rectangle
  const RECT_HEIGHT = 2*NUM_ROWS * (ROOM_SIZE + ROOM_GAP) + ROOM_GAP; // Height spans the grid
  const RECT_X = CANVAS_PADDING + ROOMS_PER_ROW * (ROOM_SIZE + ROOM_GAP) + ROOM_GAP / 2;
  const RECT_Y = CANVAS_PADDING;

  // Generate rooms for the first grid
  const roomsGrid1 = [];
  let roomCount1 = 1;

  for (let row = 0; row < NUM_ROWS; row++) {
    for (let col = 0; col < ROOMS_PER_ROW; col++) {
      const x = CANVAS_PADDING + col * (ROOM_SIZE + ROOM_GAP);
      const y = CANVAS_PADDING + row * (ROOM_SIZE + ROOM_GAP) + 135;

      roomsGrid1.push({
        id: `grid1-room-${roomCount1}`,
        name: `G 1 - ${roomCount1}`,
        x: x,
        y: y,
        width: ROOM_SIZE,
        height: ROOM_SIZE,
        color: '#E3F2FD',
        details: {
          size: '100 sq ft',
          windows: Math.floor(Math.random() * 3) + 1,
          type: 'Standard Room',
        },
      });

      roomCount1++;
    }
  }

  // Generate rooms for the second grid
  const roomsGrid2 = [];
  let roomCount2 = 1;

  for (let row = 0; row < NUM_ROWS; row++) {
    for (let col = 0; col < ROOMS_PER_ROW; col++) {
      const x = CANVAS_PADDING + DIAGONAL_OFFSET_X + col * (ROOM_SIZE + ROOM_GAP) +20;
      const y = CANVAS_PADDING + DIAGONAL_OFFSET_Y + row * (ROOM_SIZE + ROOM_GAP) - 150;

      roomsGrid2.push({
        id: `grid2-room-${roomCount2}`,
        name: `G2 - ${roomCount2}`,
        x: x,
        y: y,
        width: ROOM_SIZE,
        height: ROOM_SIZE,
        color: '#C8E6C9',
        details: {
          size: '100 sq ft',
          windows: Math.floor(Math.random() * 3) + 1,
          type: 'Standard Room',
        },
      });

      roomCount2++;
    }
  }

  const allRooms = [...roomsGrid1, ...roomsGrid2];

  const drawFloorPlan = (ctx) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw each room
    allRooms.forEach((room) => {
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

    // Draw the vertical rectangle
    ctx.fillStyle = '#FFCCBC'; // Rectangle color
    ctx.fillRect(RECT_X, RECT_Y, RECT_WIDTH, RECT_HEIGHT);

    ctx.strokeStyle = '#FF7043'; // Border color
    ctx.lineWidth = 2;
    ctx.strokeRect(RECT_X, RECT_Y, RECT_WIDTH, RECT_HEIGHT);

    // Add text inside the rectangle
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.save();
    ctx.translate(RECT_X + RECT_WIDTH / 2, RECT_Y + RECT_HEIGHT / 2);
    ctx.rotate(-Math.PI / 2); // Rotate text for vertical alignment
    ctx.fillText('Hallway', 0, 0);
    ctx.restore();
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
    const clickedRoom = allRooms.find(
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
    const isOverRoom = allRooms.some(
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

export default GraysonFloorPlan;