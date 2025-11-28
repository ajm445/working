import React, { useState } from 'react';
import { X, User, Lock, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface AccountManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'profile' | 'password' | 'delete';

const AccountManagementModal: React.FC<AccountManagementModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, updatePassword, deleteAccount } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [loading, setLoading] = useState(false);

  // 닉네임 변경
  const [newUsername, setNewUsername] = useState(profile?.username || '');

  // 비밀번호 변경
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 회원 탈퇴
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  // 소셜 로그인 여부 확인
  const isEmailProvider = profile?.provider === 'email' || !profile?.provider;

  if (!isOpen) return null;

  const handleUpdateUsername = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!newUsername.trim()) {
      toast.error('닉네임을 입력해주세요.');
      return;
    }

    if (newUsername === profile?.username) {
      toast.error('현재 닉네임과 동일합니다.');
      return;
    }

    setLoading(true);
    try {
      const result = await updateProfile({ username: newUsername.trim() });
      if (result.error) {
        throw result.error;
      }
      toast.success('닉네임이 변경되었습니다.');
    } catch (error) {
      console.error('Failed to update username:', error);
      toast.error('닉네임 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('모든 필드를 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    if (currentPassword === newPassword) {
      toast.error('현재 비밀번호와 새 비밀번호가 동일합니다.');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(currentPassword, newPassword);
      toast.success('비밀번호가 변경되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Failed to update password:', error);
      toast.error('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (): Promise<void> => {
    if (deleteConfirmText !== '회원탈퇴') {
      toast.error('"회원탈퇴"를 정확히 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await deleteAccount();
      toast.success('회원 탈퇴가 완료되었습니다.');
      onClose();
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast.error('회원 탈퇴에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">계정 관리</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <User size={18} className="inline-block mr-2 mb-1" />
            닉네임 변경
          </button>
          {isEmailProvider && (
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'password'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Lock size={18} className="inline-block mr-2 mb-1" />
              비밀번호 변경
            </button>
          )}
          <button
            onClick={() => setActiveTab('delete')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'delete'
                ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Trash2 size={18} className="inline-block mr-2 mb-1" />
            회원 탈퇴
          </button>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* 닉네임 변경 탭 */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateUsername} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  현재 닉네임
                </label>
                <p className="text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                  {profile?.username || profile?.email}
                </p>
              </div>

              <div>
                <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  새 닉네임
                </label>
                <input
                  id="newUsername"
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="새로운 닉네임을 입력하세요"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '변경 중...' : '닉네임 변경'}
              </button>
            </form>
          )}

          {/* 비밀번호 변경 탭 */}
          {activeTab === 'password' && isEmailProvider && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  현재 비밀번호
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호를 입력하세요"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  새 비밀번호
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호를 입력하세요 (최소 6자)"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  새 비밀번호 확인
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="새 비밀번호를 다시 입력하세요"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '변경 중...' : '비밀번호 변경'}
              </button>
            </form>
          )}

          {/* 회원 탈퇴 탭 */}
          {activeTab === 'delete' && (
            <div className="space-y-4">
              {!showDeleteWarning ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                    회원 탈퇴 안내
                  </h3>
                  <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-400">
                    <li>• 회원 탈퇴 시 모든 거래 내역이 삭제됩니다.</li>
                    <li>• 탈퇴한 계정은 복구할 수 없습니다.</li>
                    <li>• 탈퇴 후 동일한 이메일로 재가입이 가능합니다.</li>
                  </ul>
                  <button
                    onClick={() => setShowDeleteWarning(true)}
                    className="mt-4 w-full bg-yellow-600 dark:bg-yellow-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-700 dark:hover:bg-yellow-600 transition-colors"
                  >
                    다음 단계로
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                      정말로 탈퇴하시겠습니까?
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                      회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
                      <br />
                      탈퇴하려면 아래 입력란에 <strong>"회원탈퇴"</strong>를 정확히 입력해주세요.
                    </p>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="회원탈퇴"
                      className="w-full px-4 py-2 border border-red-300 dark:border-red-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white transition-colors mb-4"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeleteWarning(false)}
                        className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={loading || deleteConfirmText !== '회원탈퇴'}
                        className="flex-1 bg-red-600 dark:bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 dark:hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? '탈퇴 처리 중...' : '회원 탈퇴'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountManagementModal;
