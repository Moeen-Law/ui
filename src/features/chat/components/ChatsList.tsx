import type { ChatResponseDatum } from "../types";
import { motion } from "framer-motion";
import ChatCard from "./ChatCard";
import { useParams } from "react-router-dom";
import { useState } from "react";
import ChatAlertModal from "./ChatAlertModal";


interface ChatsListProps {
    chats: ChatResponseDatum[];
}


function ChatsList({chats}: ChatsListProps) {
  const { chatId } = useParams();

  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  
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
                          setOpenAlertModal={setOpenAlertModal}
                          setSelectedId={setSelectedChatId}
                      />
                  </motion.div>
              ))
       }
       {selectedChatId && (
        <ChatAlertModal chatIdToDelete={selectedChatId} openAlertModal={openAlertModal} setOpenAlertModal={setOpenAlertModal} />
       )}
    </>
  )
}

export default ChatsList