import Image from 'next/image';
import styles from './ChatMessage.module.css';

export function ChatMessage({ message, role, names, avatars }) {
  const currentNames = names?.length ? names : ['Ahmad', 'Bartek'];
  const currentAvatar = role === 'user' ? avatars[0] : avatars[1];
  const currentName = role === 'user' ? currentNames[0] : currentNames[1];

  return (
    <div className={styles.messageContainer}>
      <div className={role === 'assistant' ? styles.messageHeaderAssistant : styles.messageHeader}>
        {currentAvatar && (
          <div className={styles.avatar}>
            <Image src={currentAvatar} alt="avatar" width={42} height={42} quality={50} />
          </div>
        )}
        <div>{currentName}</div>
      </div>
      <div className={role === 'assistant' ? styles.chatBubbleAssistant : styles.chatBubble}>
        {message}
      </div>
    </div>
  );
}
