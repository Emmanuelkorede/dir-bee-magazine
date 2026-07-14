import axios from "axios";
import { useEffect, useState } from "react";
import DashboardMenu from "../../components/dashboardMenu";
import FormComponent from "../../components/FormComponent";
import { 
  Trash2, 
  Edit3, 
  Plus, 
  X, 
  AlertTriangle, 
  Folder, 
  Check, 
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  url: string;
  created_at: string; 
};

type Payload = Pick<Category, "name" | "url">;

export default function Categories() {
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [editName, setEditName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState('');
  
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') 
      .replace(/[\s_-]+/g, '-') 
      .replace(/^-+|-+$/g, ''); 
  };

  const getCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/category/', getAuthHeader());
      setCategories(response.data.result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data.message || 'Something went wrong fetching categories');
      } else {
        setMessage('Something went wrong');
      }
    }
  };

  const handleEditCat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const urlSlug = generateSlug(editName);
      const payload2 = { name: editName, url: urlSlug };
      
      const response = await axios.patch(`http://localhost:8000/category/${id}`, payload2, getAuthHeader());
      setMessage(response.data.message);
      setIsEditing(false);
      getCategories();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data.message || 'Failed to edit category');
      } else {
        setMessage('Something went wrong');
      }
    }
  };

  const handleDeleteCat = async (catId: string) => {
    try {
      const response = await axios.delete(`http://localhost:8000/category/${catId}`, getAuthHeader());
      setMessage(response.data.message || 'Category successfully deleted');
      setDeleteId(null); 
      getCategories();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data.message || 'Failed to delete category');
      } else {
        setMessage('Something went wrong');
      }
      setDeleteId(null);
    }
  };

  const handleCreateNewCat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const urlSlug = generateSlug(name);
      const payload: Payload = { name, url: urlSlug };
      
      await axios.post('http://localhost:8000/category/', payload, getAuthHeader());
      setMessage('Category created successfully!');
      setName('');
      getCategories();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data.message || 'Failed to create category');
      } else {
        setMessage('Something went wrong');
      }
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="min-h-screen bg-canvas pb-24 selection:bg-cream selection:text-burnt-brown">
      <DashboardMenu />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        
        {/* Header Title Section */}
        <div className="mb-6 sm:mb-8 border-b border-[#E5E2DA] pb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-ink">
              Manage Categories
            </h1>
            <p className="text-muted-ink font-sans text-xs tracking-normal mt-1.5">
              Create, edit, and coordinate your structural layout schemas and navigation modules.
            </p>
          </div>
        </div>

        {/* Global Feedback Message banner with Clean Dismissal */}
        {message && (
          <div className="mb-8 bg-cream/30 border-l-2 border-burnt-brown text-ink px-4 py-3.5 text-xs sm:text-sm tracking-wide font-sans font-medium flex justify-between items-center transition-all duration-300">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-burnt-brown flex-shrink-0" />
              <span>{message}</span>
            </div>
            <button 
              onClick={() => setMessage('')} 
              className="text-muted-ink hover:text-ink transition-colors cursor-pointer p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Responsive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main List Section: Spans 2 columns on desktops, drops down on mobile */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-[#E5E2DA] shadow-xs">
              <div className="px-5 py-4 border-b border-[#E5E2DA] bg-cream/10 flex items-center justify-between">
                <h3 className="font-sans text-[10px] font-extrabold tracking-widest uppercase text-ink flex items-center gap-2">
                  <Folder className="w-3.5 h-3.5 text-burnt-brown" />
                  All System Categories
                </h3>
                <span className="text-[10px] font-sans font-bold text-muted-ink bg-cream/40 px-2 py-0.5 rounded-sm">
                  {categories.length} Nodes
                </span>
              </div>
              
              <div className="divide-y divide-[#E5E2DA]">
                {categories.length === 0 ? (
                  <div className="p-12 text-center font-sans text-xs text-muted-ink tracking-wide">
                    No categories found. Create your first partition to begin structure.
                  </div>
                ) : (
                  categories.map((cat) => (
                    <div 
                      key={cat.id} 
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 hover:bg-cream/10 transition-all duration-200 gap-4"
                    >
                      <div className="flex items-center gap-4">
                        {/* Styled Alphabet Badge */}
                        <div className="w-10 h-10 border border-[#E5E2DA] bg-canvas text-burnt-brown flex-shrink-0 flex items-center justify-center font-serif font-black text-sm transition-colors group-hover:bg-burnt-brown group-hover:text-canvas">
                          {cat.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-serif text-sm font-bold text-ink truncate">
                            {cat.name}
                          </span>
                          <span className="text-[10px] text-burnt-brown bg-cream/40 px-2 py-0.5 self-start mt-1.5 font-sans tracking-wider font-semibold uppercase">
                            /{cat.url}
                          </span>
                        </div>
                      </div>
                      
                      {/* Interactive Controls */}
                      <div className="flex items-center sm:justify-end gap-1.5 border-t border-gray-100 sm:border-t-0 pt-3 sm:pt-0">
                        <button 
                          onClick={() => {
                            setIsEditing(true); 
                            setId(cat.id); 
                            setEditName(cat.name);
                          }}
                          className="p-2 text-muted-ink hover:text-burnt-brown hover:bg-cream/20 rounded-xs transition-colors cursor-pointer flex items-center justify-center"
                          title="Edit Layout Node"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteId(cat.id)}
                          className="p-2 text-muted-ink hover:text-red-600 hover:bg-red-50 rounded-xs transition-colors cursor-pointer flex items-center justify-center"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Action Columns Sticky Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-8">
            
            {/* Create Category Panel */}
            <div className="bg-white border border-[#E5E2DA] p-6 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-ink mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-burnt-brown"></span>
                Add Category
              </h3>
              <form onSubmit={handleCreateNewCat} className="space-y-4">
                <div>
                  <FormComponent 
                    id="name"  
                    type="text" 
                    label="Category Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-2.5 px-4 bg-burnt-brown hover:bg-[#3d2a1f] text-canvas font-sans text-xs font-bold tracking-widest uppercase transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Node
                </button>
              </form>
            </div>

            {/* Edit Category conditional Drawer */}
            {isEditing && (
              <div className="bg-white border-2 border-burnt-brown p-6 shadow-md relative animate-fade-in">
                <h3 className="font-serif text-lg font-bold text-ink mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 animate-pulse"></span>
                  Edit Category Parameters
                </h3>
                
                {/* Form correctly targets handleEditCat to process submit actions */}
                <form onSubmit={handleEditCat} className="space-y-4">
                  <div>
                    <FormComponent 
                      id="editName"  
                      type="text" 
                      label="New Name Specification" 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)} 
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)}
                      className="py-2.5 px-3 border border-[#E5E2DA] text-ink font-sans text-xs font-bold tracking-widest uppercase hover:bg-cream/25 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-sans text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* CUSTOM CONFIRMATION DIALOG MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-burnt-brown p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-none flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-ink">Purge Category?</h4>
                <p className="text-xs text-muted-ink mt-2 font-sans leading-relaxed">
                  Are you absolutely sure you want to delete this navigation structural node? Associated layouts may experience route inconsistencies.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2.5">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-[#E5E2DA] text-ink text-xs font-bold font-sans uppercase hover:bg-cream/20 transition-colors cursor-pointer"
              >
                No, Keep It
              </button>
              <button
                onClick={() => handleDeleteCat(deleteId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-sans uppercase transition-colors cursor-pointer"
              >
                Yes, Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}