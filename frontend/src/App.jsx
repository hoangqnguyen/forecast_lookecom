import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    category: "Jeans",
    traffic_source: "Search",
    day_of_week: 1,
    current_cost: 30,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Chỉ update trường đang sửa
    });
  };

  const handleOptimize = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/optimize-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        alert("Lỗi backend: " + response.statusText);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không kết nối được server! Bạn đã chạy server chưa?");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-blue-500 tracking-tight">
            Pricing and Demand Forecaster
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <CodeFormInput
            data={formData}
            onChange={handleChange}
            onSubmit={handleOptimize}
            loading={loading}
          />
          {/* Kết quả */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border-slate-100">
            {displayResult(loading, result)}
          </div>
        </div>
      </div>
    </div>
  );
}

const displayResult = (loading, result) => {
  return (
    <div className="h-full">
      <div className="text-xl font-bold text-slate-800 mb-6">Kết quả phân tích</div>
      {loading ? (
        <div>Đang tính toán</div>
      ) : result ? (
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-2xl border border-green-200 text-center">
            <p className="text-sm font-bold text-green-600 uppercase tracking-widest">Giá đề xuất</p>
            <p className="text-5xl font-black text-green-800 mt-2">${result.suggested_price.toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase">Doanh số dự báo</p>
              <p className="text-xl font-bold text-slate-700 mt-1">{result.predicted_sales.toFixed(2)}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="text-xs font-bold text-blue-400 uppercase">Lợi nhuận dự kiến</p>
              <p className="text-xl font-bold text-blue-700 mt-1">${result.estimated_profit.toFixed(2)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-slate-200 rounded-xl">Hãy nhập liệu và click nút Tối ưu nhé!</div>
      )}
    </div>
  );
};

function CodeFormInput({ data, onChange, onSubmit, loading }) {
  const inputClass =
    "w-full p-3 mb-4 border border-slate-200 rounded-xl focus:ring-2 focus:border-green-400 outline-none transition-all bg-slate-50 hover:bg-white";
  const labelClass =
    "block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide";

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
      <div className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">
        <h2>Nhập thông tin</h2>
      </div>

      <div>
        <label className={labelClass}>Loại sản phẩm</label>
        <select
          name="category"
          value={data.category}
          onChange={onChange}
          className={inputClass}
        >
          <option value="Accessories">Accessories</option>
          <option value="Active">Active</option>
          <option value="Blazers & Jackets">Blazers & Jackets</option>
          <option value="Clothing Sets">Clothing Sets</option>
          <option value="Dresses">Dresses</option>
          <option value="Fashion Hoodies & Sweatshirts">
            Fashion Hoodies & Sweatshirts
          </option>
          <option value="Intimates">Intimates</option>
          <option value="Jeans">Jeans</option>
          <option value="Jumpsuits & Rompers">Jumpsuits & Rompers</option>
          <option value="Leggings">Leggings</option>
          <option value="Maternity">Maternity</option>
          <option value="Outerwear & Coats">Outerwear & Coats</option>
          <option value="Pants">Pants</option>
          <option value="Pants & Capris">Pants & Capris</option>
          <option value="Plus">Plus</option>
          <option value="Shorts">Shorts</option>
          <option value="Skirts">Skirts</option>
          <option value="Sleep & Lounge">Sleep & Lounge</option>
          <option value="Socks">Socks</option>
          <option value="Socks & Hosiery">Socks & Hosiery</option>
          <option value="Suits">Suits</option>
          <option value="Suits & Sport Coats">Suits & Sport Coats</option>
          <option value="Sweaters">Sweaters</option>
          <option value="Swim">Swim</option>
          <option value="Tops & Tees">Tops & Tees</option>
          <option value="Underwear">Underwear</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Traffic source</label>
        <select
          name="traffic_source"
          value={data.traffic_source}
          onChange={onChange}
          className={inputClass}
        >
          <option value="Display">Display Ads</option>
          <option value="Facebook">Facebook</option>
          <option value="Email">Email Marketing</option>
          <option value="Organic">Organic</option>
          <option value="Search">Search</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Ngày trong tuần</label>
        <select
          name="day_of_week"
          value={data.day_of_week}
          onChange={onChange}
          className={inputClass}
        >
          <option value="0">Chủ Nhật</option>
          <option value="1">Thứ 2</option>
          <option value="2">Thứ 3</option>
          <option value="3">Thứ 4</option>
          <option value="4">Thứ 5</option>
          <option value="5">Thứ 6</option>
          <option value="6">Thứ 7</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Giá vốn</label>
        <input
          name="current_cost"
          type="number"
          value={data.current_cost}
          onChange={onChange}
          className={inputClass}
        />
      </div>

      <button
        onClick={onSubmit}
        className={`w-full mt-4 py-3 text-white rounded-xl font-white shadow-lg border transition-transform active:scale-95 ${loading
          ? "bg-slate-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-1"
          }`}
      >
        {loading ? "... đang tính ...." : "Tối ưu ngay!"}
      </button>
    </div>
  );
}

export default App;
