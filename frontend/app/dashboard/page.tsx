'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  return (
    <div className="min-h-screen bg-white flex">
      {/* Ліва панель */}
      <div className="px-4 py-8 flex flex-col justify-between border-r border-gray-200" style={{ width: '13.75%' }}>
        {/* Верхня секція (логотип + кнопка New folder) */}
        <div>
          <div className="mb-6 flex items-center justify-center">
            <Image src="/icons/logo.svg" alt="EasyCreos Logo" width={125} height={35} />
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
                className={`w-full flex items-center justify-between gap-2 px-3 py-3 text-base font-medium text-brand-black rounded-full transition ${selectedFolder === folder ? 'bg-blue-50' : 'hover:bg-blue-50'
                  }`}
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

        {/* Кнопка профілю (знизу) */}
        <div className="relative">
          <button
            className="w-full flex items-center justify-between gap-2 bg-transparent border border-gray-200 rounded-full px-3 py-2 hover:bg-gray-100 transition cursor-pointer"
            onClick={() => {
              if (!isMenuOpen) {
                setIsMenuOpen(true);
              } else {
                setIsMenuOpen(false);
              }
            }}
          >
            <div className="flex items-center gap-2">
              <Image src="/icons/def-user.png" alt="User Avatar" width={40} height={40} className="rounded-full" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-brand-black">Example</span>
                <span className="text-xs font-semibold text-gray-400">Free</span>
              </div>
            </div>
            <Image src="/icons/more-vertical.svg" alt="Menu" width={24} height={24} />
          </button>

          {/* Випадаюче меню */}
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
              <a href="#" className="block px-3 py-3 text-base font-medium text-brand-black flex items-center gap-2 hover:bg-gray-100 transition">
                <Image src="/icons/profile.svg" alt="Profile Icon" width={24} height={24} />
                Profile
              </a>
              <a href="#" className="block px-3 py-3 text-base font-medium text-brand-black flex items-center gap-2 rounded-b-xl hover:bg-gray-100 transition">
                <Image src="/icons/logout.svg" alt="Logout Icon" width={24} height={24} />
                Log out
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Права панель (поки порожня) */}
      <div className="flex-1 p-6">
        {/* Тут буде основний контент */}
      </div>
    </div>
  );
}
