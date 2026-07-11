import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Menu, X, LayoutDashboard, FileText, FolderKanban, LogOut } from "lucide-react";
import { BrandLogo } from "./Logo";

export default function DashboardMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const confirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <>
      <nav className="w-full h-16 bg-white border-b border-gray-100 px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-ink hover:text-burnt-brown transition-colors cursor-pointer"
          >
            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
          
          <div className="flex items-center gap-2">
            <BrandLogo className="h-10 w-auto" />
            <span className="font-sans font-extrabold text-[10px] tracking-widest uppercase bg-burnt-brown text-canvas px-2 py-0.5 rounded-none hidden sm:inline-block">
              Admin Portal
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => handleNavigation('/admin')} 
            className={`font-sans text-xs font-bold tracking-widest uppercase transition-colors py-2 cursor-pointer ${isActive('/admin') ? 'text-burnt-brown border-b-2 border-burnt-brown' : 'text-muted-ink hover:text-ink'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => handleNavigation('/admin/stories')} 
            className={`font-sans text-xs font-bold tracking-widest uppercase transition-colors py-2 cursor-pointer ${isActive('/admin/stories') ? 'text-burnt-brown border-b-2 border-burnt-brown' : 'text-muted-ink hover:text-ink'}`}
          >
            Stories
          </button>
          <button 
            onClick={() => handleNavigation('/admin/categories')} 
            className={`font-sans text-xs font-bold tracking-widest uppercase transition-colors py-2 cursor-pointer ${isActive('/admin/categories') ? 'text-burnt-brown border-b-2 border-burnt-brown' : 'text-muted-ink hover:text-ink'}`}
          >
            Categories
          </button>
        </div>

        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="p-2 text-muted-ink hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1 font-sans text-xs font-bold tracking-widest uppercase"
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-canvas/95 backdrop-blur-sm md:hidden">
          <div className="flex flex-col p-6 gap-2 h-full">
            <button 
              onClick={() => handleNavigation('/admin')}
              className={`w-full flex items-center gap-4 py-4 px-4 font-sans text-sm font-bold tracking-widest uppercase border-b border-gray-100 ${isActive('/admin') ? 'text-burnt-brown bg-cream/10' : 'text-ink'}`}
            >
              <LayoutDashboard className="size-4 text-burnt-brown" />
              Overview Dashboard
            </button>
            <button 
              onClick={() => handleNavigation('/admin/stories')}
              className={`w-full flex items-center gap-4 py-4 px-4 font-sans text-sm font-bold tracking-widest uppercase border-b border-gray-100 ${isActive('/admin/stories') ? 'text-burnt-brown bg-cream/10' : 'text-ink'}`}
            >
              <FileText className="size-4 text-burnt-brown" />
              Manage Stories
            </button>
            <button 
              onClick={() => handleNavigation('/admin/categories')}
              className={`w-full flex items-center gap-4 py-4 px-4 font-sans text-sm font-bold tracking-widest uppercase border-b border-gray-100 ${isActive('/admin/categories') ? 'text-burnt-brown bg-cream/10' : 'text-ink'}`}
            >
              <FolderKanban className="size-4 text-burnt-brown" />
              Manage Categories
            </button>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-gray-100 max-w-sm w-full p-6 text-center shadow-lg">
            <h3 className="font-serif text-lg font-bold text-ink mb-2">Confirm Logout</h3>
            <p className="font-sans text-xs text-muted-ink tracking-normal mb-6">Are you sure you want to sign out of your administrative session?</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border border-gray-200 text-ink font-sans text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}