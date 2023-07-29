import styles from './CreatePage.module.css';
import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from 'hooks/useIsMobile';
import { ChatMessage } from 'components/ChatMessage/ChatMessage';
import Lottie from 'lottie-react';
import spaceAnimation from 'assets/lottie/space.json';
import { Text } from 'components';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

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

  return (
    <main className={styles.main}>
      <div className={styles.container}>
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
