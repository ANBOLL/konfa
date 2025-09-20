export interface Participant {
  id: string;
  nickname: string;
  isHost: boolean;
  isMuted: boolean;
  isCameraOn: boolean;
  isScreenSharing: boolean;
  joinedAt: Date;
  stream?: MediaStream;
}

export interface ChatMessage {
  id: string;
  type: 'message' | 'system';
  participantId?: string;
  participantName?: string;
  content: string;
  timestamp: Date;
}

export interface Room {
  id: string;
  name: string;
  hostId: string;
  participants: Participant[];
  messages: ChatMessage[];
  isActive: boolean;
  createdAt: Date;
}

export interface RoomSettings {
  allowParticipantsToUnmute: boolean;
  allowParticipantsToShareScreen: boolean;
  requireHostApproval: boolean;
}