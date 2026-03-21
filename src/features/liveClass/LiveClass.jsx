import { useEffect, useState } from "react";
import { Room, connect } from "livekit-client";

import Whiteboard from "./Whiteboard";
import StudentGrid from "./StudentGrid";
import TeacherCamera from "./TeacherCamera";
import LiveControls from "./LiveControls";

export default function LiveClass({ roomName, username }) {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const joinRoom = async () => {
      const res = await fetch(
        `http://localhost:5000/api/live/token?room=${roomName}&username=${username}`
      );

      const data = await res.json();

      const room = await connect(
        "wss://your-livekit-url",
        data.token
      );

      setRoom(room);
    };

    joinRoom();
  }, []);

  if (!room) return <div>Connecting...</div>;

  return (
    <div className="live-class">

      <TeacherCamera room={room} />

      <Whiteboard />

      <StudentGrid room={room} />

      <LiveControls room={room} />

    </div>
  );
}