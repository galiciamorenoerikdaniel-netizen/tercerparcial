import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  LogOut, 
  Bell, 
  Search, 
  Menu, 
  ChevronRight, 
  Lock, 
  FileText, 
  Settings,
  Activity,
  AlertTriangle,
  GitPullRequest,
  CheckCircle,
  Clock,
  Database,
  UserPlus,
  X,
  User,
  Mail,
  Package,
  BarChart2,
  Calendar,
  Trash2,
  Inbox,
  Send,
  Save,
  Cpu,
  Edit,
  Megaphone,
  TrendingUp,
  DollarSign,
  Share2,
  PieChart,
  Download,
  Copy,
  Plus,
  Briefcase,
  HelpCircle,
  CheckSquare,
  LifeBuoy,
  MousePointer
} from 'lucide-react';

/**
 * SISTEMA ERP SEGURO
 */

// --- MOCK SERVICES ---

const mongoService = {
  data: {
    users: [
      { _id: '507f1f77bcf86cd799439011', name: 'Osito de peluche', role: 'Admin', email: 'admin@erp.com', status: 'Activo', department: 'IT Sec', lastLogin: new Date().toISOString() },
      { _id: '507f1f77bcf86cd799439012', name: 'Juan Pérez', role: 'Editor', email: 'juan@erp.com', status: 'Activo', department: 'RRHH', lastLogin: new Date(Date.now() - 86400000).toISOString() },
      { _id: '507f1f77bcf86cd799439013', name: 'Maria Lopez', role: 'Viewer', email: 'maria@erp.com', status: 'Inactivo', department: 'Ventas', lastLogin: new Date(Date.now() - 172800000).toISOString() },
    ],
    notifications: [
      { id: 1, title: 'Nuevo usuario registrado', time: 'Hace 5 min', read: false },
      { id: 2, title: 'Campaña Facebook Ads finalizada', time: 'Hace 30 min', read: false },
    ],
    inventory: [
      { id: 'HW-001', name: 'Servidor Dell PowerEdge', category: 'Hardware', stock: 5, status: 'Operativo' },
      { id: 'SW-002', name: 'Licencia Office 365 E5', category: 'Software', stock: 150, status: 'Activo' },
      { id: 'HW-003', name: 'MacBook Pro M2', category: 'Hardware', stock: 12, status: 'Bajo Stock' },
    ],
    messages: [
      { id: 1, from: 'Sistema', subject: 'Bienvenido al ERP v2.0', body: 'Recuerde cambiar su contraseña cada 30 días.', date: 'Hoy, 09:00 AM', read: false },
    ],
    socialRoi: [
      { id: 1, platform: 'Facebook Ads', campaign: 'Verano 2024', cost: 1200, revenue: 3500, clicks: 8500 },
      { id: 2, platform: 'LinkedIn B2B', campaign: 'Leads Corp', cost: 2500, revenue: 1500, clicks: 1200 },
      { id: 3, platform: 'Instagram', campaign: 'Brand Aware', cost: 800, revenue: 2100, clicks: 15000 },
    ],
    projects: [
      { id: 1, name: 'Migración a la Nube', leader: 'Osito P.', progress: 75, status: 'En Progreso', deadline: '2024-12-01' },
      { id: 2, name: 'Auditoría ISO 27001', leader: 'Juan P.', progress: 30, status: 'Retrasado', deadline: '2024-11-15' },
    ]
  },
  
  // Simulated Async Calls
  async getUsers() { return new Promise(resolve => setTimeout(() => resolve([...this.data.users]), 300)); },
  async getInventory() { return new Promise(resolve => setTimeout(() => resolve([...this.data.inventory]), 300)); },
  async getMessages() { return this.data.messages; },
  async getSocialData() { return new Promise(resolve => setTimeout(() => resolve([...this.data.socialRoi]), 300)); },
  async getProjects() { return new Promise(resolve => setTimeout(() => resolve([...this.data.projects]), 300)); },
  
  async createUser(userData) {
    return new Promise(resolve => {
      setTimeout(() => {
        const newUser = { _id: Math.random().toString(36).substr(2, 9), ...userData, status: 'Activo', lastLogin: 'Nunca' };
        this.data.users.unshift(newUser);
        resolve(newUser);
      }, 500);
    });
  },

  async updateUser(updatedUser) {
    return new Promise(resolve => {
      setTimeout(() => {
        const index = this.data.users.findIndex(u => u._id === updatedUser._id);
        if (index !== -1) this.data.users[index] = updatedUser;
        resolve(updatedUser);
      }, 500);
    });
  },

  async deleteUser(userId) {
    return new Promise(resolve => {
      setTimeout(() => {
        this.data.users = this.data.users.filter(u => u._id !== userId);
        resolve(userId);
      }, 300);
    });
  },

  async createCampaign(campaignData) {
    return new Promise(resolve => {
      setTimeout(() => {
        const newCampaign = { id: Date.now(), ...campaignData, clicks: 0 };
        this.data.socialRoi.unshift(newCampaign);
        resolve(newCampaign);
      }, 500);
    });
  },

  async createProject(projectData) {
    return new Promise(resolve => {
      setTimeout(() => {
        const newProject = { id: Date.now(), ...projectData, progress: 0, status: 'Planificación' };
        this.data.projects.unshift(newProject);
        resolve(newProject);
      }, 500);
    });
  },

  async getNotifications() { return this.data.notifications; }
};

const auth0Client = {
  isAuthenticated: false,
  user: null,
  loginWithRedirect: async (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'Osito de peluche' && password === 'Temporal#123') {
          resolve({ 
            name: 'Osito de peluche', 
            email: 'admin@erp.com', 
            role: 'Admin',
            picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Osito',
            sub: 'auth0|123456' 
          });
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 1000);
    });
  }
};

// --- COMPONENTS ---

// 1. TOAST NOTIFICATION
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center animate-fade-in-up z-[100]">
      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

// 2. MODALS
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1e293b] w-full max-w-sm rounded-2xl border border-red-500/30 shadow-2xl p-6 relative animate-scale-up text-center">
        <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
          <Trash2 className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Usuario?</h3>
        <p className="text-slate-400 text-sm mb-6">Esta acción eliminará a <span className="text-white font-bold">{userName}</span> permanentemente.</p>
        <div className="flex justify-center gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">Cancelar</button>
          <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors shadow-lg shadow-red-500/20 active:scale-95 transform duration-100">Eliminar</button>
        </div>
      </div>
    </div>
  );
};

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await auth0Client.loginWithRedirect(username, password);
      onLogin(user);
    } catch (err) {
      setError('Error de Auth0: Credenciales incorrectas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden text-slate-200 font-sans">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <div className="bg-[#1e293b]/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md z-10 border border-slate-700 relative">
        <div className="flex justify-center mb-8">
           <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 shadow-inner">
             <ShieldCheck className="w-8 h-8 text-cyan-500" />
           </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-2">Acceso Seguro ERP</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-cyan-500 outline-none" placeholder="Usuario" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-cyan-500 outline-none" placeholder="Contraseña" />
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-cyan-500 hover:to-blue-500 transition-all active:scale-95">
            {loading ? 'Cargando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

const UserModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Viewer', department: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ name: '', email: '', role: 'Viewer', department: '' });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1e293b] w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl p-6 relative animate-scale-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center"><UserPlus className="w-5 h-5 mr-2 text-cyan-400" />{initialData ? 'Editar Usuario' : 'Registrar Usuario'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="Nombre" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input required type="email" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input required className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="Departamento" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
          <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
            <option value="Admin">Admin</option><option value="Editor">Editor</option><option value="Viewer">Viewer</option>
          </select>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="text-slate-300 hover:text-white">Cancelar</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors active:scale-95">{loading ? '...' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CampaignModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ platform: 'Facebook Ads', campaign: '', cost: '', revenue: '' });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave({ ...formData, cost: Number(formData.cost), revenue: Number(formData.revenue) });
    setLoading(false);
    onClose();
    setFormData({ platform: 'Facebook Ads', campaign: '', cost: '', revenue: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1e293b] w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl p-6 relative animate-scale-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center"><Megaphone className="w-5 h-5 mr-2 text-cyan-400" />Nueva Campaña ROI</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})}>
            <option>Facebook Ads</option><option>Instagram Ads</option><option>LinkedIn B2B</option><option>Google Ads</option>
          </select>
          <input required className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="Nombre de la Campaña" value={formData.campaign} onChange={e => setFormData({...formData, campaign: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <input required type="number" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="Costo ($)" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} />
            <input required type="number" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="Retorno ($)" value={formData.revenue} onChange={e => setFormData({...formData, revenue: e.target.value})} />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="text-slate-300 hover:text-white">Cancelar</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors active:scale-95">Lanzar Campaña</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProjectModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: '', leader: '', deadline: '' });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
    onClose();
    setFormData({ name: '', leader: '', deadline: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1e293b] w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl p-6 relative animate-scale-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center"><Briefcase className="w-5 h-5 mr-2 text-cyan-400" />Nuevo Proyecto</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="Nombre del Proyecto" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input required className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="Líder del Proyecto" value={formData.leader} onChange={e => setFormData({...formData, leader: e.target.value})} />
          <input required type="date" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="text-slate-300 hover:text-white">Cancelar</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors active:scale-95">Crear Proyecto</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ReportModal = ({ isOpen, onClose, reportTitle }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white w-full max-w-4xl h-[80vh] rounded-lg shadow-2xl flex flex-col relative animate-scale-up">
        <div className="bg-slate-800 text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center"><FileText className="mr-2" /><span className="font-bold">{reportTitle || 'Vista Previa'}</span></div>
          <button onClick={onClose}><X className="text-slate-400 hover:text-white" /></button>
        </div>
        <div className="flex-1 bg-slate-100 p-8 overflow-y-auto flex flex-col items-center justify-center">
          <div className="bg-white shadow-lg w-full max-w-2xl h-full p-12 border border-slate-200">
             <div className="border-b-2 border-slate-800 pb-4 mb-8 flex justify-between"><h1 className="text-2xl font-bold text-slate-800">ERP REPORTE 2024</h1><span className="text-slate-500 font-mono">CONFIDENCIAL</span></div>
             <div className="space-y-4 text-slate-600 text-justify">
               <p className="mb-4">Este documento certifica el análisis de datos del periodo actual. A continuación se presentan las métricas clave visualizadas.</p>
               <div className="h-64 w-full bg-slate-50 border border-slate-200 rounded mt-8 flex flex-col items-center justify-center p-4">
                 <h4 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-widest">Rendimiento Anual</h4>
                 <svg viewBox="0 0 400 150" className="w-full h-full">
                    <path d="M0,150 L0,100 Q100,20 200,80 T400,50 L400,150 Z" fill="#e0f2fe" />
                    <path d="M0,100 Q100,20 200,80 T400,50" fill="none" stroke="#0ea5e9" strokeWidth="3" />
                    <circle cx="200" cy="80" r="4" fill="#0ea5e9" />
                    <circle cx="400" cy="50" r="4" fill="#0ea5e9" />
                 </svg>
               </div>
               <p className="mt-8 text-xs text-slate-400">Generado automáticamente por SystemERP v2.5</p>
             </div>
          </div>
        </div>
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
           <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded transition-colors">Cerrar</button>
           <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 flex items-center transition-transform active:scale-95"><Download className="w-4 h-4 mr-2" /> Descargar PDF</button>
        </div>
      </div>
    </div>
  );
};

// --- CHARTS ---
const ActivityChart = () => (
  <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
    <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" /><stop offset="100%" stopColor="#06b6d4" stopOpacity="0" /></linearGradient></defs>
    <path d="M0,150 L0,100 Q125,40 250,80 T500,60 L500,150 Z" fill="url(#chartGrad)" />
    <path d="M0,100 Q125,40 250,80 T500,60" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
  </svg>
);
const BarChart = () => (
  <svg viewBox="0 0 400 200" className="w-full h-full">
    <line x1="20" y1="180" x2="380" y2="180" stroke="#475569" strokeWidth="2" />
    <line x1="20" y1="20" x2="20" y2="180" stroke="#475569" strokeWidth="2" />
    {[40, 80, 120, 160].map((h, i) => (
      <g key={i}>
        <rect x={40 + i * 90} y={180 - h} width="50" height={h} fill={i % 2 === 0 ? "#06b6d4" : "#3b82f6"} rx="4" className="hover:opacity-80 transition-opacity cursor-pointer" />
        <text x={65 + i * 90} y={180 - h - 10} textAnchor="middle" fill="#94a3b8" fontSize="12">{h * 10}</text>
      </g>
    ))}
  </svg>
);

// --- MAIN APP ---

const App = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [socialData, setSocialData] = useState([]);
  const [projects, setProjects] = useState([]); 
  const [toastMessage, setToastMessage] = useState(null);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteData, setDeleteData] = useState({ isOpen: false, user: null });
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false); 
  const [reportModalData, setReportModalData] = useState({ isOpen: false, title: '' });

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (user) {
      mongoService.getUsers().then(setUsers);
      mongoService.getNotifications().then(setNotifications);
      mongoService.getInventory().then(setInventory);
      mongoService.getMessages().then(setMessages);
      mongoService.getSocialData().then(setSocialData);
      mongoService.getProjects().then(setProjects);
    }
  }, [user]);

  const filteredUsers = useMemo(() => users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())), [users, searchQuery]);

  const showToast = (msg) => setToastMessage(msg);

  const handleShare = (e) => { e.stopPropagation(); showToast("Enlace copiado al portapapeles"); };

  const handleSaveUser = async (formData) => {
    if (editingUser) {
      const updatedUser = { ...editingUser, ...formData };
      await mongoService.updateUser(updatedUser);
      setUsers(prev => prev.map(u => u._id === updatedUser._id ? updatedUser : u));
      showToast(`Usuario ${updatedUser.name} actualizado`);
    } else {
      const newUser = await mongoService.createUser(formData);
      setUsers(prev => [newUser, ...prev]);
      showToast(`Usuario ${newUser.name} creado`);
    }
    setEditingUser(null);
  };

  const promptDeleteUser = (user) => { setDeleteData({ isOpen: true, user }); };

  const confirmDeleteUser = async () => {
    if (deleteData.user) {
      await mongoService.deleteUser(deleteData.user._id);
      setUsers(prev => prev.filter(u => u._id !== deleteData.user._id));
      showToast("Usuario eliminado correctamente");
      setDeleteData({ isOpen: false, user: null });
    }
  };

  const handleCreateCampaign = async (data) => {
    const newCampaign = await mongoService.createCampaign(data);
    setSocialData(prev => [newCampaign, ...prev]);
    showToast("Campaña lanzada exitosamente");
  };

  const handleCreateProject = async (data) => {
    const newProject = await mongoService.createProject(data);
    setProjects(prev => [newProject, ...prev]);
    showToast("Proyecto creado exitosamente");
  };

  const openReport = (title) => { setReportModalData({ isOpen: true, title }); };
  const clearNotifications = () => { setNotifications([]); setShowNotifMenu(false); showToast("Notificaciones limpiadas"); };
  const handleItemClick = (msg) => { showToast(msg); }

  if (!user) return <Login onLogin={setUser} />;

  // --- VIEWS ---

  const DashboardView = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Users size={80} /></div>
          <p className="text-slate-400 text-xs font-bold uppercase">Total Usuarios</p>
          <h3 className="text-3xl font-bold text-white mt-2 transition-all">{users.length}</h3>
          <span className="text-emerald-400 text-xs font-bold flex items-center mt-2"><CheckCircle className="w-3 h-3 mr-1"/> Sincronizado</span>
        </div>
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden hover:scale-[1.02] transition-transform duration-300">
          <p className="text-slate-400 text-xs font-bold uppercase">Proyectos Activos</p>
          <h3 className="text-3xl font-bold text-white mt-2">{projects.length}</h3>
          <Briefcase className="absolute right-4 top-4 text-slate-700 opacity-20 w-20 h-20" />
        </div>
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden hover:scale-[1.02] transition-transform duration-300">
          <p className="text-slate-400 text-xs font-bold uppercase">ROI Mensual</p>
          <h3 className="text-3xl font-bold text-emerald-400 mt-2 flex items-center"><TrendingUp className="w-6 h-6 mr-2" /> +12%</h3>
          <DollarSign className="absolute right-4 top-4 text-emerald-900 opacity-20 w-20 h-20" />
        </div>
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden hover:scale-[1.02] transition-transform duration-300">
          <p className="text-slate-400 text-xs font-bold uppercase">Alertas</p>
          <h3 className="text-3xl font-bold text-white mt-2">{notifications.length}</h3>
          <Bell className="absolute right-4 top-4 text-slate-700 opacity-20 w-20 h-20" />
        </div>
      </div>
      <div className="lg:col-span-2 bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-lg hover:border-cyan-500/30 transition-colors">
        <h3 className="text-white font-bold mb-4 flex items-center"><Activity className="w-5 h-5 mr-2 text-cyan-400" />Tráfico de Red</h3>
        <div className="h-64"><ActivityChart /></div>
      </div>
    </div>
  );

  const ProjectsView = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center"><h3 className="text-xl font-bold text-white flex items-center"><Briefcase className="mr-2 text-cyan-400"/> Gestión de Proyectos</h3><button onClick={() => setIsProjectModalOpen(true)} className="bg-blue-600 px-4 py-2 rounded-lg text-white text-sm hover:bg-blue-500 flex items-center shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"><Plus className="w-4 h-4 mr-2" /> Nuevo Proyecto</button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <div key={p.id} onClick={() => handleItemClick(`Abriendo detalles de: ${p.name}`)} className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 hover:border-cyan-500/50 transition-all cursor-pointer hover:scale-[1.02]">
            <div className="flex justify-between items-start mb-4"><span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'Completado' ? 'bg-emerald-900/30 text-emerald-400' : p.status === 'Retrasado' ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'}`}>{p.status}</span><span className="text-slate-500 text-xs flex items-center"><Clock size={12} className="mr-1"/> {p.deadline}</span></div>
            <h4 className="text-lg font-bold text-white mb-1">{p.name}</h4><p className="text-slate-400 text-sm mb-4">Líder: {p.leader}</p>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-2"><div className={`h-2 rounded-full ${p.progress === 100 ? 'bg-emerald-500' : 'bg-cyan-500'}`} style={{width: `${p.progress}%`}}></div></div>
            <p className="text-right text-xs text-slate-400">{p.progress}% Completado</p>
          </div>
        ))}
      </div>
    </div>
  );

  const SupportView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
      <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center"><HelpCircle className="mr-2 text-cyan-400"/> Centro de Ayuda</h3><p className="text-slate-400 text-sm mb-6">Si tienes problemas con el ERP, abre un ticket aquí.</p>
        <form className="space-y-4">
          <input className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 transition-colors" placeholder="Asunto del problema" />
          <textarea className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white h-32 focus:border-cyan-500 transition-colors" placeholder="Describe el error..." />
          <button onClick={(e)=>{e.preventDefault(); showToast("Ticket enviado a soporte");}} className="w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-500 active:scale-95 transition-all">Enviar Ticket</button>
        </form>
      </div>
      <div className="space-y-4">
        <div onClick={() => handleItemClick('Abriendo artículo de ayuda...')} className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 hover:bg-slate-800 cursor-pointer transition-colors group"><h4 className="text-white font-bold flex items-center mb-2 group-hover:text-cyan-400"><LifeBuoy className="mr-2 text-slate-500 group-hover:text-cyan-400"/> ¿Cómo cambio mi contraseña?</h4><p className="text-slate-400 text-sm">Ve a Configuración {'>'} Seguridad y selecciona 'Cambiar Clave'.</p></div>
        <div onClick={() => handleItemClick('Abriendo artículo de ayuda...')} className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 hover:bg-slate-800 cursor-pointer transition-colors group"><h4 className="text-white font-bold flex items-center mb-2 group-hover:text-cyan-400"><CheckSquare className="mr-2 text-slate-500 group-hover:text-cyan-400"/> Error al exportar PDF</h4><p className="text-slate-400 text-sm">Asegúrate de tener los permisos de 'Viewer' o superior habilitados.</p></div>
      </div>
    </div>
  );

  const MarketingView = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center"><h3 className="text-xl font-bold text-white flex items-center"><Megaphone className="mr-2 text-cyan-400"/> Sistema ROI - Redes Sociales</h3><button onClick={() => setIsCampaignModalOpen(true)} className="bg-blue-600 px-4 py-2 rounded-lg text-white text-sm hover:bg-blue-500 shadow-lg shadow-blue-500/20 flex items-center active:scale-95 transition-transform"><Plus className="w-4 h-4 mr-2" /> Nueva Campaña</button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{socialData.map(item => { const roi = ((item.revenue - item.cost) / item.cost) * 100; return (<div key={item.id} onClick={() => handleItemClick('Analizando métricas de campaña...')} className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-colors cursor-pointer hover:scale-[1.02]"><div className="flex justify-between items-start mb-4"><div className="bg-slate-800 p-3 rounded-lg"><Share2 className="text-cyan-400 w-6 h-6" /></div><span className={`px-2 py-1 rounded text-xs font-bold ${roi >= 0 ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'}`}>{roi.toFixed(1)}% ROI</span></div><h4 className="text-lg font-bold text-white">{item.platform}</h4><p className="text-slate-400 text-sm mb-4">{item.campaign}</p><div className="grid grid-cols-2 gap-4 border-t border-slate-700 pt-4"><div><p className="text-[10px] text-slate-500 uppercase">Costo</p><p className="text-white font-mono">${item.cost}</p></div><div><p className="text-[10px] text-slate-500 uppercase">Retorno</p><p className="text-white font-mono">${item.revenue}</p></div></div></div>); })}</div>
    </div>
  );

  const VisualReportsView = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-lg"><div className="flex justify-between items-center mb-6"><h3 className="text-white font-bold flex items-center"><BarChart2 className="w-5 h-5 mr-2 text-cyan-400" /> Rendimiento por Dpto.</h3></div><div className="h-64"><BarChart /></div></div>
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-lg"><div className="flex justify-between items-center mb-6"><h3 className="text-white font-bold flex items-center"><PieChart className="w-5 h-5 mr-2 text-cyan-400" /> Distribución de Presupuesto</h3></div><div className="flex items-center justify-center h-64 relative"><div className="w-48 h-48 rounded-full border-8 border-slate-800 relative bg-[conic-gradient(at_center,_#06b6d4_0deg_120deg,_#3b82f6_120deg_240deg,_#64748b_240deg_360deg)] shadow-lg animate-spin-slow"><div className="absolute inset-4 bg-[#1e293b] rounded-full flex items-center justify-center"><span className="text-white font-bold text-lg">Total</span></div></div></div></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{[1, 2].map(i => (<div key={i} onClick={() => openReport(`Reporte Anual de Incidencias 2024 - v${i}.0`)} className="bg-[#1e293b] p-4 rounded-xl border border-slate-700 flex items-center justify-between hover:bg-slate-800/80 cursor-pointer group transition-all hover:scale-[1.01]"><div className="flex items-center"><div className="p-3 bg-slate-800 rounded-lg mr-4"><FileText className="text-white group-hover:text-cyan-400 transition-colors" /></div><div><h4 className="text-white font-bold">Reporte Anual de Incidencias 2024</h4><p className="text-slate-400 text-xs">PDF • 2.4 MB</p></div></div><button onClick={handleShare} className="p-2 hover:bg-slate-700 rounded-full text-cyan-400 transition-colors active:scale-95"><Share2 size={18} /></button></div>))}</div>
    </div>
  );

  const UsersView = () => (
    <div className="bg-[#1e293b] rounded-2xl border border-slate-700 shadow-lg animate-fade-in-up flex flex-col h-full">
      <div className="p-6 border-b border-slate-700 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Gestión de Usuarios</h3>
        <button onClick={() => { setEditingUser(null); setIsUserModalOpen(true); }} className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm flex items-center hover:bg-cyan-500 shadow-lg shadow-cyan-500/20 active:scale-95 transition-transform"><UserPlus className="w-4 h-4 mr-2" /> Nuevo Usuario</button>
      </div>
      <div className="overflow-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-800/80 sticky top-0 backdrop-blur-sm text-slate-400 text-xs uppercase"><tr><th className="px-6 py-4">Usuario</th><th className="px-6 py-4">Rol</th><th className="px-6 py-4">Estado</th><th className="px-6 py-4 text-right">Acciones</th></tr></thead>
          <tbody className="divide-y divide-slate-700/50 text-slate-300 text-sm">
            {filteredUsers.map(u => (
              <tr key={u._id} className="hover:bg-slate-800/30 group transition-colors">
                <td className="px-6 py-4 font-medium text-white flex items-center"><div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mr-3 text-xs">{u.name.charAt(0)}</div>{u.name}</td>
                <td className="px-6 py-4">{u.role}</td><td className="px-6 py-4 text-emerald-400">{u.status}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={(e) => { e.stopPropagation(); setEditingUser(u); setIsUserModalOpen(true); }} className="p-2 hover:bg-blue-900/30 text-blue-400 rounded transition-colors active:scale-95"><Edit size={16}/></button>
                    <button onClick={(e) => { e.stopPropagation(); promptDeleteUser(u); }} className="p-2 hover:bg-red-900/30 text-red-400 rounded transition-colors active:scale-95"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ProfileView = () => (
    <div className="animate-fade-in-up max-w-4xl mx-auto"><div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden shadow-2xl pb-8"><div className="h-32 bg-gradient-to-r from-blue-900 to-cyan-900 relative"><div className="absolute -bottom-16 left-8 p-1 bg-[#1e293b] rounded-full"><img src={user.picture} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-[#1e293b]" /></div></div><div className="pt-20 px-8"><div className="flex justify-between items-start mb-6"><div><h2 className="text-3xl font-bold text-white">{user.name}</h2><p className="text-cyan-400 font-medium">{user.role}</p></div><button onClick={() => showToast("Perfil actualizado")} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-500 active:scale-95 transition-transform"><Save className="w-4 h-4 mr-2" /> Guardar</button></div><div className="grid grid-cols-2 gap-6"><div><label className="block text-slate-400 text-xs mb-2">EMAIL</label><input readOnly value={user.email} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-300" /></div><div><label className="block text-slate-400 text-xs mb-2">DEPARTAMENTO</label><input readOnly value="IT SecOps" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-300" /></div></div></div></div></div>
  );

  const MessagesView = () => (
    <div className="bg-[#1e293b] rounded-2xl border border-slate-700 shadow-lg p-6 animate-fade-in-up flex flex-col items-center justify-center text-slate-500 h-[calc(100vh-140px)]">
      <Inbox size={48} className="mx-auto mb-4 opacity-50"/>
      <h3 className="text-lg font-medium text-slate-300">Bandeja de Entrada</h3>
      <p className="mb-6">Selecciona un mensaje para leer</p>
      <button onClick={() => showToast("Redactando nuevo mensaje...")} className="bg-cyan-600 text-white px-6 py-2 rounded-full hover:bg-cyan-500 active:scale-95 transition-transform flex items-center"><Edit className="w-4 h-4 mr-2"/> Redactar</button>
    </div>
  );

  const InventoryView = () => (
    <div className="bg-[#1e293b] rounded-2xl border border-slate-700 shadow-lg p-6 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white flex items-center"><Cpu className="mr-2 text-cyan-400" />Inventario de Activos</h3>
        <button onClick={() => showToast("Descargando inventario.csv...")} className="bg-slate-700 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-slate-600 active:scale-95 transition-transform flex items-center"><Download className="w-4 h-4 mr-2"/> Exportar CSV</button>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase"><tr><th className="p-4">SKU</th><th className="p-4">Activo</th><th className="p-4">Stock</th></tr></thead>
        <tbody className="text-slate-300 text-sm divide-y divide-slate-700/50">
          {inventory.map(item => (<tr key={item.id} className="hover:bg-slate-800/30 transition-colors"><td className="p-4 text-cyan-500">{item.id}</td><td className="p-4">{item.name}</td><td className="p-4">{item.stock}</td></tr>))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden font-sans text-slate-200 relative">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#020617] border-r border-slate-800 transition-all duration-300 flex flex-col z-20`}>
        <div className="h-20 flex items-center justify-center border-b border-slate-800/50">
          <div className="flex items-center gap-2 text-white"><div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-lg"><ShieldCheck size={20} /></div>{sidebarOpen && <span className="font-bold text-lg tracking-tight">SECURE<span className="text-cyan-400">ERP</span></span>}</div>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'marketing', icon: Megaphone, label: 'Marketing ROI' },
            { id: 'projects', icon: Briefcase, label: 'Proyectos' }, 
            { id: 'users', icon: Users, label: 'Usuarios' },
            { id: 'inventory', icon: Package, label: 'Inventario' },
            { id: 'reports', icon: BarChart2, label: 'Reportes' },
            { id: 'support', icon: HelpCircle, label: 'Soporte' }, 
            { id: 'messages', icon: Mail, label: 'Mensajería' },
          ].map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSearchQuery(''); }} className={`w-full flex items-center ${sidebarOpen ? 'px-4' : 'justify-center'} py-3 rounded-xl transition-all relative group active:scale-95 duration-75 ${activeTab === item.id ? 'bg-blue-600/10 text-cyan-400 border border-blue-500/30' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'}`}>
              {activeTab === item.id && <div className="absolute left-0 h-6 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_10px_#22d3ee]"></div>}
              <item.icon className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : ''}`} />{sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-[#0f172a]/90 backdrop-blur border-b border-slate-800 flex justify-between items-center px-6 z-10">
          <div className="flex items-center gap-4"><button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded hover:bg-slate-800 text-slate-400 active:scale-95 transition-transform"><Menu size={20} /></button><div className="relative hidden md:block group"><input type="text" placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-80 bg-[#1e293b] border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:border-cyan-500 outline-none transition-colors" /><Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" /></div></div>
          <div className="flex items-center gap-4">
            <div className="relative"><button onClick={() => { setShowNotifMenu(!showNotifMenu); setShowUserMenu(false); }} className="relative p-2 text-slate-400 hover:text-white active:scale-95 transition-transform"><Bell size={20} />{notifications.length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>}</button>{showNotifMenu && (<div className="absolute right-0 mt-2 w-80 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-fade-in-up"><div className="px-4 py-2 border-b border-slate-700 flex justify-between items-center"><h4 className="text-sm font-bold text-white">Notificaciones</h4><button onClick={clearNotifications} className="text-xs text-red-400 hover:text-red-300 flex items-center active:scale-95 transition-transform"><Trash2 size={12} className="mr-1"/> Limpiar</button></div><div className="max-h-64 overflow-y-auto">{notifications.length > 0 ? notifications.map(n => (<div key={n.id} className="px-4 py-3 hover:bg-slate-800/50 border-b border-slate-800/50"><p className="text-sm text-slate-200 font-medium">{n.title}</p><p className="text-xs text-slate-500 mt-1">{n.time}</p></div>)) : <div className="p-4 text-center text-slate-500 text-sm">Sin notificaciones</div>}</div></div>)}</div>
            <div className="relative pl-4 border-l border-slate-700"><button onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifMenu(false); }} className="flex items-center gap-3 active:scale-95 transition-transform"><div className="text-right hidden md:block"><p className="text-sm font-bold text-white">{user.name}</p><p className="text-[10px] text-cyan-400 uppercase tracking-widest font-semibold">{user.role}</p></div><img src={user.picture} className="w-10 h-10 rounded-full border border-slate-600" /></button>{showUserMenu && (<div className="absolute right-0 mt-2 w-56 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-fade-in-up"><button onClick={() => { setActiveTab('profile'); setShowUserMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center active:bg-slate-800"><User size={16} className="mr-2" /> Mi Perfil</button><div className="border-t border-slate-700 my-2"></div><button onClick={() => { setUser(null); setShowUserMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 flex items-center active:bg-red-900/30"><LogOut size={16} className="mr-2" /> Cerrar Sesión</button></div>)}</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 relative" onClick={() => { if(showNotifMenu) setShowNotifMenu(false); if(showUserMenu) setShowUserMenu(false); }}>
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'marketing' && <MarketingView />}
          {activeTab === 'projects' && <ProjectsView />}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'reports' && <VisualReportsView />}
          {activeTab === 'support' && <SupportView />}
          {activeTab === 'messages' && <MessagesView />}
          {activeTab === 'users' && <UsersView />}
        </main>
      </div>

      <UserModal isOpen={isUserModalOpen} onClose={() => { setIsUserModalOpen(false); setEditingUser(null); }} onSave={handleSaveUser} initialData={editingUser} />
      <DeleteConfirmModal isOpen={deleteData.isOpen} userName={deleteData.user?.name} onClose={() => setDeleteData({isOpen: false, user: null})} onConfirm={confirmDeleteUser} />
      <CampaignModal isOpen={isCampaignModalOpen} onClose={() => setIsCampaignModalOpen(false)} onSave={handleCreateCampaign} />
      <ProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} onSave={handleCreateProject} />
      <ReportModal isOpen={reportModalData.isOpen} onClose={() => setReportModalData({ ...reportModalData, isOpen: false })} reportTitle={reportModalData.title} />
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #020617; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 5px; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
        .animate-fade-in { animation: fadeInUp 0.2s ease-out forwards; }
        .animate-scale-up { animation: scaleUp 0.3s ease-out forwards; }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spinSlow 10s linear infinite; }
      `}</style>
    </div>
  );
};

export default App;