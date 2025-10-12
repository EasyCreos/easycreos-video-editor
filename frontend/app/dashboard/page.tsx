'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const addFolder = () => {
    const newFolderName = folders.length === 0 ? 'Folder' : `Folder ${folders.length}`;
    setFolders([...folders, newFolderName]);
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

  return (
    <div className="min-h-screen bg-white flex">
      <div className="px-4 py-8 flex flex-col justify-between border-r border-gray-200" style={{ width: '13.75%' }}>
        <div>
          <div className="mb-6 flex items-center justify-center">
            <Image src="/icons/logo.svg" alt="EasyCreos Logo" width={125} height={35} />
          </div>
          <div className="mb-4">
            <button
              className="w-full bg-primary text-gray-100 rounded-full px-13 py-3 text-base font-semibold hover:bg-blue-500 transition cursor-pointer"
              onClick={() => { }}
            >
              Create project
            </button>
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
          <div className="space-y-0">
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
            <div ref={menuRef} className="absolute bottom-full mb-2 w-full bg-brand-white border-0 rounded-xl shadow-sm">
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
              <a href="#" className="block px-3 py-3 text-base font-medium text-brand-black flex items-center gap-2 rounded-b-xl hover:bg-gray-100 transition">
                <Image src="/icons/logout.svg" alt="Logout Icon" width={24} height={24} />
                Log out
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 pt-23">
        <div className="mb-12 flex items-center">
          <h2 className="pl-6 text-2xl font-medium text-black">Folder</h2>
          <div className="flex-1 flex justify-center items-center mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-125 px-5 py-3 border border-gray-200 rounded-full font-normal text-brand-black focus:outline-none focus:border-gray-400 pl-13"
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
            <button className="px-4 py-3 bg-primary text-gray-100 rounded-full font-semibold hover:bg-blue-500 transition cursor-pointer">
              Create project
            </button>
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
                    <button className="flex items-center text-brand-black px-5 py-3 border border-primary rounded-full font-semibold hover:bg-blue-200 transition cursor-pointer">
                      Open
                    </button>
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
    </div>
  );
}
