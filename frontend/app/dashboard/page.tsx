'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [selectedRatio, setSelectedRatio] = useState<string>('9:16');
  const [width, setWidth] = useState('1080');
  const [height, setHeight] = useState('1920');
  const [isWidthFocused, setIsWidthFocused] = useState(false);
  const [isHeightFocused, setIsHeightFocused] = useState(false);

  const popupRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    console.log("User data:", user);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }

      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        handleClosePopup();
      }
    };

    if (isMenuOpen || isPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isPopupOpen]);

  const addFolder = () => {
    const newFolderName = folders.length === 0 ? 'Folder' : `Folder ${folders.length}`;
    setFolders([...folders, newFolderName]);
  };

  const handleLogoutClick = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    setIsMenuOpen(false);
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
      router.push('/login');
    }
  };

  const handleFolderSelect = (folder: string) => {
    if (selectedFolder !== folder) {
      setSelectedFolder(folder);
    }
  };

  const handleProfileClick = () => {
    router.push('/profile');
    setIsMenuOpen(false);
  };

  const handleCreateProject = () => {
    if (projectName.trim()) {
      console.log('Creating project:', {
        name: projectName,
        folder: selectedFolder,
        ratio: selectedRatio,
        width: width,
        height: height,
      });
      handleClosePopup();
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setProjectName('');
    setSelectedRatio('9:16');
    setWidth('1080');
    setHeight('1920');
    setIsWidthFocused(false);
    setIsHeightFocused(false);
  };

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setter(numericValue.slice(0, 4));
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="h-screen px-4 py-8 flex flex-col justify-between border-r border-gray-200" style={{ width: '13.75%' }}>
        <div className="flex flex-col flex-1 min-h-0">
          <div className="mb-6 flex flex-col items-center justify-center">
            <Image src="/icons/logo.svg" alt="EasyCreos Logo" width={48} height={48} />
            <p className="text-2xl font-bold text-blue-800">easyCreos</p>
          </div>
          <div className="mb-4">
            <Button
              onClick={() => setIsPopupOpen(true)}
              className="w-full px-13"
            >
              Create project
            </Button>
          </div>
          <div className="mb-4">
            <button
              ref={buttonRef}
              className="w-full flex items-center justify-between gap-2 bg-transparent border border-gray-200 rounded-full px-4 py-3 text-base font-medium hover:bg-gray-100 transition cursor-pointer"
              onClick={addFolder}
            >
              New folder
              <Image src="/icons/plus.svg" alt="New Folder" width={24} height={24} />
            </button>
          </div>
          <div className="space-y-0 flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {folders.map((folder, index) => (
              <button
                key={index}
                className={`w-full flex items-center justify-between gap-2 px-3 py-3 text-base font-medium text-brand-black rounded-lg transition ${selectedFolder === folder ? 'bg-blue-50' : 'hover:bg-blue-50'}`}
                onClick={() => handleFolderSelect(folder)}
              >
                <div className="flex items-center gap-2">
                  <Image src="/icons/folder.svg" alt={`${folder} Icon`} width={24} height={24} />
                  {folder}
                </div>
                {selectedFolder === folder && (
                  <Image src="/icons/more-vertical.svg" alt="More Options" width={24} height={24} />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <div className="flex gap-2 mb-2">
            <button className="flex items-center justify-center gap-2 rounded-full px-3 py-3 border-0 font-medium bg-blue-200 hover:bg-blue-300 transition cursor-pointer basis-0 flex-grow-[73]">
              Upgrade
              <Image src="/icons/stars.svg" alt="Upgrade" width={24} height={24} />
            </button>
            <button className="flex items-center justify-center gap-1 rounded-full px-3 py-3 border border-gray-200 bg-transparent hover:bg-gray-100 transition cursor-pointer basis-0 flex-grow-[24]">
              <Image src="/icons/logo.svg" alt="Credits" width={20} height={20} />
              0
            </button>
          </div>
          <div className="relative">
            <button
              ref={buttonRef}
              className="w-full flex items-center justify-between gap-2 bg-transparent border border-gray-200 rounded-full px-3 py-2 hover:bg-gray-100 transition cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="flex items-center gap-2 max-w-[calc(100%-50px)]">
                <Image src={user?.avatarUrl || "/icons/def-user.png"} alt={user?.name || "User"} width={40} height={40} className="rounded-full" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-brand-black truncate">{user?.name || user?.email}</span>
                  <span className="text-xs font-semibold text-gray-400">Free</span>
                </div>
              </div>
              <Image src="/icons/more-vertical.svg" alt="Menu" width={24} height={24} />
            </button>
            {isMenuOpen && (
              <div ref={menuRef} className="absolute bottom-full mb-2 w-full bg-brand-white border-0 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                <a href="#" className="block px-3 py-3 text-base font-medium text-brand-black flex items-center gap-2 rounded-t-xl hover:bg-gray-100 transition">
                  <Image src="/icons/projects.svg" alt="Projects Icon" width={24} height={24} />
                  Projects
                </a>
                <a href="#" className="block px-3 py-3 text-base font-medium text-brand-black flex items-center gap-2 hover:bg-gray-100 transition">
                  <Image src="/icons/credits.svg" alt="Credits Icon" width={24} height={24} />
                  Credits
                </a>
                <div onClick={handleProfileClick} className="block px-3 py-3 text-base font-medium text-brand-black flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer">
                  <Image src="/icons/profile.svg" alt="Profile Icon" width={24} height={24} />
                  Profile
                </div>
                <a onClick={handleLogoutClick} href="#" className="block px-3 py-3 text-base font-medium text-brand-black flex items-center gap-2 rounded-b-xl hover:bg-gray-100 transition">
                  <Image src="/icons/logout.svg" alt="Logout Icon" width={24} height={24} />
                  Log out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 pt-23">
        <div className="mb-12 flex items-center">
          <h2 className="pl-6 text-2xl font-medium text-black">Folder</h2>
          <div className="flex-1 flex justify-center items-center mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search"
                className="!w-125 py-3 pl-13"
              />
              <Image
                src="/icons/search.svg"
                alt="Search Icon"
                width={24}
                height={24}
                className="absolute left-5 top-1/2 transform -translate-y-1/2"
              />
            </div>
          </div>
          <div className="flex justify-end items-center gap-4 pr-10">
            <button className="flex items-center gap-2 px-3 py-3 border border-gray-200 rounded-full hover:bg-gray-100 transition cursor-pointer">
              <Image src="/icons/filter.svg" alt="Filter" width={24} height={24} />
            </button>
            <Button
              onClick={() => setIsPopupOpen(true)}
            >
              Create project
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto pr-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-68 px-6 py-1.5 text-left text-sm font-medium text-gray-400">Image</th>
                <th className="w-68 px-3 py-1.5 text-left text-sm font-medium text-gray-400 border-l border-gray-200">Name</th>
                <th className="w-68 px-3 py-1.5 text-left text-sm font-medium text-gray-400 border-l border-gray-200">Format</th>
                <th className="w-68 px-3 py-1.5 text-left text-sm font-medium text-gray-400 border-l border-gray-200">Time</th>
                <th className="w-68 px-3 py-1.5 text-left text-sm font-medium text-gray-400 border-l border-gray-200">Date</th>
                <th className="w-68 px-3 py-1.5 text-left text-sm font-medium text-gray-400 border-gray-200"></th>
              </tr>
            </thead>
            <tbody>
              {selectedFolder && [
                { image: '/icons/placeholder.png', name: 'Video 1', format: '16:9', time: '120s', date: '2025-09-24' },
                { image: '/icons/placeholder.png', name: 'Video 2', format: '4:3', time: '90s', date: '2025-09-23' },
                { image: '/icons/placeholder.png', name: 'Video 3', format: '1:1', time: '150s', date: '2025-09-22' },
              ].map((item, index, array) => (
                <tr
                  key={index}
                  className={`${index === 0 ? 'border-t' : index === array.length - 1 ? 'border-b' : 'border-y'} border-gray-200`}
                >
                  <td className="px-6 py-3">
                    <Image src={item.image} alt="Preview" width={48} height={48} className="rounded" />
                  </td>
                  <td className="px-3 py-3 font-medium text-brand-black">{item.name}</td>
                  <td className="px-3 py-3 font-medium text-brand-black">{item.format}</td>
                  <td className="px-3 py-3 font-medium text-brand-black">{item.time}</td>
                  <td className="px-3 py-3 font-medium text-brand-black">{item.date}</td>
                  <td className="pl-6 py-3 flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      className="px-5 font-semibold"
                    >
                      Open
                    </Button>
                    <div className="w-12 h-12 flex items-center justify-center">
                      <Image src="/icons/archive.svg" alt="Archive" width={24} height={24} className="text-yellow-500" />
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center">
                      <Image src="/icons/delete.svg" alt="Delete" width={24} height={24} className="text-red-500" />
                    </div>
                  </td>
                </tr>
              ))}
              {!selectedFolder && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No projects in selected folder
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isPopupOpen && (
        <div id="popup-container" className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">

          <div
            ref={popupRef}
            className="bg-white rounded-3xl w-full max-w-lg shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden"
          >
            <div className="pt-6 pb-6">
              <h2 className="text-2xl text-center">Create composition</h2>
            </div>

            <div className="h-px bg-gray-100"></div>

            <div className="pt-6 pb-6 pl-4.5 pr-4.5">
              <Input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Composition name"
                className="mb-8 !px-4 !py-3.5"
              />

              <h3 className="text-sm font-medium mb-3">Popular canvas</h3>

              <div className="flex gap-4 mb-10">
                <div className="flex-1 space-y-3">

                  {[
                    { ratio: '9:16', desc: 'TikTok, YouTube, Instagram', iconSrc: '/icons/ratio-9-16.svg', width: '1080', height: '1920' },
                    { ratio: '1:1', desc: 'Instagram, LinkedIn, Facebook', iconSrc: '/icons/ratio-1-1.svg', width: '1080', height: '1080' },
                    { ratio: '4:5', desc: 'Instagram', iconSrc: '/icons/ratio-4-5.svg', width: '1080', height: '1350' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.ratio}
                      onClick={() => {
                        setSelectedRatio(item.ratio);
                        setWidth(item.width);
                        setHeight(item.height);
                      }}
                      className={`flex items-center gap-3 border rounded-xl px-3 py-1.5 cursor-pointer transition w-full text-left ${selectedRatio === item.ratio
                        ? 'bg-gray-100 border-gray-300'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      <Image
                        src={item.iconSrc}
                        alt={`Ratio ${item.ratio}`}
                        width={32}
                        height={32}
                        className="rounded"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{item.ratio}</span>
                        <span className="text-gray-400 text-sm">{item.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="w-[39%] space-y-3">

                  <div className="flex flex-col">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <span className="text-gray-500 text-sm font-medium bg-gray-100 pl-2.5 pr-3.5 py-4.5 border-r border-gray-300">
                        Width:
                      </span>
                      <div className="flex-1 flex items-center justify-center px-2 py-4">
                        <input
                          type="text"
                          value={isWidthFocused ? width : `${width}px`}
                          onChange={(e) => handleDimensionChange(e, setWidth)}
                          onFocus={() => setIsWidthFocused(true)}
                          onBlur={() => {
                            setIsWidthFocused(false);
                            if (!width) setWidth('1080');
                          }}
                          className="w-full text-center bg-transparent border-none outline-none focus:ring-0 p-0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <span className="text-gray-500 text-sm font-medium bg-gray-100 px-2.5 py-4.5 border-r border-gray-300">
                        Height:
                      </span>
                      <div className="flex-1 flex items-center justify-center px-2 py-4">
                        <input
                          type="text"
                          value={isHeightFocused ? height : `${height}px`}
                          onChange={(e) => handleDimensionChange(e, setHeight)}
                          onFocus={() => setIsHeightFocused(true)}
                          onBlur={() => {
                            setIsHeightFocused(false);
                            if (!height) setHeight('1920');
                          }}
                          className="w-full text-center bg-transparent border-none outline-none focus:ring-0 p-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleClosePopup}
                  className="px-5 font-semibold !border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
               <Button
                  onClick={handleCreateProject}
                  disabled={!projectName.trim()}
                  className={`px-12 ${!projectName.trim()
                    ? '!bg-blue-300 cursor-not-allowed'
                    : 'bg-primary hover:bg-blue-700'
                    }`}
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
