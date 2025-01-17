'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoX } from "react-icons/go";
import { FaMicrophoneAlt, FaMicrophoneAltSlash } from "react-icons/fa";
import { Button } from './button';
import { Input } from './input';
import { Card, CardHeader, CardContent } from "./card";
import { RiRobot2Line, RiRobot2Fill } from "react-icons/ri";
import { useAICommand } from '@/hooks/use-ai-command';

interface AICommandInputProps {
  onCommandProcessed: (result: any) => void;
}

const AICommandInput: React.FC<AICommandInputProps> = ({ onCommandProcessed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [textInput, setTextInput] = useState('');
  const { executeCommand, isLoading } = useAICommand();

  const processCommand = async (command: string) => {
    if (!command.trim()) return;
    
    try {
      const result = await executeCommand(command);
      onCommandProcessed(result);
      setTextInput(''); // Clear input after processing
      setIsOpen(false); // Close the input after successful processing
    } catch (error) {
      // Error handling is managed by the hook via toast notifications
      console.error('Error in component:', error);
    }
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
                  <h3 className="text-lg font-semibold">TaskUP AI Assistant</h3>
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
                    disabled={isLoading || !textInput}
                  >
                    {isLoading ? 'Processing...' : 'Process Command'}
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
            <RiRobot2Line className="h-6 w-6" />
          )}
        </motion.div>
      </Button>
    </div>
  );
};

export default AICommandInput;