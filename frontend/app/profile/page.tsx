'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const ProfileHeader = () => {
  const { user } = useAuth();
  return (
    <header className="w-full bg-white">
      <div className="mx-auto flex justify-between items-center py-4" style={{ maxWidth: '1620px'}}>
        <div className="flex items-center space-x-15">
          <Link href="/dashboard">
            <Image src="/icons/logo.svg" alt="EasyCreos Logo" width={125} height={35} />
          </Link>
          <nav className="hidden md:flex space-x-15 font-semibold">
            <Link href="/dashboard" className="hover:underline">
              Projects
            </Link>
            <Link href="/about" className="hover:underline">
              About Us
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center gap-2 rounded-full px-3 py-2.5 border-0 text-brand-black font-medium bg-blue-200 hover:bg-blue-300 transition cursor-pointer">
            Upgrade
            <Image src="/icons/stars.svg" alt="Upgrade" width={24} height={24} />
          </button>
          <Link href="/profile">
            <Image
              src={user?.avatarUrl || '/img/avatar-example.png'}
              alt={user?.name || 'User Avatar'}
              width={48}
              height={48}
              className="rounded-full cursor-pointer"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

const SettingsNavItem = ({ icon, label, isActive, onClick }: { icon: string; label: string; isActive: boolean; onClick: () => void; }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-base transition ${isActive
      ? 'font-medium'
      : 'font-medium hover:bg-gray-100'
      }`}
  >
    <Image src={icon} alt={`${label} icon`} width={24} height={24} />
    {label}
    {isActive && <span className="ml-auto w-2 h-2 bg-primary rounded-full"></span>}
  </button>
);

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('Profile');

  useEffect(() => {
    if (user?.name) {
      setUserName(user.name);
    }
  }, [user]);

  const navItems = [
    { id: 'Profile', label: 'Profile', icon: '/icons/profile.svg' },
    { id: 'Account', label: 'Account', icon: '/icons/account.svg' },
    { id: 'Privacy', label: 'Privacy Settings', icon: '/icons/privacy-shield.svg' },
    { id: 'Billing', label: 'Billing', icon: '/icons/billing-card.svg' },
    { id: 'Logout', label: 'Log out', icon: '/icons/logout.svg' },
  ];

  const handleSave = () => {
    console.log("Saving new name:", userName);
  };

  return (
    <div className="min-h-screen bg-white">
      <ProfileHeader />

      <main className="flex mx-auto min-h-[calc(100vh-80px)]" style={{ maxWidth: '1200px' }}>
        <aside className="w-1/4 max-w-xs px-4 py-25 border-r border-gray-200">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => router.back()} className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition flex items-center justify-center">
              <Image src="/icons/arrow-left.svg" alt="Back" width={24} height={24} />
            </button>
            <h1 className="text-3xl">Options</h1>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <SettingsNavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
              />
            ))}
          </nav>
        </aside>

        <div className="flex-1 p-12">
          {activeTab === 'Profile' && (
            <div className="w-full space-y-5">
              <div className="flex justify-between p-5 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-6">
                  <Image
                    src={user?.avatarUrl || '/icons/def-user.png'}
                    alt="User Avatar"
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                  <div>
                    <h2 className="text-2xl">{user?.name || 'Anastasia Voroshko'}</h2>
                    <p className="text-gray-500">{user?.email || 'anastasiavshko19@gmail.com'}</p>
                  </div>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {}}
                  >
                    Change photo
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-81 p-5 border border-gray-200 rounded-xl">
                <Input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your name"
                  className="bg-transparent"
                />
                <Button
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'Account' && <div>Account Settings Content</div>}
          {activeTab === 'Privacy' && <div>Privacy Settings Content</div>}
          {activeTab === 'Billing' && <div>Billing Content</div>}

        </div>
      </main>
    </div>
  );
}
