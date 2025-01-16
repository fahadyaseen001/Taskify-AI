'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoHubot, GoX } from "react-icons/go";
import { FaMicrophoneAlt, FaMicrophoneAltSlash } from "react-icons/fa";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardContent } from "./ui/card";
import { RiRobot2Line, RiRobot2Fill } from "react-icons/ri";



interface AICommandInputProps {
  onCommandProcessed: (result: any) => void;
}

const AICommandInput: React.FC<AICommandInputProps> = ({ onCommandProcessed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [processing, setProcessing] = useState(false);

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map(result => result.transcript)
            .join('');
          
          setTextInput(transcript);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const processCommand = async (command: string) => {
    setProcessing(true);
    try {
      const response = await fetch('/api/ai/process-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command })
      });

      const result = await response.json();
      onCommandProcessed(result);
      setTextInput(''); // Clear input after processing
    } catch (error) {
      console.error('Error processing command:', error);
    }
    setProcessing(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px]"
          >
            <Card>
              <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">TaskUP AI Assistant </h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <GoX className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Message AI Bot"
                      className="flex-1"
                    />
                    <Button
                      variant={isListening ? "destructive" : "default"}
                      size="icon"
                      onClick={() => setIsListening(!isListening)}
                    >
                      {isListening ? 
                        <FaMicrophoneAltSlash className="h-5 w-5" /> : 
                        <FaMicrophoneAlt className="h-5 w-5" />
                      }
                    </Button>
                  </div>
                  <Button
                    variant="default"
                    onClick={() => processCommand(textInput)}
                    disabled={processing || !textInput}
                  >
                    {processing ? 'Processing...' : 'Process Command'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        variant="default"
        size="icon"
        className="rounded-full"
        onClick={() => setIsOpen(!isOpen)}
        asChild
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? (
            <div className="flex items-center gap-1">
              <RiRobot2Fill className="h-6 w-6" />
            </div>
          ) : (
            <RiRobot2Line  className="h-6 w-6" />
          )}
        </motion.div>
      </Button>
    </div>
  );
};

export default AICommandInput; 