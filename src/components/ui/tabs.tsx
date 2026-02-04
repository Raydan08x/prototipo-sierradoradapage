import React from 'react';

export const Tabs = ({ defaultValue, children, className = '' }: any) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return (
    <div className={`space-y-4 ${className}`}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, { activeTab, setActiveTab } as any);
      })}
    </div>
  );
};

export const TabsList = ({ children, activeTab, setActiveTab }: any) => {
  return (
    <div className="flex space-x-2 border-b border-[#B3A269]/20">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, { activeTab, setActiveTab } as any);
      })}
    </div>
  );
};

export const TabsTrigger = ({ value, children, activeTab, setActiveTab }: any) => {
  return (
    <button
      className={`px-4 py-2 text-sm font-medium transition-colors
        ${activeTab === value
          ? 'text-[#B3A269] border-b-2 border-[#B3A269]'
          : 'text-[#E5E1E6] hover:text-[#B3A269]'
        }`}
      onClick={() => setActiveTab && setActiveTab(value)}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, activeTab }: any) => {
  if (value !== activeTab) return null;
  return <div className="py-4">{children}</div>;
};