import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Edit,
  Settings,
  Share2,
  Calendar,
  Award,
  Flame,
  MessageCircle,
  Heart,
  Star,
  TrendingUp,
  Link as LinkIcon,
  Twitter,
  Github,
  Linkedin,
  Mail,
  Globe,
  ChevronDown,
  Filter,
  MoreVertical
} from 'lucide-react';
import { useAuthStore } from '../lib/auth';
import { useProfileStore } from '../store/profileStore';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { profile, content, isLoading, error, fetchProfile, fetchContent, updateProfile } = useProfileStore();
  const [activeTab, setActiveTab] = useState('posts');
  const [sortBy, setSortBy] = useState('newest');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(null);

  // Remove @ from username if present
  const cleanUsername = username?.startsWith('@') ? username.slice(1) : username;

  useEffect(() => {
    if (cleanUsername) {
      fetchProfile(cleanUsername);
    }
  }, [cleanUsername]);

  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  const isOwnProfile = user?.id === profile?.id;

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editedProfile);
      setIsEditMode(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-dark mb-4">
            {error || 'Profile not found'}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:text-primary-dark"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Cover Image */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-primary/20 to-primary/5 relative">
        {isOwnProfile && !isEditMode && (
          <button
            onClick={() => setIsEditMode(true)}
            className="absolute top-4 right-4 p-2 bg-card-dark border border-border-dark rounded-lg hover:border-primary transition-colors"
          >
            <Edit className="w-5 h-5 text-primary" />
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-20">
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={profile.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"}
                alt={profile.display_name}
                className="w-32 h-32 rounded-full border-4 border-background-dark"
              />
              {isEditMode && (
                <button className="absolute bottom-0 right-0 p-2 bg-primary text-background-dark rounded-full hover:bg-primary-dark transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  {isEditMode ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editedProfile.display_name}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, display_name: e.target.value }))}
                        className="bg-card-dark border border-border-dark rounded-lg px-3 py-1 text-text-dark focus:outline-none focus:border-primary"
                      />
                      <input
                        type="text"
                        value={editedProfile.username}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, username: e.target.value }))}
                        className="block text-sm bg-card-dark border border-border-dark rounded-lg px-3 py-1 text-text-dark focus:outline-none focus:border-primary"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl md:text-3xl font-bold text-text-dark">
                        {profile.display_name}
                      </h1>
                      <p className="text-text-dark opacity-60">@{profile.username}</p>
                    </>
                  )}
                </div>

                <div className="mt-4 md:mt-0 flex items-center space-x-4">
                  {isEditMode ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary-dark transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setIsEditMode(false);
                          setEditedProfile(profile);
                        }}
                        className="px-4 py-2 border border-border-dark text-text-dark rounded-lg hover:border-primary transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      {!isOwnProfile && (
                        <button className="px-4 py-2 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary-dark transition-colors">
                          Follow
                        </button>
                      )}
                      <button className="p-2 border border-border-dark rounded-lg hover:border-primary transition-colors">
                        <Share2 className="w-5 h-5 text-primary" />
                      </button>
                      {isOwnProfile && (
                        <button
                          onClick={() => navigate('/settings')}
                          className="p-2 border border-border-dark rounded-lg hover:border-primary transition-colors"
                        >
                          <Settings className="w-5 h-5 text-primary" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mt-4">
                {isEditMode ? (
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-card-dark border border-border-dark rounded-lg px-3 py-2 text-text-dark focus:outline-none focus:border-primary resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-text-dark opacity-80">
                    {profile.bio || (isOwnProfile ? 'Add a bio to tell people about yourself' : 'No bio yet')}
                  </p>
                )}
              </div>

              {/* Stats & Join Date */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center space-x-1 text-text-dark">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1 text-text-dark">
                  <Award className="w-4 h-4 text-primary" />
                  <span>{profile.reputation.toLocaleString()} reputation</span>
                </div>
                <div className="flex items-center space-x-1 text-text-dark">
                  <Flame className="w-4 h-4 text-primary" />
                  <span>{profile.total_posts.toLocaleString()} posts</span>
                </div>
                <div className="flex items-center space-x-1 text-text-dark">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  <span>{profile.total_comments.toLocaleString()} comments</span>
                </div>
                <div className="flex items-center space-x-1 text-text-dark">
                  <Heart className="w-4 h-4 text-primary" />
                  <span>{profile.total_upvotes.toLocaleString()} upvotes</span>
                </div>
                <div className="flex items-center space-x-1 text-text-dark">
                  <Star className="w-4 h-4 text-primary" />
                  <span>{profile.total_awards.toLocaleString()} awards</span>
                </div>
              </div>

              {/* Social Links */}
              {(profile.social_links || isEditMode) && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {isEditMode ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                      <div className="flex items-center space-x-2">
                        <Twitter className="w-4 h-4 text-primary" />
                        <input
                          type="url"
                          placeholder="Twitter URL"
                          value={editedProfile.social_links?.twitter}
                          onChange={(e) => setEditedProfile(prev => ({
                            ...prev,
                            social_links: { ...prev.social_links, twitter: e.target.value }
                          }))}
                          className="flex-1 bg-card-dark border border-border-dark rounded-lg px-3 py-1 text-sm text-text-dark focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Github className="w-4 h-4 text-primary" />
                        <input
                          type="url"
                          placeholder="GitHub URL"
                          value={editedProfile.social_links?.github}
                          onChange={(e) => setEditedProfile(prev => ({
                            ...prev,
                            social_links: { ...prev.social_links, github: e.target.value }
                          }))}
                          className="flex-1 bg-card-dark border border-border-dark rounded-lg px-3 py-1 text-sm text-text-dark focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Linkedin className="w-4 h-4 text-primary" />
                        <input
                          type="url"
                          placeholder="LinkedIn URL"
                          value={editedProfile.social_links?.linkedin}
                          onChange={(e) => setEditedProfile(prev => ({
                            ...prev,
                            social_links: { ...prev.social_links, linkedin: e.target.value }
                          }))}
                          className="flex-1 bg-card-dark border border-border-dark rounded-lg px-3 py-1 text-sm text-text-dark focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-primary" />
                        <input
                          type="url"
                          placeholder="Website URL"
                          value={editedProfile.social_links?.website}
                          onChange={(e) => setEditedProfile(prev => ({
                            ...prev,
                            social_links: { ...prev.social_links, website: e.target.value }
                          }))}
                          className="flex-1 bg-card-dark border border-border-dark rounded-lg px-3 py-1 text-sm text-text-dark focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {profile.social_links?.twitter && (
                        <a
                          href={profile.social_links.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-3 py-1 bg-card-dark border border-border-dark rounded-lg hover:border-primary transition-colors"
                        >
                          <Twitter className="w-4 h-4 text-primary" />
                          <span className="text-sm text-text-dark">Twitter</span>
                        </a>
                      )}
                      {profile.social_links?.github && (
                        <a
                          href={profile.social_links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-3 py-1 bg-card-dark border border-border-dark rounded-lg hover:border-primary transition-colors"
                        >
                          <Github className="w-4 h-4 text-primary" />
                          <span className="text-sm text-text-dark">GitHub</span>
                        </a>
                      )}
                      {profile.social_links?.linkedin && (
                        <a
                          href={profile.social_links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-3 py-1 bg-card-dark border border-border-dark rounded-lg hover:border-primary transition-colors"
                        >
                          <Linkedin className="w-4 h-4 text-primary" />
                          <span className="text-sm text-text-dark">LinkedIn</span>
                        </a>
                      )}
                      {profile.social_links?.website && (
                        <a
                          href={profile.social_links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-3 py-1 bg-card-dark border border-border-dark rounded-lg hover:border-primary transition-colors"
                        >
                          <Globe className="w-4 h-4 text-primary" />
                          <span className="text-sm text-text-dark">Website</span>
                        </a>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="mt-8">
          <div className="border-b border-border-dark">
            <div className="flex space-x-8">
              {['posts', 'comments', 'upvoted', 'shared'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-4 relative font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-text-dark'
                      : 'text-text-dark opacity-60 hover:opacity-100'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
              {isOwnProfile && (
                <button
                  onClick={() => navigate('/settings')}
                  className="px-4 py-4 relative font-medium text-text-dark opacity-60 hover:opacity-100 transition-colors"
                >
                  Settings
                </button>
              )}
            </div>
          </div>

          {/* Content Filters */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-card-dark border border-border-dark rounded-lg hover:border-primary transition-colors">
                <Filter className="w-4 h-4 text-primary" />
                <span className="text-text-dark">Filter</span>
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-text-dark opacity-60">Sort by:</span>
                <button className="flex items-center space-x-2 px-3 py-1.5 bg-card-dark border border-border-dark rounded-lg hover:border-primary transition-colors">
                  <span className="text-text-dark">
                    {sortBy === 'newest' ? 'Newest' : sortBy === 'popular' ? 'Popular' : 'Top'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-text-dark opacity-60" />
                </button>
              </div>
            </div>
            <button className="p-2 hover:bg-card-dark rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-text-dark opacity-60" />
            </button>
          </div>

          {/* Content Area */}
          <div className="mt-6">
            {content.length > 0 ? (
              <div className="space-y-4">
                {content.map((item) => (
                  <div key={item.id} className="bg-card-dark border border-border-dark rounded-lg p-4">
                    <h3 className="text-lg font-medium text-text-dark mb-2">{item.title}</h3>
                    <p className="text-text-dark opacity-80 mb-4">{item.content}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-primary" />
                        <span className="text-text-dark">{item.likes_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4 text-primary" />
                        <span className="text-text-dark">{item.comments_count}</span>
                      </div>
                      {item.awards_count > 0 && (
                        <div className="flex items-center space-x-1">
                          <Award className="w-4 h-4 text-primary" />
                          <span className="text-text-dark">{item.awards_count}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-text-dark opacity-60 py-12">
                No {activeTab} to show yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;