import React, { useState, useRef, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { ChatProps } from "./chat";
import LanguageSelectionPopover from "./LanugageSelectionPopover";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "../ui/textarea";
import { EmojiPicker } from "../emoji-picker";
import { ImageIcon, PaperPlaneIcon, StopIcon } from "@radix-ui/react-icons";
import { Player } from '@lordicon/react';
import lottie from 'lottie-web';
import VoiceChatIcon from '../../../public/voice-chat.json'
import LoadingIcon from '../../../public/loading.json'

export default function ChatBottombar({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  stop,
}: ChatProps) {
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); 
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en-EN');

  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  useEffect(() => {
    if (transcript) {
      const syntheticEvent = {
        target: {
          value: transcript
        }
      };
      handleInputChange(syntheticEvent as React.ChangeEvent<HTMLTextAreaElement>);
    }
  }, [handleInputChange, transcript]);

  const playerRef = useRef<Player>(null);

  useEffect(() => {
    if (isListening) {
      playerRef.current?.playFromBeginning();
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [isListening]);

  const startListening = () => {
    setIsListening(true);
    setIsButtonDisabled(true);
    SpeechRecognition.startListening({ language: 'fr-FR' });
  };

  const stopListening = () => {
    setIsListening(false);
    setIsButtonDisabled(true);
    SpeechRecognition.stopListening();
  };

  const handleSpeechRecognitionEnd = () => {
    setIsButtonDisabled(false);
  };

  React.useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="p-4 flex justify-between w-full items-center gap-2">
      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="w-full relative mb-2 items-center"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
            }}
            className="w-full items-center flex relative gap-2"
          >
            <div className="flex">
            <button
             
              onClick={(e) => {
                e.preventDefault();
                if (isListening) {
                  stopListening();
                } else {
                  startListening();
                }
              }}
              className={cn(
                buttonVariants({ variant: "default", size: "icon" })
              )}
            >
              {isListening ? (
                <Player 
                  ref={playerRef} 
                  onComplete={() => playerRef.current?.playFromBeginning()}
                  icon={LoadingIcon}
                />
              ) : (
                <Player
                  ref={playerRef} 
                  icon={VoiceChatIcon}
                />
              )}
            </button>

            </div>
            <LanguageSelectionPopover onSelectLanguage={setSelectedLanguage} />
            <TextareaAutosize
              autoComplete="off"
              value={input}
              ref={inputRef}
              onKeyDown={handleKeyPress}
              onChange={handleInputChange}
              name="message"
              placeholder={isListening ? "I'm listening...very carefully" : "What would you like to talk about?"}
              className="border-input max-h-20 px-5 py-4 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full border rounded-full flex items-center h-14 resize-none overflow-hidden dark:bg-card/35"
            />
            {!isLoading ? (
              <Button
                className="shrink-0"
                variant="secondary"
                size="icon"
                type="submit"
                disabled={isLoading || !input.trim() || isButtonDisabled}
              >
                <PaperPlaneIcon color="#5171FF" className=" w-6 h-6" />
              </Button>
            ) : (
              <Button
                className="shrink-0"
                variant="secondary"
                size="icon"
                onClick={stop}
              >
                <StopIcon className="w-6 h-6"  color="#5171FF" />
              </Button>
            )}
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
