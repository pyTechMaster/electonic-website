# 🚗 Road Accident Prediction System

> AI-powered accident risk prediction for safer roads 🛡️

## 🌟 What This Does

This system predicts road accident risks using advanced AI models trained on real UK government data. Simply provide GPS coordinates and get instant risk assessments!

## 🚀 Quick Start

### 1️⃣ Clone the Project
```bash
git clone <your-repository-url>
cd ACCIDENT-PREDICTION
```

### 2️⃣ Install Dependencies
```bash
pip install -r requirements.txt
```

### 3️⃣ Run the Application
```bash
python app.py
```

🎉 **That's it!** Your app will be running at `http://localhost:5000`

## 📁 Project Structure

```
ACCIDENT-PREDICTION/
├── 🗂️ app/
│   ├── 🐍 __init__.py          # App initialization
│   ├── 🌐 api.py               # API endpoints
│   ├── 🔄 fallback.py          # Backup predictions
│   ├── 🔮 predictor.py         # Main prediction logic
│   └── 🛠️ utils.py             # Helper functions
├── 🤖 models/
│   ├── 📊 best_accident_model.pkl  # Trained AI model
│   ├── 📝 feature_names.pkl        # Feature list
│   ├── ⚖️ feature_scaler.pkl       # Data scaler
│   └── ℹ️ model_info.json         # Model metadata
├── 🎨 static/
│   ├── 📄 css/style.css           # Website styling
│   ├── 🖼️ images/                 # Images & icons
│   └── 📜 js/scripts.js           # Frontend logic
├── 📋 templates/
│   ├── 🏠 index.html              # Homepage
│   ├── 🔍 predict.html            # Prediction page
│   └── 📊 results.html            # Results display
├── ⚙️ app.py                      # Main application
├── 🔧 config.py                   # Configuration
└── 📖 Readme.md                   # This file
```

## 🔧 Configuration

### Environment Setup
Create a `.env` file (optional):
```env
FLASK_ENV=development
DEBUG=True
PORT=5000
```

### Model Files
Ensure these files exist in `/models/`:
- ✅ `best_accident_model.pkl` - Main AI model
- ✅ `feature_scaler.pkl` - Data preprocessor  
- ✅ `feature_names.pkl` - Feature definitions

## 🌐 API Endpoints

### 🎯 Single Prediction
```http
POST /api/predict
Content-Type: application/json

{
  "latitude": 51.5074,
  "longitude": -0.1278
}
```

### 📦 Batch Predictions
```http
POST /api/batch_predict
Content-Type: application/json

{
  "locations": [
    {"lat": 51.5074, "lon": -0.1278},
    {"lat": 52.5200, "lon": 13.4050}
  ]
}
```

### ❤️ Health Check
```http
GET /api/health
```

## 🎨 Using the Web Interface

1. 🌍 **Homepage**: `http://localhost:5000`
2. 📍 **Enter Location**: Use the map or input coordinates
3. 🔮 **Get Prediction**: Click "Predict Risk"
4. 📊 **View Results**: See risk level and confidence

## 🛠️ Development

### Running in Development Mode
```bash
export FLASK_ENV=development
python app.py
```

### Testing the API
```bash
# Test single prediction
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"latitude": 51.5074, "longitude": -0.1278}'

# Check health
curl http://localhost:5000/api/health
```

## 📊 Model Information

- 🎯 **Accuracy**: ~75-85% on test data
- 🤖 **Algorithm**: Ensemble of XGBoost, LightGBM, CatBoost
- 📈 **Training Data**: 130,000+ UK accident records
- 🏷️ **Output**: 3 risk levels (Low, Medium, High)

## 🚨 Risk Levels

| Level | 🎨 Color | Description |
|-------|----------|-------------|
| 🟢 Low | Green | Relatively safe area |
| 🟡 Medium | Yellow | Moderate risk, stay alert |
| 🔴 High | Red | High risk, extra caution needed |

## 🔧 Troubleshooting

### Common Issues

**❌ Model files not found**
```bash
# Check if model files exist
ls -la models/
```

**❌ Import errors**
```bash
# Reinstall requirements
pip install --upgrade -r requirements.txt
```

**❌ Port already in use**
```bash
# Change port in config.py or:
export PORT=8000
python app.py
```

**❌ Low prediction accuracy**
- ✅ This is normal for real-world predictions
- ✅ Focus on high-confidence predictions
- ✅ Use multiple predictions for better insights

## 📦 Dependencies

Key packages in `requirements.txt`:
- 🌐 `flask` - Web framework
- 🤖 `scikit-learn` - Machine learning
- 📊 `pandas` - Data handling
- 🚀 `xgboost` - Advanced ML algorithm
- 💡 `lightgbm` - Microsoft's ML tool
- 🐱 `catboost` - Yandex's ML algorithm

## 🌟 Features

- ✅ **Real-time Predictions** - Instant risk assessment
- ✅ **Web Interface** - User-friendly website
- ✅ **REST API** - Easy integration
- ✅ **Batch Processing** - Multiple locations at once
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **High Accuracy** - Advanced AI models

## 🔮 Future Enhancements

- 🌤️ Real-time weather integration
- 🚦 Live traffic data
- 📱 Mobile app version
- 🌍 Multi-country support
- 📈 Continuous model updates

## 📞 Support

For issues or questions:
1. 📖 Check this README
2. 🔍 Review the documentation
3. 🧪 Test with the provided examples
4. 🛠️ Check logs for error messages

## 📄 License

This project is proprietary software developed for accident prediction purposes.

---

🎉 **Ready to predict accidents with AI!** 🚗💨

*Last Updated: January 2025*