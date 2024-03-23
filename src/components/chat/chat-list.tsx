import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChatProps } from "./chat";
import Image from "next/image";
import CodeDisplayBlock from "../code-display-block";
import { Button, buttonVariants } from "../ui/button";

export default function ChatList({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  stop,
}: ChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState<string>("");
  const [playingIndex, setPlayingIndex] = useState<number>(-1); // Index of the message being played
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0); // Index of the last played message
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]); // Available voices
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null); // Selected voice

  useEffect(() => {
    // Fetch available voices when the component mounts
    const fetchVoices = () => {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();
      setVoices(voices);
      // Automatically select a good English voice
      const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
      const goodEnglishVoice = englishVoices.find(voice => voice.name.includes('English') && voice.lang.includes('US'));
      setSelectedVoice(goodEnglishVoice || null);
    };

    fetchVoices();

    // Add event listener to update voices when the list changes
    window.speechSynthesis.addEventListener('voiceschanged', fetchVoices);

    // Cleanup event listener
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', fetchVoices);
    };
  }, []);

  const playMessage = (index: number) => {
    if (!selectedVoice) {
      console.error("No voice selected");
      return;
    }
  
    const messageContent = messages[index].content.replace(/[*]/g, ''); // Remove '*' characters
    const utterance = new SpeechSynthesisUtterance(messageContent);
    utterance.voice = selectedVoice;
  
    utterance.addEventListener('end', () => {
      setCurrentMessageIndex(index + 1); // Move to the next message
      if (index + 1 < messages.length && index + 1 === currentMessageIndex && playingIndex === index) {
        playMessage(index + 1); // Play the next message
      } else {
        setPlayingIndex(-1); // Stop playing when all messages are played or manually stopped
      }
    });
    setPlayingIndex(index);
    window.speechSynthesis.speak(utterance);
  };
  

  const stopPlaying = () => {
    setPlayingIndex(-1);
    window.speechSynthesis.cancel();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const username = localStorage.getItem("ollama_user");
    if (username) {
      setName(username);
    }
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  return (
    <div
      id="scroller"
      className="w-full overflow-y-scroll overflow-x-hidden h-full justify-end"
    >
      <div className="w-full flex flex-col overflow-x-hidden overflow-y-hidden min-h-full justify-end">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, scale: 1, y: 20, x: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 1, y: 20, x: 0 }}
            transition={{
              opacity: { duration: 0.1 },
              layout: {
                type: "spring",
                bounce: 0.3,
                duration: messages.indexOf(message) * 0.05 + 0.2,
              },
            }}
            className={cn(
              "flex flex-col gap-2 p-4 whitespace-pre-wrap",
              message.role === "user" ? "items-end" : "items-start"
            )}
          >
            <div className="flex gap-3 items-center">
              {message.role === "user" && (
                <div className="flex items-end gap-3">
                  <span className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
                    {message.content}
                  </span>
                  <Avatar className="flex justify-start items-center overflow-hidden">
                    <AvatarImage
                      src="/"
                      alt="user"
                      width={6}
                      height={6}
                      className="object-contain"
                    />
                    <AvatarFallback>
                      {name && name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
        {message.role === "assistant" && (
          <div className="flex items-end gap-2">
            <Avatar className="flex justify-start items-center">
              <AvatarImage
                src="/convolang.png"
                alt="AI"
                width={6}
                height={6}
                className="object-contain"
              />
            </Avatar>
            <div className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto flex-grow">
              {/* Check if the message content contains a code block */}
              {message.content.split("```").map((part, idx) => {
                if (idx % 2 === 0) {
                  return (
                    <React.Fragment key={idx}>{part}</React.Fragment>
                  );
                } else {
                  return (
                    <pre className="whitespace-pre-wrap" key={idx}>
                      <CodeDisplayBlock code={part} lang="" />
                    </pre>
                  );
                }
              })}
              {isLoading &&
                messages.indexOf(message) === messages.length - 1 && (
                  <span className="animate-pulse" aria-label="Typing">
                    ...
                  </span>
                )}
            </div>
            {!playingIndex || playingIndex !== index ? ( // Render the play button if not playing
              <button
                
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" })
                )}
                onClick={() => playMessage(index)}
              >Listen</button>
            ) : ( // Render the stop button if playing
              <button 
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" })
                )} onClick={stopPlaying}>Stop</button>
            )}
          </div>
        )}
            </div>
          </motion.div>
        ))}
      </div>
      <div id="anchor" ref={bottomRef}></div>
    </div>
  );
}
