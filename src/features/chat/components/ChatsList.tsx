import type { ChatResponseDatum } from "../types";
import { motion } from "framer-motion";
import ChatCard from "./ChatCard";
import { useParams } from "react-router-dom";


interface ChatsListProps {
    chats: ChatResponseDatum[];
}


function ChatsList({chats}: ChatsListProps) {
  const { chatId } = useParams();
  
  return (
    <>
       {
              chats.map((chat, index) => (
                  <motion.div  
                      key={chat.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                  >
                      <ChatCard
                          chat={chat}
                          isActive={chat.id === chatId}
                      />
                  </motion.div>
              ))
       }
    </>
  )
}

export default ChatsList