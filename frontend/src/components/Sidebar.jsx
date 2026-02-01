import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiBriefcase, FiMail, FiX } from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/contacts', icon: FiUsers, label: 'Contacts' },
    { to: '/deals', icon: FiBriefcase, label: 'Deals' },
    { to: '/emails', icon: FiMail, label: 'Email Center' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <h2 className="text-xl font-bold text-primary">Menu</h2>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
