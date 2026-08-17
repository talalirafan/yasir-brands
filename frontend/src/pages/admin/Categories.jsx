export default function AdminCategories() {
  const categories = ['For Boys', 'For Girls'];
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <button className="bg-black text-white px-4 py-2 rounded text-sm">+ Add Category</button>
      </div>
      <div className="space-y-2">
        {categories.map((c) => (
          <div key={c} className="border rounded p-3 flex justify-between items-center">
            <span>{c}</span>
            <div className="space-x-2">
              <button className="text-sm underline">Edit</button>
              <button className="text-sm text-red-500 underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
