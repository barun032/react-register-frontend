const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-blue-900 border-t-4 border-green-600 mt-auto text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <p className="text-sm font-medium">
            © {currentYear} Department of Information & Cultural Affairs, <span className="font-bold text-blue-200">Govt. of West Bengal</span>.
          </p>
          <p className="text-[10px] text-blue-300 mt-1 uppercase tracking-wider">
            Designed for Official Use Only • MPB Section
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;