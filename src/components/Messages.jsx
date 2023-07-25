import React, { Fragment, useContext, useEffect, useState } from "react";
import Message from "./Message";
import { ChatContext } from "../context/ChatContext";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  let lastDisplayedDate = null;

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });
    return () => {
      unsub();
    };
  }, [data.chatId]);

  const getFormattedDate = (m) => {
    return m.date.toDate().toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="messages">
      {messages.map((m) => {
        const formattedDate = getFormattedDate(m);
        const displayDate = lastDisplayedDate !== formattedDate;
        lastDisplayedDate = formattedDate;
        return (
          <Fragment key={m.id}>
            {displayDate && (
              <div className="messagesDate">{lastDisplayedDate}</div>
            )}
            <Message message={m} />
          </Fragment>
        );
      })}
    </div>
  );
}
