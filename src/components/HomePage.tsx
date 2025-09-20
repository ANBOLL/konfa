import React, { useState } from 'react';
import { Video, Users, Settings, ArrowRight, Copy, Check } from 'lucide-react';
import { generateRoomId, generateRoomUrl, copyToClipboard } from '../utils/roomUtils';

interface HomePageProps {
  onJoinRoom: (roomId: string, nickname: string, isHost: boolean) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onJoinRoom }) => {
  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState('');
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Video className="w-8 h-8 text-blue-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Комната создана!
            </h2>
            <p className="text-gray-600 mb-6">
              Поделитесь ссылкой с участниками
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-sm text-gray-500">ID комнаты</p>
                  <p className="font-mono text-lg font-medium">{generatedRoomId}</p>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
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
            
            <div className="space-y-3">
              <button
                onClick={handleStartRoom}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                Войти в комнату
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setShowCreateRoom(false)}
                className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
            <Video className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Видеоконференции
          </h1>
          <p className="text-gray-600">
            Общайтесь с коллегами и друзьями в высоком качестве
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ваше имя
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Введите ваше имя"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-4">
            <button
              onClick={handleCreateRoom}
              disabled={!nickname.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Users className="w-5 h-5" />
              Создать комнату
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">или</span>
              </div>
            </div>

            <div>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="ID комнаты"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3 transition-all"
              />
              <button
                onClick={handleJoinRoom}
                disabled={!nickname.trim() || !roomId.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                Присоединиться
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Возможности платформы
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center mx-auto mb-2">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600">HD видео</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-xs text-gray-600">До 100 человек</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center mx-auto mb-2">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-xs text-gray-600">Управление</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};