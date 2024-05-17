from fastapi import FastAPI
import main
from fastapi.middleware.cors import CORSMiddleware

# define app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)



# the root
@app.get("/")
def root():
    return {"No product was received"}


@app.post("/trip")
def create_item(trip_type: str, budget: int, start_date: str, end_date: str):
    trips = main.flight_hotel_handler(trip_type, budget, start_date, end_date)
    return {'results': trips}

@app.post("/dailytrip")
def create_dailytrip(trip_type: str, city: str, start_date: str, end_date: str):
    images, dailytrips = main.generate_images(trip_type, city, start_date, end_date)
    return {'results': images, 'dailytrips': dailytrips}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)