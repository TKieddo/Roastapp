import React, { useState } from 'react';
import { X, Coins, Award, Info, Sparkles, Star, Flame, Zap, Trophy, Heart, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../lib/auth';
import { supabase } from '../lib/supabase';

interface AwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postAuthorId: string;
  isComment?: boolean;
}

const STICKERS = [
  {
    id: 'savage-roast',
    name: 'Savage Roast',
    description: 'For the most brutal roasts that leave no survivors',
    image_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=300&h=300&fit=crop',
    coin_price: 100,
    is_animated: false,
    is_premium: false,
    icon: Flame
  },
  {
    id: 'code-master',
    name: 'Code Master',
    description: 'Acknowledge exceptional code roasting skills',
    image_url: 'https://images.unsplash.com/photo-1542831371-32f555c86880?w=300&h=300&fit=crop',
    coin_price: 250,
    is_animated: false,
    is_premium: true,
    icon: Zap
  },
  {
    id: 'legendary-burn',
    name: 'Legendary Burn',
    description: 'For roasts that will be remembered for generations',
    image_url: 'https://images.unsplash.com/photo-1519834022362-0f0b6f0f4e10?w=300&h=300&fit=crop',
    coin_price: 500,
    is_animated: true,
    is_premium: true,
    icon: Trophy
  },
  {
    id: 'wholesome-roast',
    name: 'Wholesome Roast',
    description: 'When the roast is savage but somehow still wholesome',
    image_url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&h=300&fit=crop',
    coin_price: 150,
    is_animated: false,
    is_premium: false,
    icon: Heart
  },
  {
    id: 'bug-hunter',
    name: 'Bug Hunter',
    description: 'For spotting those sneaky bugs in the code',
    image_url: 'https://images.unsplash.com/photo-1546776230-bb86256870ce?w=300&h=300&fit=crop',
    coin_price: 200,
    is_animated: false,
    is_premium: false,
    icon: Star
  },
  {
    id: 'premium-roast',
    name: 'Premium Roast',
    description: 'The finest, most sophisticated roast in town',
    image_url: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=300&h=300&fit=crop',
    coin_price: 1000,
    is_animated: true,
    is_premium: true,
    icon: Sparkles
  }
];

const AwardModal: React.FC<AwardModalProps> = ({ isOpen, onClose, postId, postAuthorId, isComment = false }) => {
  const { user } = useAuthStore();
  const [userCoins, setUserCoins] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedSticker, setSelectedSticker] = React.useState<typeof STICKERS[0] | null>(null);
  const [showCoinModal, setShowCoinModal] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  React.useEffect(() => {
    const fetchUserCoins = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('coins')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;
        setUserCoins(userData.coins || 0);
      } catch (error) {
        console.error('Error fetching user coins:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchUserCoins();
    }
  }, [isOpen, user]);

  const handleStickerClick = (sticker: typeof STICKERS[0]) => {
    if (!user || user.id === postAuthorId) return;

    if (userCoins < sticker.coin_price) {
      setSelectedSticker(sticker);
      setShowCoinModal(true);
      return;
    }

    setSelectedSticker(sticker);
    setShowConfirmation(true);
  };

  const handleConfirmAward = async () => {
    if (!selectedSticker || !user) return;

    try {
      const { data, error } = await supabase.rpc(isComment ? 'award_comment' : 'award_post', {
        p_user_id: user.id,
        p_post_id: postId,
        p_reward_id: selectedSticker.id
      });

      if (error) throw error;

      // Refresh user's coin balance
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('coins')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;
      setUserCoins(userData.coins || 0);

      // Create notification for post author
      await supabase.rpc('create_notification', {
        p_user_id: postAuthorId,
        p_user_from_id: user.id,
        p_type: 'award',
        p_content: `awarded your ${isComment ? 'comment' : 'post'} with ${selectedSticker.name}`,
        p_reference_id: postId,
        p_reference_type: isComment ? 'comment' : 'post'
      });

      onClose();
    } catch (error) {
      console.error('Error awarding post:', error);
    }
  };

  const handleInfoClick = (e: React.MouseEvent, description: string) => {
    e.stopPropagation();
    // Show tooltip with description
  };

  const handleGetCoins = (e: React.MouseEvent, sticker: typeof STICKERS[0]) => {
    e.stopPropagation();
    setSelectedSticker(sticker);
    setShowCoinModal(true);
  };

  if (!isOpen) return null;

  if (showConfirmation && selectedSticker) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm" onClick={() => setShowConfirmation(false)} />
        <div className="relative bg-card-dark border border-border-dark rounded-xl w-full max-w-md p-6 shadow-xl animate-slideUp">
          <button
            onClick={() => setShowConfirmation(false)}
            className="absolute top-4 right-4 text-text-dark hover:text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold text-text-dark mb-2">Confirm Award</h2>
            <p className="text-text-dark opacity-60 mb-6">
              Are you sure you want to award this {isComment ? 'comment' : 'post'} with {selectedSticker.name} for {selectedSticker.coin_price} coins?
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-6 py-2 border border-border-dark text-text-dark rounded-lg hover:bg-card-dark transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAward}
                className="px-6 py-2 bg-primary text-background-dark rounded-lg hover:bg-primary-dark transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card-dark border border-border-dark rounded-xl w-full max-w-2xl p-6 shadow-xl animate-slideUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-dark hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-dark mb-2">Award {isComment ? 'Comment' : 'Post'}</h2>
          <p className="text-text-dark opacity-60">Choose a sticker to award this {isComment ? 'comment' : 'post'}</p>
        </div>

        <div className="flex items-center justify-between mb-6 p-3 bg-background-dark rounded-lg">
          <div className="flex items-center space-x-2">
            <Coins className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold text-text-dark">{userCoins.toLocaleString()}</span>
          </div>
          <button
            onClick={() => setShowCoinModal(true)}
            className="px-4 py-2 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Get More Coins
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
            {STICKERS.map((sticker) => {
              const Icon = sticker.icon;
              return (
                <div
                  key={sticker.id}
                  className={`
                    relative group bg-background-dark border border-border-dark rounded-lg p-4
                    hover:border-primary transition-colors
                    ${user?.id === postAuthorId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  onClick={() => handleStickerClick(sticker)}
                >
                  <div className="relative aspect-square mb-3 flex items-center justify-center">
                    <Icon className={`w-12 h-12 ${sticker.is_premium ? 'text-primary' : 'text-text-dark'}`} />
                    {sticker.is_premium && (
                      <div className="absolute top-1 right-1">
                        <Award className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </div>

                  <h3 className="font-medium text-text-dark text-sm mb-1">{sticker.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Coins className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-text-dark">
                        {sticker.coin_price.toLocaleString()}
                      </span>
                    </div>
                    <div
                      onClick={(e) => handleInfoClick(e, sticker.description)}
                      className="p-1 hover:bg-card-dark rounded-full transition-colors"
                    >
                      <Info className="w-4 h-4 text-text-dark opacity-60" />
                    </div>
                  </div>

                  {userCoins < sticker.coin_price && (
                    <div className="absolute inset-0 bg-background-dark/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div
                        onClick={(e) => handleGetCoins(e, sticker)}
                        className="px-3 py-1.5 bg-primary text-background-dark rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                      >
                        Get Coins
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {user?.id === postAuthorId && (
          <div className="mt-4 p-3 bg-background-dark rounded-lg text-sm text-text-dark opacity-60">
            <Info className="w-4 h-4 inline-block mr-2" />
            You cannot award your own {isComment ? 'comments' : 'posts'}
          </div>
        )}
      </div>
    </div>
  );
};

export default AwardModal;