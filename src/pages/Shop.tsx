import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Coins,
  Gift,
  Star,
  Clock,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Award,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { useAuthStore } from '../lib/auth';
import { supabase } from '../lib/supabase';

interface CoinPackage {
  id: string;
  name: string;
  description: string;
  coin_amount: number;
  bonus_amount: number;
  price_usd: number;
  is_featured: boolean;
  is_limited_time: boolean;
  limited_time_end: string;
  discount_percentage: number;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  coin_price: number;
  image_url: string;
  animation_url: string;
  is_animated: boolean;
  is_premium: boolean;
  is_seasonal: boolean;
}

const Shop = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'coins' | 'rewards'>('coins');
  const [coinPackages, setCoinPackages] = useState<CoinPackage[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userCoins, setUserCoins] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch user's coin balance
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('coins')
          .eq('id', user.id)
          .maybeSingle();

        if (userError) {
          console.error('Error fetching user data:', userError);
        } else if (userData) {
          setUserCoins(userData.coins || 0);
        }

        // Fetch coin packages
        const { data: packages, error: packagesError } = await supabase
          .from('coin_packages')
          .select('*')
          .order('display_order', { ascending: true });

        if (packagesError) {
          console.error('Error fetching packages:', packagesError);
        } else {
          setCoinPackages(packages || []);
        }

        // Fetch rewards
        const { data: rewardsData, error: rewardsError } = await supabase
          .from('rewards')
          .select('*')
          .order('display_order', { ascending: true });

        if (rewardsError) {
          console.error('Error fetching rewards:', rewardsError);
        } else {
          setRewards(rewardsData || []);
        }
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handlePurchaseCoins = async (packageId: string) => {
    if (!user) return;
    // TODO: Implement payment processing
    console.log('Purchase coins:', packageId);
  };

  const handlePurchaseReward = async (rewardId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.rpc('purchase_reward', {
        p_user_id: user.id,
        p_reward_id: rewardId
      });

      if (error) throw error;

      // Refresh user's coin balance
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('coins')
        .eq('id', user.id)
        .maybeSingle();

      if (userError) {
        console.error('Error fetching updated user data:', userError);
      } else if (userData) {
        setUserCoins(userData.coins || 0);
      }
    } catch (error) {
      console.error('Error purchasing reward:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-dark mb-4">Sign in to access the shop</h2>
          <Link
            to="/auth"
            className="inline-flex items-center px-6 py-3 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background-dark border-b border-border-dark">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-dark">Shop</h1>
              <p className="text-text-dark opacity-60">Get coins and rewards</p>
            </div>
            <div className="flex items-center space-x-2 bg-card-dark px-4 py-2 rounded-lg">
              <Coins className="w-5 h-5 text-primary" />
              <span className="text-lg font-bold text-text-dark">{userCoins.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => setActiveTab('coins')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'coins'
                  ? 'bg-primary text-background-dark'
                  : 'text-text-dark hover:bg-card-dark'
              }`}
            >
              Buy Coins
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'rewards'
                  ? 'bg-primary text-background-dark'
                  : 'text-text-dark hover:bg-card-dark'
              }`}
            >
              Rewards
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'coins' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coinPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`
                  relative bg-card-dark border border-border-dark rounded-xl overflow-hidden
                  ${pkg.is_featured ? 'ring-2 ring-primary' : ''}
                `}
              >
                {pkg.is_featured && (
                  <div className="absolute top-3 right-3 bg-primary text-background-dark px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Best Value</span>
                  </div>
                )}
                {pkg.is_limited_time && (
                  <div className="absolute top-3 left-3 bg-background-dark/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Limited Time</span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-text-dark mb-2">{pkg.name}</h3>
                  <p className="text-text-dark opacity-60 mb-4">{pkg.description}</p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <Coins className="w-6 h-6 text-primary" />
                      <span className="text-2xl font-bold text-text-dark">
                        {pkg.coin_amount.toLocaleString()}
                      </span>
                      {pkg.bonus_amount > 0 && (
                        <span className="text-sm text-primary">
                          +{pkg.bonus_amount.toLocaleString()} Bonus
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      {pkg.discount_percentage > 0 && (
                        <div className="text-sm text-primary mb-1">
                          Save {pkg.discount_percentage}%
                        </div>
                      )}
                      <div className="text-2xl font-bold text-text-dark">
                        ${pkg.price_usd}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchaseCoins(pkg.id)}
                    className="w-full px-4 py-3 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Purchase Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className={`
                  bg-card-dark border border-border-dark rounded-xl overflow-hidden
                  ${reward.is_premium ? 'ring-2 ring-primary' : ''}
                `}
              >
                <div className="relative aspect-square">
                  {reward.is_animated ? (
                    <video
                      src={reward.animation_url}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                    />
                  ) : (
                    <img
                      src={reward.image_url}
                      alt={reward.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {reward.is_premium && (
                    <div className="absolute top-3 right-3 bg-primary text-background-dark px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Award className="w-4 h-4" />
                      <span>Premium</span>
                    </div>
                  )}
                  {reward.is_seasonal && (
                    <div className="absolute top-3 left-3 bg-background-dark/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span>Seasonal</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-text-dark mb-1">{reward.name}</h3>
                  <p className="text-sm text-text-dark opacity-60 mb-4">{reward.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Coins className="w-4 h-4 text-primary" />
                      <span className="font-bold text-text-dark">
                        {reward.coin_price.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handlePurchaseReward(reward.id)}
                      disabled={userCoins < reward.coin_price}
                      className={`
                        px-4 py-2 rounded-lg font-medium transition-colors
                        ${userCoins >= reward.coin_price
                          ? 'bg-primary text-background-dark hover:bg-primary-dark'
                          : 'bg-card-dark text-text-dark opacity-50 cursor-not-allowed'
                        }
                      `}
                    >
                      Purchase
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;