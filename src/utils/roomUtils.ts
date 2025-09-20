export const generateRoomId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const generateRoomUrl = (roomId: string): string => {
  return `${window.location.origin}/?room=${roomId}`;
};

export const getRoomIdFromUrl = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get('room');
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
};