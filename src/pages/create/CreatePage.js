import styles from './CreatePage.module.css';
import { useEffect, useRef, useState } from 'react';
import { ControlPanel } from './ControlPanel';
import { startDebate, postMessage } from 'pages/api/chat/functions';
import { useIsMobile } from 'hooks/useIsMobile';
import { ChatMessage } from 'components/ChatMessage/ChatMessage';
import Lottie from 'lottie-react';
import spaceAnimation from 'assets/lottie/space.json';
import { Text } from 'components';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { delay } from 'utils/delay';

export const CreatePage = () => {
  const [typing, setTyping] = useState(false);
  const [currentRole, setCurrentRole] = useState('user');
  const [chatHistory, setChatHistory] = useState([]);
  const [names, setNames] = useState([]);
  const [avatars, setAvatars] = useState([]);

  const isMobile = useIsMobile();
  const scrollToDiv = useRef(null);

  const [isControlPanelVisible, setIsControlPanelVisible] = useState(true);
  const isChatVisible = !isMobile || (isMobile && !isControlPanelVisible);

  useEffect(() => {
    disableBodyScroll(document.body);

    return () => {
      enableBodyScroll(document.body);
    };
  }, []);

  // Scrolls the chat to the bottom after a new message
  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollToDiv.current) {
        scrollToDiv.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        });
      }
    }, 100);
  };

  const resetChat = async ({ names, avatars }) => {
    setNames(names);
    setAvatars(avatars);

    setTyping(true);
    setChatHistory([]);
    setCurrentRole('user');
    setIsControlPanelVisible(false);
  };

  // Simulates a chat conversation with alternating user and AI messages
  const startChat = async ({
    names,
    stances,
    personalities,
    avatars,
    messagesCount,
    isAgreementOn,
  }) => {
    await resetChat({ names, avatars });
    const initialMessage = await startDebate(names, stances, personalities, messagesCount);

    let lastMessage = {
      role: 'user',
      content: initialMessage,
    };

    let chatMessages = [lastMessage];
    setChatHistory(chatMessages);
    setTyping(false);

    for (let i = 0; i < messagesCount * 2 - 1; i++) {
      const role = i % 2 === 0 ? 'assistant' : 'user';
      await delay(1000);
      setCurrentRole(role);
      setTyping(true);

      try {
        const messageData = await postMessage('/api/chat', {
          chatHistory: [...chatMessages],
          stances: stances,
          names: names,
          personalities: personalities,
          role: role,
          messagesCount: messagesCount,
          isAgreementOn: isAgreementOn,
        });

        const aiMessage = {
          role: role,
          content: messageData,
        };

        chatMessages = [...chatMessages, aiMessage];
        setChatHistory(chatMessages);
        lastMessage = aiMessage;
        setTyping(false);
      } catch (error) {
        console.log(error);
        break;
      }
    }

    if (!isMobile) {
      setIsControlPanelVisible(true);
    }
  };

  // Scroll to bottom whenever chatMessages changes
  useEffect(() => {
    scrollToBottom();
    console.log('chatHistory', chatHistory);
  }, [chatHistory]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div
          className={styles.controlPanel}
          data-full={!isChatVisible}
          data-visible={isControlPanelVisible}
        >
          <ControlPanel startChat={startChat} />
        </div>
        <div
          className={styles.chatArea}
          data-rounded={!isControlPanelVisible}
          data-visible={isChatVisible}
        >
          {chatHistory.length === 0 && !typing ? (
            <div className={styles.emptyChatContainer}>
              <div className={styles.spaceAnimation}>
                <Lottie animationData={spaceAnimation} />
              </div>
              <Text size="s" className={styles.spaceText}>
                Waiting for you to start the debate...
              </Text>
            </div>
          ) : (
            <>
              <div className={styles.chatContainer}>
                {chatHistory?.map((message, index) => (
                  <ChatMessage
                    role={message.role}
                    key={index}
                    message={message.content}
                    names={names}
                    avatars={avatars}
                  />
                ))}
                {typing && (
                  <ChatMessage
                    role={currentRole}
                    message="Typing..."
                    names={names}
                    avatars={avatars}
                  />
                )}
              </div>
              <div ref={scrollToDiv} />
            </>
          )}
        </div>
      </div>
    </main>
  );
};
