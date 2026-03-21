import React, { useEffect, useRef } from "react"
import { Room } from "livekit-client"

export default function TestLiveRoom() {

  const videoRef = useRef(null)

  useEffect(() => {

    const connect = async () => {

      const room = new Room()

      const tokenData = {
        url: "wss://elmostashar2026-4wiyont5.livekit.cloud",
        token: "eyJhbGciOiJIUzI1NiJ9.eyJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6InRlc3QiLCJjYW5QdWJsaXNoIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWV9LCJpc3MiOiJBUEluRlNxd2p3dEhrdkoiLCJleHAiOjE3NzI4MDU3NzUsIm5iZiI6MCwic3ViIjoiYWhtZWQifQ.fHY1TpKRZ3zaRcYJME7zZUVQoF4I0zmdkypwPON0IU4"
      }

      await room.connect(tokenData.url, tokenData.token)

      await room.localParticipant.enableCameraAndMicrophone()

      const tracks = room.localParticipant.videoTracks

      tracks.forEach(pub => {

        const track = pub.track

        track.attach(videoRef.current)

      })

    }

    connect()

  }, [])

  return (

    <div
      style={{
        height:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        background:"#111"
      }}
    >

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width:"500px",
          borderRadius:"12px"
        }}
      />

    </div>

  )

}