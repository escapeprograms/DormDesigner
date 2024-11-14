import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLayoutById } from '../../../services/layoutServices';
import { createDesign } from '../../../services/designServices';
import './BakerFloorPlan.css';
const BakerFloorPlan = () => {
  const canvasRef = useRef(null);
  const {userId} = useParams();
  const {navigate} = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showButton, setShowButton] = useState(false);
  
  // Define grid properties
  const ROOM_SIZE = 60;
  const ROOM_GAP = 5;
  const CANVAS_PADDING = 20;
  
  // Calculate total dimensions
  const ROOMS_PER_ROW = 11;
  const NUM_ROWS = 2;
  const CANVAS_WIDTH = CANVAS_PADDING * 2 + ROOMS_PER_ROW * (ROOM_SIZE + ROOM_GAP) - ROOM_GAP;
  const CANVAS_HEIGHT = CANVAS_PADDING * 2 + NUM_ROWS * (ROOM_SIZE + ROOM_GAP) - ROOM_GAP;

  // Generate rooms with special handling for lounge
  const rooms = [];
  let roomCount = 1;

  for (let row = 0; row < NUM_ROWS; row++) {
    for (let col = 0; col < ROOMS_PER_ROW; col++) {
      // Skip room 6 as it's part of the lounge
      if (row === 0 && col === 5) continue;

      const x = CANVAS_PADDING + col * (ROOM_SIZE + ROOM_GAP);
      const y = CANVAS_PADDING + row * (ROOM_SIZE + ROOM_GAP);

      // Special handling for lounge (room 5)
      if (row === 0 && col === 4) {
        rooms.push({
          id: 'lounge',
          name: 'Lounge',
          x: x,
          y: y,
          width: ROOM_SIZE * 2 + ROOM_GAP, // Double width plus gap
          height: ROOM_SIZE,
          color: '#FFE0B2', // Different color for lounge
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

  const handleCreate = async () => {
    try {
      const data = await getLayoutById("6735729ec81258da256cb3e0");
      console.log(data.vertices);
      const newDesign = createDesign({ userId: userId, vertices: [[168,0],[168,160],[0,160],[0,0]], furnitureIds:["bed", "desk"]});
      navigate(`/editor/${userId}/${newDesign._id}`);
    } catch (error) {
      
    }
  };

  const drawFloorPlan = (ctx) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Draw each room
    rooms.forEach(room => {
      // Fill room
      ctx.fillStyle = selectedRoom?.id === room.id ? 
        (room.id === 'lounge' ? '#FFD180' : '#BBDEFB') : 
        room.color;
      ctx.fillRect(room.x, room.y, room.width, room.height);
      
      // Draw border
      ctx.strokeStyle = selectedRoom?.id === room.id ? '#1976D2' : '#90CAF9';
      ctx.lineWidth = selectedRoom?.id === room.id ? 2 : 1;
      ctx.strokeRect(room.x, room.y, room.width, room.height);
      
      // Add room name
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
    
    // Check which room was clicked
    const clickedRoom = rooms.find(room => 
      x >= room.x && x <= room.x + room.width &&
      y >= room.y && y <= room.y + room.height
    );
    
    setSelectedRoom(clickedRoom || null);
    setShowButton(true);
  };

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Change cursor if over a room
    const isOverRoom = rooms.some(room => 
      x >= room.x && x <= room.x + room.width &&
      y >= room.y && y <= room.y + room.height
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
      {showButton && <div className = "button" onClick = {handleCreate}>Create</div>}
    </div>
  );
};

export default BakerFloorPlan;