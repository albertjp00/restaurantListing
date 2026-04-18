import  { useState } from "react";
import Navbar from "../navbar/navbar";
import { addRestaurant } from "../../services/services";
import { useNavigate } from "react-router-dom";
import type { Restaurant } from "../../interfaces/interface";



const AddRestaurant = () => {
  const [formData, setFormData] = useState<Restaurant>({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const [submittedData, setSubmittedData] = useState<Restaurant | null>(null);

  const [errors, setErrors] = useState<Partial<Restaurant>>({});

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const validate = () => {
  const  newErrors: Partial<Restaurant> = {};

  if (!formData.name.trim()) {
    newErrors.name = "Restaurant name is required";
  }

  if (!formData.address.trim()) {
    newErrors.address = "Address is required";
  }

  if (!formData.phone.trim()) {
    newErrors.phone = "Phone number is required";
  } else if (!/^[0-9+\-\s]{7,15}$/.test(formData.phone)) {
    newErrors.phone = "Invalid phone number";
  }

  if (!formData.email.trim()) {
  newErrors.email = "Email is required";
} else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
  newErrors.email = "Invalid email address";
}

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return; 


    const res = await addRestaurant(formData);

    if (res.data.success) {
      setSubmittedData(formData); // optional (store submitted data)
      setFormData({ name: "", address: "", phone: "", email: "" }); // ✅ correct reset
      navigate("/home");
    }
  };

  const inputClass = "w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all";
  const labelClass = "text-sm font-semibold text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Register New Restaurant</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClass}>Restaurant Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. The Golden Spoon"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className={labelClass}>Address</label>
              <textarea
                name="address"
                rows={3}
                placeholder="Full street address..."
                value={formData.address}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 234..."
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="manager@rest.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 active:transform active:scale-[0.99]"
            >
              Add Restaurant
            </button>
          </form>
        </div>

        {/* Success Card */}
        {submittedData && (
          <div className="mt-8 bg-green-50 border border-green-200 p-6 rounded-xl animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <h3 className="text-green-800 font-bold">Successfully Added!</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><span className="text-green-600 block text-xs font-bold uppercase">Name</span> {submittedData.name}</p>
              <p><span className="text-green-600 block text-xs font-bold uppercase">Phone</span> {submittedData.phone}</p>
              <p className="col-span-2"><span className="text-green-600 block text-xs font-bold uppercase">Address</span> {submittedData.address}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddRestaurant;