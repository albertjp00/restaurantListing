import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // await logoutUser()
      localStorage.removeItem('userToken');
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md">
      {/* Logo */}
      <div 
        className="text-2xl font-bold text-blue-600 cursor-pointer"
        onClick={() => navigate('/')}
      >
        Restaurant Listing
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        <p 
          onClick={() => navigate('/addRestaurant')}
          className="text-gray-600 hover:text-blue-500 font-medium cursor-pointer transition-colors"
        >
          Add Restaurant
        </p>
        
        <button 
          onClick={logout} 
          className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;