import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ChatContext = createContext({
  unreadMessages: {},
  markMessageAsRead: (userId) => {},
  incrementUnreadMessages: (userId) => {},
  messages: (msg) => {},
});

function ChatContextProvider({ children }) {
  const [unreadMessages, setUnreadMessages] = useState({});

  useEffect(() => {
    async function fetchMessages() {
      const storedMessages = await AsyncStorage.getItem("unreadMessages");
      if (storedMessages) {
        setUnreadMessages(messages);
      }
    }
    fetchMessages();
  }, []);

  const markMessageAsRead = (receiverId) => {
    setUnreadMessages((prevUnreadMessages) => {
      const updatedUnreadMessages = { ...prevUnreadMessages };
      delete updatedUnreadMessages[receiverId];
      AsyncStorage.setItem(
        "unreadMesssages",
        JSON.stringify(updatedUnreadMessages)
      );

      return updatedUnreadMessages;
    });
  };

  const incrementUnreadMessages = (receiverId) => {
    setUnreadMessages((prevUnreadMessages) => {
      const updatedUnreadMessages = {
        ...prevUnreadMessages,
        [receiverId]: (prevUnreadMessages[receiverId] || 0) + 1,
      };
      AsyncStorage.setItem("unreadMesssages", JSON.stringify(unreadMessages));

      return updatedUnreadMessages;
    });
  };
  function messages(msg) {
    setUnreadMessages(msg);
    AsyncStorage.setItem("unreadMesssages", JSON.stringify(msg));
  }

  return (
    <ChatContext.Provider
      value={{
        unreadMessages: unreadMessages,
        markMessageAsRead: markMessageAsRead,
        incrementUnreadMessages: incrementUnreadMessages,
        messages: messages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
export default ChatContextProvider;
