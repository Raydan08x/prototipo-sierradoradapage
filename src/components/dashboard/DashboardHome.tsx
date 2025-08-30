import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const DashboardHome = ({ modules }) => {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module, index) => (
          <motion.button
            key={module.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(module.path)}
            className="bg-[#E5E1E6] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-[#B3A269] rounded-lg mb-4">
              <module.icon className="h-6 w-6 text-[#222223]" />
            </div>
            <h3 className="text-lg font-medium text-[#222223]">{module.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{module.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;