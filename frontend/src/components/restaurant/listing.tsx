import  { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import {
  deleteRestaurant,
  editRestaurant,
  fetchRestaurants,
} from "../../services/services";
import { toast } from "react-toastify";

interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

const Listing = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [errors, setErrors] = useState<Partial<Restaurant>>({});

  const [originalRestaurant, setOriginalRestaurant] =
    useState<Restaurant | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const isChanged =
    JSON.stringify(selectedRestaurant) !== JSON.stringify(originalRestaurant);

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const res = await fetchRestaurants(page, debouncedSearch);

        if (res.data.success) {
          setRestaurants(res.data.restaurants);
          setTotalPages(res.data.totalPages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getRestaurants();
  }, [page, debouncedSearch]);

  const validate = () => {
    if (!selectedRestaurant) return false;

    const newErrors: Partial<Restaurant> = {};

    if (!selectedRestaurant.name.trim()) {
      newErrors.name = "Restaurant name is required";
    }

    if (!selectedRestaurant.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!selectedRestaurant.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s]{7,15}$/.test(selectedRestaurant.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!selectedRestaurant.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(selectedRestaurant.email)) {
      newErrors.email = "Invalid email address";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const updateRestaurant = async (data: Restaurant) => {
    try {
      if (!validate()) return;
      const res = await editRestaurant(data);

      if (res?.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res?.data.message);
      }

      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRestaurant = async (id: string) => {
    try {
      const res = await deleteRestaurant(id);

      if (res.data.success) {
        toast.success(res.data.message);

        const updated = await fetchRestaurants(page, debouncedSearch);
        setRestaurants(updated.data.restaurants);
        setTotalPages(updated.data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">
            Restaurant Directory
          </h2>
        </div>

        <div className="relative mb-8 w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white shadow-sm"
          />
        </div>

        {restaurants.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              No restaurants available in your list.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((res) => (
              <div
                key={res.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-3 pr-8">
                  {res.name}
                </h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold text-gray-400 uppercase text-xs block">
                      Address
                    </span>{" "}
                    {res.address}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-400 uppercase text-xs block">
                      Phone
                    </span>{" "}
                    {res.phone}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-400 uppercase text-xs block">
                      Email
                    </span>{" "}
                    {res.email}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedRestaurant(res);
                    setOriginalRestaurant(res);
                    setErrors({});
                    setIsModalOpen(true);
                  }}
                  className="absolute top-3 right-3 text-blue-600 text-sm font-semibold hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => setDeleteId(res.id)}
                  className="absolute bottom-3 right-3 text-red-600 text-sm font-semibold hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-1 font-semibold">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || totalPages == 0}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {isModalOpen && selectedRestaurant && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Restaurant</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();

                try {
                  const res = await updateRestaurant(selectedRestaurant);

                  if (res?.data.success) {
                    setRestaurants((prev) =>
                      prev.map((r) =>
                        r.id === selectedRestaurant.id ? selectedRestaurant : r,
                      ),
                    );

                    setIsModalOpen(false);
                  }
                } catch (err) {
                  console.log(err);
                }
              }}
              className="space-y-4"
            >
              <input
                type="text"
                value={selectedRestaurant.name}
                onChange={(e) =>
                  setSelectedRestaurant({
                    ...selectedRestaurant,
                    name: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
                placeholder="Name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}

              <textarea
                value={selectedRestaurant.address}
                onChange={(e) =>
                  setSelectedRestaurant({
                    ...selectedRestaurant,
                    address: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />
              {errors.address && (
                <p className="text-red-500 text-xs">{errors.address}</p>
              )}

              <input
                type="text"
                value={selectedRestaurant.phone}
                onChange={(e) =>
                  setSelectedRestaurant({
                    ...selectedRestaurant,
                    phone: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}

              <input
                type="email"
                value={selectedRestaurant.email}
                onChange={(e) =>
                  setSelectedRestaurant({
                    ...selectedRestaurant,
                    email: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!isChanged}
                  className={`px-4 py-2 rounded text-white ${
                    isChanged ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this restaurant?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await handleDeleteRestaurant(deleteId);
                  setDeleteId(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Listing;
