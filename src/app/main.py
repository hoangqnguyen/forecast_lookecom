import os
from scipy.optimize import minimize
from pydantic import BaseModel
from app import logic, ModelConfig
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

# Configure root logger so INFO logs are emitted (useful for uvicorn/tests)
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s:%(name)s: %(message)s', force=True)


# Một số biến global sẽ dùng lại nhiều lần
model, le_category, le_source = None, None, None
CONFIG = ModelConfig(
    model_path="models/best_model.json",
    le_source_path="models/source_encoder.pkl",
    le_category_path="models/category_encoder.pkl",
)

# Khi app chạy, đầu tiên chúng ta load model trước 
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        global model, le_category, le_source
        model, le_category, le_source = logic.load_model(CONFIG)
    except Exception as e:
        logging.error(f"Không load được model: {str(e)}")
    finally:
        yield

# Khởi tạo FastAPI
app = FastAPI(title="Demand & Price API", description="API để dự đoán nhu cầu và định giá sản phẩm", lifespan=lifespan)

# Định nghĩa cấu trúc request bằng BaseModel để dữ liệu đầu vào chuẩn type
class OptimizationRequest(BaseModel):
    category: str # Phân loại SP
    traffic_source: str # Nguồn Traffic
    day_of_week: int # Ngày bán trong tuần 
    current_cost: float # Chi phí sx 1 sản phẩm
    min_margin: float = 1.1 # Lợi nhuận biên tối thiểu ~ 10% chi phí 
    max_margin: float = 4.0 # Lợi nhuận biên tối đa ~ 3x chi phí 

class OptimizationReponse(BaseModel):
    status: str
    suggested_price: float
    predicted_sales: float
    estimated_profit: float
    profit_margin: float

@app.get("/")
def home():
    return {"message": "It's working."}

@app.post("/optimize-price", response_model=OptimizationReponse)
def optimize_price(request: OptimizationRequest):
    """
    Input: Loại sản phẩm, Traffic Source, Giá vón.
    Output: Giá bán để tổng lợi nhuận cao nhất
    """
    # Mã hoá giá trị string thành int để model chạy inference
    try:
        category_id = le_category.transform([request.category])[0]  
        source_id = le_source.transform([request.traffic_source])[0]

        # Xác định khoảng giá để tìm kiếm giá tối ưu
        init_price = [request.current_cost * request.min_margin]
        bounds = [(request.current_cost + 0.1, request.current_cost * request.max_margin)]

        # Chạy tối ưu

        ## Viết hàm mục tiêu trước: tối ưu dựa trên tổng lợi nhuận ở một mức giá cụ thể
        def objective_fn(price_array):
            return -logic.predict_profit(model, price_array[0], category_id, source_id, request.current_cost, request.day_of_week)[0] # Scipy tối ưu bằng min nên cần đổi dấu
        
        ## Chạy thuật toán tối ưu của scipy
        result = minimize(objective_fn, init_price, bounds=bounds, method='SLSQP')

        # Xử ký kết quả
        if result.success:
            best_price = result.x[0]
            best_profit, best_demand = logic.predict_profit(model, best_price, category_id, source_id,  request.current_cost, request.day_of_week)

            # Gửi kết quả
            return dict(
                status="success",
                suggested_price=best_price,
                predicted_sales=best_demand,
                estimated_profit=best_profit,
                profit_margin=best_profit / (best_price * best_demand) if best_demand > 0 else 0
            )
        else:
            return dict(
                status="failed",
                message="Thuật toán không tìm được gía tối ưu."
            )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Thêm middleware để frontend và backend nói chuyện với nhau
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong thực tế nên để domain cụ thể, demo để * cho tiện
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)