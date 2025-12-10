const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col justify-center items-center gap-6">
          {/* Copyright Section */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © {currentYear} <span className="font-semibold text-slate-700">MPB Department</span>. 
              All rights reserved.
            </p>
          </div>
        </div>

        {/* Bottom Decorative Bar */}
        <div className="mt-8 h-1 w-full bg-gradient-to-r from-slate-100 via-slate-700 to-slate-100 rounded-full opacity-20"></div>
      </div>
    </footer>
  );
};

export default Footer;
