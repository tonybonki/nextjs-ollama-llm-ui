import React, { useState, useRef, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { ChatProps } from "./chat";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "../ui/textarea";
import { EmojiPicker } from "../emoji-picker";
import { ImageIcon, PaperPlaneIcon, StopIcon } from "@radix-ui/react-icons";

export default function ChatBottombar({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  stop,
}: ChatProps) {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (transcript) {
      // Create a synthetic event object
      const syntheticEvent = {
        target: {
          value: transcript
        }
      };

      // Call handleInputChange with the synthetic event object
      handleInputChange(syntheticEvent as React.ChangeEvent<HTMLTextAreaElement>);
    }
  }, [handleInputChange, transcript]);

  

  const startListening = () => {
    setIsListening(true);
    SpeechRecognition.startListening({ language: 'fr-FR' });
  };

  const stopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
  };

  React.useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup the event listener on component unmount
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
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default behavior
                  if (isListening) {
                    stopListening();
                  } else {
                    startListening(); // Trigger speech recognition
                  }
                }}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "icon" })
                )}
              >
                <ImageIcon
                  className="w-6 h-6 text-muted-foreground"
                />
              </Link>
            </div>

            <TextareaAutosize
              autoComplete="off"
              value={input}
              ref={inputRef}
              onKeyDown={handleKeyPress}
              onChange={handleInputChange}
              name="message"
              placeholder="What is our topic for today?"
              className="border-input max-h-20 px-5 py-4 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full border rounded-full flex items-center h-14 resize-none overflow-hidden dark:bg-card/35"
            />
            {!isLoading ? (
              <Button
                className="shrink-0"
                variant="secondary"
                size="icon"
                type="submit"
                disabled={isLoading || !input.trim()}
              >
                <PaperPlaneIcon className=" w-6 h-6 text-muted-foreground" />
              </Button>
            ) : (
              <Button
                className="shrink-0"
                variant="secondary"
                size="icon"
                onClick={stop}
              >
                <StopIcon className="w-6 h-6  text-muted-foreground" />
              </Button>
            )}
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
