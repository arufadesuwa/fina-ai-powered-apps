"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { handleChat, handleChatStreaming } from "@/features/ai/chat";
import { cn } from "@/lib/utils";
import { BotIcon, ChevronDownIcon, EllipsisIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChatbotTextArea from "./ChatbotTextArea";
import { useMutation } from "@tanstack/react-query";
import Markdown from "react-markdown";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Conversation } from "@/app/types/ai";

export default function ChatBotDrawer() {
  const chatRef = useRef<HTMLDivElement>(null);
  const [conversation, setConversation] = useState<Conversation[]>([]);

  const [isThinking, setIsThinking] = useState<boolean>(false);

  // const { mutate: handleChatMutation, isPending } = useMutation({
  //   mutationFn: ({
  //     isThinking,
  //   }: {
  //     isThinking: boolean;
  //   }) => handleChat(conversation, isThinking),
  //   onSuccess: (response) => {
  //     let parts: {
  //       text: string;
  //       thought?: boolean;
  //     }[] = [];

  //     if (response?.thought !== '') {
  //       parts = [
  //         ...parts,
  //         { thought: true, text: response?.thought || 'Terjadi kesalahan' },
  //       ];
  //     }
  //     const botMessage = {
  //       role: 'model',
  //       parts: [...parts, { text: response?.answer || 'Terjadi kesalahan' }],
  //     };
  //     setConversation((prev) => [...prev, botMessage]);
  //   },
  //   onError: (error) => {
  //     const botMessage = {
  //       role: 'model',
  //       parts: [{ text: 'Terjadi kesalahan: ' + error.message }],
  //     };
  //     setConversation((prev) => [...prev, botMessage]);
  //   },
  // });

  const { mutate: handleChatMutation, isPending } = useMutation({
    mutationFn: async ({ isThinking }: { isThinking: boolean }) => {
      if (isThinking) {
        setConversation((prev) => [
          ...prev,
          { role: "model", parts: [{ thought: true, text: "" }, { text: "" }] },
        ]);
        const response = await handleChatStreaming(conversation, isThinking);
        for await (const chunk of response) {
          setConversation((prev) => {
            const newConversation = [...prev];
            const lastIndex = newConversation.length - 1;

            const parts = newConversation[lastIndex].parts;

            newConversation[lastIndex] = {
              ...newConversation[lastIndex],
              parts: [
                {
                  ...parts[0],
                  text: chunk.startsWith("[thought]")
                    ? parts[0].text + chunk.replace("[thought]", "")
                    : parts[0].text,
                },
                {
                  text: !chunk.startsWith("[thought]")
                    ? parts[1].text + chunk
                    : parts[1].text,
                },
              ],
            };
            return newConversation;
          });
        }
        return response;
      } else {
        setConversation((prev) => [
          ...prev,
          { role: "model", parts: [{ text: "" }] },
        ]);
        const response = await handleChatStreaming(conversation, isThinking);
        for await (const chunk of response) {
          setConversation((prev) => {
            const newConversation = [...prev];
            const lastIndex = newConversation.length - 1;

            newConversation[lastIndex] = {
              ...newConversation[lastIndex],
              parts: [
                { text: newConversation[lastIndex].parts[0].text + chunk },
              ],
            };
            return newConversation;
          });
        }
        return response;
      }
    },
    onError: (error) => {
      const botMessage = {
        role: "model",
        parts: [{ text: "Terjadi kesalahan (◕︿◕✿): " + error.message }],
      };
      setConversation((prev) => [...prev, botMessage]);
    },
  });

  function sendMessage(message: string) {
    const newMessage = {
      role: "user",
      parts: [{ text: message }],
    };
    setConversation((prev) => [...prev, newMessage]);
    handleChatMutation({ isThinking });
  }

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current?.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [conversation]);

  return (
    <Drawer direction="right" modal={false}>
      <DrawerTrigger className="fixed bottom-4 right-4" asChild>
        <Button
          className="rounded-full size-14"
          variant="outline"
          // onClick={async () => {
          // const result = await handleChat("dummy");
          // console.log(result);
          // }}
        >
          <BotIcon className="size-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-screen! md:w-110!">
        <DrawerHeader className="flex flex-row justify-between">
          <div>
            <DrawerTitle className="text-primary font-bold">
              AI Financial Advisor \(‾▿‾\)
            </DrawerTitle>
            <DrawerDescription>
              Get personalized financial advice (/‾▿‾)/
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button variant="outline" size="icon">
              <XIcon />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto ph-4 h-full">
          {conversation.length > 0 ? (
            <div
              ref={chatRef}
              className="flex flex-col h-full overflow-x-hidden no-scrollbar overflow-y-auto gap-8"
            >
              {conversation.map((message, index) => (
                <div
                  key={`conversation-${index}`}
                  className={cn(
                    "flex flex-col gap-2",
                    message.role === "model" ? "items-start" : "items-end",
                  )}
                >
                  <div
                    className={cn("flex flex-col w-full", {
                      "bg-primary/20 text-primary px-5 py-2 rounded-3xl rounded-br-md w-fit max-w-3/4":
                        message.role === "user",
                    })}
                  >
                    {message.role === "model" && (
                      <div className="flex items-center text-xs gap-1 text-primary font-semibold">
                        <BotIcon />
                        Fina Advisor
                      </div>
                    )}
                    {message.role === "model" ? (
                      <div className="response-ai">
                        {message.parts.map((part, indexPart) => (
                          <div key={`response-${index}-${indexPart}`}>
                            {part.thought ? (
                              <Collapsible>
                                <CollapsibleTrigger asChild>
                                  <Button variant="ghost">
                                    Tampilkan alur berpikir
                                    <ChevronDownIcon />
                                  </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <div className="ml-4 border-l pl-2">
                                    <Markdown>{part.text}</Markdown>
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            ) : (
                              <Markdown>{part.text}</Markdown>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      message.parts[0].text
                    )}
                  </div>
                </div>
              ))}
              {isPending && (
                <div className="flex items-center animate-pulse">
                  <EllipsisIcon className="size-8 text-primary/50" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-3xl font-bold text-primary">
                Hello there! :3
              </h2>
              <h4 className="text-xl mt-2">How i can help you</h4>
            </div>
          )}
        </div>
        <DrawerFooter>
          <ChatbotTextArea
            isThinking={isThinking}
            setIsThinking={setIsThinking}
            sendMessage={sendMessage}
            isPending={isPending}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
