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
        console.log(data);
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
    <div className="">
      <div className="">
        <div className="">
          <h1 className="">Pricing and Demand Forecaster</h1>
        </div>

        <div>
          <CodeFormInput
            data={formData}
            onChange={handleChange}
            onSubmit={handleOptimize}
            loading={loading}
          />
        </div>

        {/* Kết quả */}
        <div>
          <div>Kết quả phân tích</div>
          {loading ? (
            <div>Đang tính toán</div>
          ) : result ? (
            <div>
              <div>
                <p>Giá đề xuất: {result.suggested_price.toFixed(2)}</p>
              </div>
              <div>
                <p>Doanh số dự báo: {result.predicted_sales.toFixed(2)}</p>
              </div>
              <div>
                <p>Lợi nhuận dự kiến: {result.estimated_profit.toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <div>Đợi tí</div>
          )}
        </div>
      </div>
    </div>
  );
}

function CodeFormInput({ data, onChange, onSubmit, loading }) {
  return (
    <div>
      <div>
        <h2>Nhập thông tin</h2>
      </div>

      <div>
        <label>Loại sản phẩm</label>
        <select name="category" value={data.category} onChange={onChange}>
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
        <label>Traffic source</label>
        <select
          name="traffic_source"
          value={data.traffic_source}
          onChange={onChange}
        >
          <option value="Display">Display Ads</option>
          <option value="Facebook">Facebook</option>
          <option value="Email">Email Marketing</option>
          <option value="Organic">Organic</option>
          <option value="Search">Search</option>
        </select>
      </div>

      <div>
        <label>Ngày trong tuần</label>
        <select name="day_of_week" value={data.day_of_week} onChange={onChange}>
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
        <label>Giá vốn</label>
        <input
          name="current_cost"
          type="number"
          value={data.current_cost}
          onChange={onChange}
        />
      </div>

      <button onClick={onSubmit}>
        {loading ? "... đang tính ...." : "Tối ưu ngay!"}
      </button>
    </div>
  );
}

export default App;
