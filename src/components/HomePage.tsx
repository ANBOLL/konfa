import React, { useState } from 'react';
import { Video, Users, Settings, ArrowRight, Copy, Check } from 'lucide-react';
import { generateRoomId, generateRoomUrl, copyToClipboard, getRoomIdFromUrl } from '../utils/roomUtils';

interface HomePageProps {
  onJoinRoom: (roomId: string, nickname: string, isHost: boolean) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onJoinRoom }) => {
  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState(getRoomIdFromUrl() || '');
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [generatedRoomId, setGeneratedRoomId] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreateRoom = () => {
    if (!nickname.trim()) return;
    const newRoomId = generateRoomId();
    setGeneratedRoomId(newRoomId);
    setShowCreateRoom(true);
  };

  const handleStartRoom = () => {
    if (!nickname.trim() || !generatedRoomId) return;
    onJoinRoom(generatedRoomId, nickname, true);
  };

  const handleJoinRoom = () => {
    if (!nickname.trim() || !roomId.trim()) return;
    onJoinRoom(roomId, nickname, false);
  };

  const handleCopyLink = async () => {
    const url = generateRoomUrl(generatedRoomId);
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (showCreateRoom && generatedRoomId) {
    return (
      <div className="b-room-created">
        <div className="b-room-created__container">
          <div className="b-room-created__modal">
            <div className="b-room-created__icon">
              <Video className="w-8 h-8 text-blue-600" />
            </div>
            
            <h2 className="b-room-created__title">
              Комната создана!
            </h2>
            <p className="b-room-created__subtitle">
              Поделитесь ссылкой с участниками
            </p>
            
            <div className="b-room-created__room-info">
              <div className="b-room-created__room-details">
                <div>
                  <p className="b-room-created__room-id-label">ID комнаты</p>
                  <p className="b-room-created__room-id">{generatedRoomId}</p>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="b-room-created__copy-button"
                  title="Копировать ссылку"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="b-room-created__actions">
              <button
                onClick={handleStartRoom}
                className="b-home-page__button b-home-page__button_primary"
              >
                Войти в комнату
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setShowCreateRoom(false)}
                className="b-room-created__back-button"
              >
                Назад
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="b-home-page">
      <div className="b-home-page__container">
        <div className="b-home-page__header">
          <div className="b-home-page__logo">
            <Video className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="b-home-page__title">
            Видеоконференции
          </h1>
          <p className="b-home-page__subtitle">
            Общайтесь с коллегами и друзьями в высоком качестве
          </p>
        </div>

        <div className="b-home-page__form">
          <div className="b-home-page__input-group">
            <label className="b-home-page__label">
              Ваше имя
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Введите ваше имя"
              className="b-home-page__input"
            />
          </div>

          <div className="b-home-page__actions">
            <button
              onClick={handleCreateRoom}
              disabled={!nickname.trim()}
              className="b-home-page__button b-home-page__button_primary"
            >
              <Users className="w-5 h-5" />
              Создать комнату
            </button>

            <div className="b-home-page__divider">
              <div className="b-home-page__divider-text">
                <span>или</span>
              </div>
            </div>

            <div>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="ID комнаты"
                className="b-home-page__input"
              />
              <button
                onClick={handleJoinRoom}
                disabled={!nickname.trim() || !roomId.trim()}
                className="b-home-page__button b-home-page__button_success"
              >
                Присоединиться
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="b-home-page__features">
          <p className="b-home-page__features-title">
            Возможности платформы
          </p>
          <div className="b-home-page__features-grid">
            <div className="b-home-page__feature">
              <div className="b-home-page__feature-icon">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <p className="b-home-page__feature-text">HD видео</p>
            </div>
            <div className="b-home-page__feature">
              <div className="b-home-page__feature-icon">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="b-home-page__feature-text">До 100 человек</p>
            </div>
            <div className="b-home-page__feature">
              <div className="b-home-page__feature-icon">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <p className="b-home-page__feature-text">Управление</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};