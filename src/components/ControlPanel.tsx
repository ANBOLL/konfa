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
    <div className="b-control-panel">
      <div className="b-control-panel__container">
        <div className="b-control-panel__content">
          
          {/* Left: Room Info */}
          <div className="b-control-panel__room-info">
            <div className="b-control-panel__participants">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="b-control-panel__participants-text">
                {participantCount} участник{participantCount !== 1 ? (participantCount < 5 ? 'а' : 'ов') : ''}
              </span>
            </div>
            
            <div className="b-control-panel__room-id">
              <span className="b-control-panel__room-id-label">ID:</span>
              <code className="b-control-panel__room-id-value">
                {roomId}
              </code>
            </div>
          </div>

          {/* Center: Main Controls */}
          <div className="b-control-panel__main-controls">
            <button
              onClick={onToggleMute}
              className={`b-control-panel__control-button ${
                isMuted
                  ? 'b-control-panel__control-button_danger'
                  : 'b-control-panel__control-button_default'
              }`}
              title={isMuted ? 'Включить микрофон' : 'Отключить микрофон'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={onToggleCamera}
              className={`b-control-panel__control-button ${
                !isCameraOn
                  ? 'b-control-panel__control-button_danger'
                  : 'b-control-panel__control-button_default'
              }`}
              title={isCameraOn ? 'Отключить камеру' : 'Включить камеру'}
            >
              {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={onToggleScreenShare}
              className={`b-control-panel__control-button ${
                isScreenSharing
                  ? 'b-control-panel__control-button_active'
                  : 'b-control-panel__control-button_default'
              }`}
              title={isScreenSharing ? 'Прекратить демонстрацию экрана' : 'Начать демонстрацию экрана'}
            >
              {isScreenSharing ? <MonitorX className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
            </button>

            <div className="b-control-panel__divider" />

            <button
              onClick={onLeaveRoom}
              className="b-control-panel__control-button b-control-panel__control-button_leave"
              title="Завершить звонок"
            >
              <Phone className="w-5 h-5" />
            </button>
          </div>

          {/* Right: Additional Controls */}
          <div className="b-control-panel__additional-controls">
            <button
              onClick={onCopyRoomLink}
              className="b-control-panel__control-button b-control-panel__control-button_default"
              title="Копировать ссылку на комнату"
            >
              <Copy className="w-5 h-5" />
            </button>

            <button
              className="b-control-panel__control-button b-control-panel__control-button_default"
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