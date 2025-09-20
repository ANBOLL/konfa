import React from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MonitorX, 
  Phone,
  Copy,
  Settings,
  Users
} from 'lucide-react';

interface ControlPanelProps {
  isMuted: boolean;
  isCameraOn: boolean;
  isScreenSharing: boolean;
  participantCount: number;
  roomId: string;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onLeaveRoom: () => void;
  onCopyRoomLink: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isMuted,
  isCameraOn,
  isScreenSharing,
  participantCount,
  roomId,
  onToggleMute,
  onToggleCamera,
  onToggleScreenShare,
  onLeaveRoom,
  onCopyRoomLink
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Left: Room Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                {participantCount} участник{participantCount !== 1 ? (participantCount < 5 ? 'а' : 'ов') : ''}
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-gray-500">ID:</span>
              <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {roomId}
              </code>
            </div>
          </div>

          {/* Center: Main Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMute}
              className={`p-3 rounded-xl transition-colors ${
                isMuted
                  ? 'bg-red-100 hover:bg-red-200 text-red-600'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={isMuted ? 'Включить микрофон' : 'Отключить микрофон'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={onToggleCamera}
              className={`p-3 rounded-xl transition-colors ${
                !isCameraOn
                  ? 'bg-red-100 hover:bg-red-200 text-red-600'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={isCameraOn ? 'Отключить камеру' : 'Включить камеру'}
            >
              {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={onToggleScreenShare}
              className={`p-3 rounded-xl transition-colors ${
                isScreenSharing
                  ? 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={isScreenSharing ? 'Прекратить демонстрацию' : 'Демонстрация экрана'}
            >
              {isScreenSharing ? <MonitorX className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
            </button>

            <div className="w-px h-8 bg-gray-300 mx-2" />

            <button
              onClick={onLeaveRoom}
              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition-colors"
              title="Завершить звонок"
            >
              <Phone className="w-5 h-5" />
            </button>
          </div>

          {/* Right: Additional Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onCopyRoomLink}
              className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              title="Копировать ссылку на комнату"
            >
              <Copy className="w-5 h-5" />
            </button>

            <button
              className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              title="Настройки"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};