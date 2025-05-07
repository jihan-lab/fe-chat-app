"use client";

import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { Alert, Card, Textarea } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

function ChatPage() {
  const socketRef: Socket | any = useRef<Socket | null>(null);

  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [allMessage, setAllMessage] = useState("");
  const sendMessage = () => {
    if (!message) {
      return setIsVisible(true);
    }
    // Kirim pesan ke server
    socketRef.current.emit("send_message", {
      content: message,
      senderId: 2, // pastikan ini ID user valid kalau kamu simpan ke DB
    });
    setMessage("");
    setIsVisible(false);
  };
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected", socket.id);
    });

    socket.on("receive_message", (data) => {
      console.log("Pesan diterima dari server:", data?.content);
      setAllMessage(data?.content);
    });

    return () => {
      socket.disconnect();
      console.log("Disconnected");
    };
  }, []);
  return (
    <Card className="grid grid-cols-10 p-3 min-h-[70vh]">
      <div className="col-span-3">username</div>
      <div className="col-span-7 relative">
        <Alert
          color="warning"
          description={"Tulis pesan dahulu"}
          isVisible={isVisible}
          //   title={title}
          variant="faded"
          onClose={() => setIsVisible(false)}
        />
        <div>{allMessage}</div>
        <div className="flex gap-2 absolute bottom-0 w-full">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            minRows={1}
            className="max-w-xl"
            //   label="Description"
            placeholder="Tulis pesan"
            maxLength={200}
          />
          <PaperAirplaneIcon
            onClick={sendMessage}
            className="size-6 text-blue-500 mt-1"
          />
        </div>
      </div>
    </Card>
  );
}

export default ChatPage;
