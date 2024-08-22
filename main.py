import json
import random
from datetime import datetime
from PIL import Image
from openai import OpenAI
from serpapi import GoogleSearch
import csv

OPEN_AI_KEY = "YOUR PASSWORD"
client = OpenAI(api_key=OPEN_AI_KEY)

# Your API key
SERP_API_KEY = "YOUR PASSWORD"


def generate_chat_call(user_message):
    system_message = "You are a helpful trip planner assistant."

    try:
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            seed=1824,
            temperature=1,
            max_tokens=1812,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )

        answer = response.choices[0].message.content
        print(answer)
        return answer
    except Exception as e:
        print(f"Failed to fetch or parse JSON data from the API: {e}")


def generate_image(description):
    if len(description) > 1000:
        description = description[:1000]
    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=description,
            style="vivid",
            size="1024x1024",
            quality="standard",
            n=1,
        )
        image_url = response.data[0].url
        print(image_url)
        return image_url
    except Exception as e:
        print(f"Failed to fetch or parse image from the API: {e}")


def airport_code(cityname, country):
    file_path = 'airports.dat'  # Path to your downloaded OpenFlights airports.dat file
    with (open(file_path, mode='r', encoding='utf-8') as infile):
        reader = csv.reader(infile)
        for row in reader:
            city_name = row[2].replace('-', ' ').lower()
            if cityname.lower() in city_name and country.lower() == row[3].lower() and len(row[4]) == 3:
                print(city_name, cityname, country.lower(), row[3].lower())
                return row[4]
    return None


def google_flights(arrival_id, outbound_date, return_date, budget):
    # Parameters for the search
    params = {
      "engine": "google_flights",
      "departure_id": "TLV",
      "arrival_id": arrival_id,
      "outbound_date": outbound_date,
      "return_date": return_date,
      "currency": "USD",
      "hl": "en",
      "api_key": SERP_API_KEY
    }

    # Perform the search
    search = GoogleSearch(params)
    results = search.get_dict()
    print(results)
    if results.get("error") is not None:
        closest_airports = json.loads(find_closest_cities(arrival_id))["closest_airports"]
        for airport in closest_airports:
            params = {
                "engine": "google_flights",
                "departure_id": "TLV",
                "arrival_id": airport,
                "outbound_date": outbound_date,
                "return_date": return_date,
                "currency": "USD",
                "hl": "en",
                "api_key": SERP_API_KEY
            }
            # Perform the search
            search = GoogleSearch(params)
            results = search.get_dict()
            print(results)
            if results.get("error") is None:
                arrival_id = airport
                break
        if results.get("error") is not None:
            return 0, 0, 0
    # extarcting the lowest price
    best_flights = results.get('best_flights', [])
    if best_flights is None:
        price = results['other_flights'][0]['price']
        last_flight = results['other_flights'][0]['flights'][-1]
        landing_date = last_flight['arrival_airport']['time']
        return arrival_id, price, landing_date
    prices = [flight.get('price') for flight in best_flights]
    lowest_price = prices[0]
    # extracting the landing date
    landing_dates = []
    for leg in best_flights[0].get('flights', []):
        landing_date = leg.get('arrival_airport', {}).get('time')
        if landing_date:
            landing_dates.append(landing_date)

    last_landing = landing_dates[-1].split(' ')[0]
    if lowest_price <= budget:
        return arrival_id, lowest_price, last_landing
    else:
        return f"it is not possible to plan a trip to {arrival_id} within the given budget and dates", 0, 0


def google_hotels(checkin_date, checkout_date, city, budget):
    date1 = datetime.strptime(checkin_date, '%Y-%m-%d')
    date2 = datetime.strptime(checkout_date, '%Y-%m-%d')

    # Calculate the difference between the dates
    difference = date2 - date1

    # Get the number of days
    number_of_days = difference.days
    print(number_of_days, budget)
    max_price = int(budget / number_of_days)
    params = {
        "engine": "google_hotels",
        "q": city,
        "check_in_date": checkin_date,
        "check_out_date": checkout_date,
        "adults": "1",
        "max_price": str(max_price),
        "currency": "USD",
        "gl": "us",
        "hl": "en",
        "api_key": SERP_API_KEY
    }

    search = GoogleSearch(params)
    results = search.get_dict()
    print(results)
    if results.get("error") is not None:
        return 0, 0
    hotels = results['properties']
    max_price = 0
    for hotel in hotels:
        if 'total_rate' in hotel.keys():
            hotel_price = hotel['total_rate']['lowest']
            price = int(hotel_price.replace('$', '').replace(',', ''))
            if price <= budget:
                if max_price < price:
                    max_price = price
                    hotel_name = hotel['name']
        else:
            max_price = -1
    if max_price == 0:
        return f"it is not possible to plan a trip in {city} within the given budget and dates", 0
    if max_price == -1:
        return "Please contact the hotel for price information", 0
    return hotel_name, max_price


def find_places(start_date, end_date, trip_type):
    user_massage = f"get 5 possible places in the world to travel to from Israel based on: \
                the month of the planned trip:  {start_date} - {end_date} and the type of trip:  {trip_type}\
                answer in Json: cities:[city1:country1 , city2:country2, city3:country3, city4:country4, city5:country5]\"" \
                   f"landing_city:[city1:country1 , city2:country2, city3:country3, city4:country4, city5:country5]\"" \
                   f"landing city contains the city where the passenger lands (in case there is no airport in the city)"
    return generate_chat_call(user_massage)


def find_daily_plan(start_date, end_date, trip_type, location):
    # Now you should make another request to openai chatgpt that will create a daily plan
    # for the trip in the chosen location (based of course on the month and start and end
    # date of the trip)
    # user_massage = f"make a DAILY plan for EACH DAY in my trip: \
    #                 the month of the planned trip:  {start_date} - {end_date}, the type of trip:  {trip_type}\
    #                 the location: {location}, \
    #                 answer in Json: Day1: daily trip for {start_date},.... DayEnd: daily trip for {end_date}."
    user_message = f"make a DAILY plan for EACH DAY in my trip to {location}: \
                        the type of trip:  {trip_type}, \
                        answer in Json: " \
                   f"Day1: Activities: daily trip for {start_date}...,.... DayEnd: Activities: daily trip for {end_date}." \
                   f"specify for each day only the activities WITHOUT any time scheduling. DO NOT SHOW start/end dates "

    return generate_chat_call(user_message)


def generate_images(start_date, end_date, trip_type, chosen_city):
    daily_trips = json.loads(find_daily_plan(start_date, end_date, trip_type, chosen_city))
    daily_arr = []
    activities = []
    images = []
    index = 1
    for day in daily_trips.values():
        print(day)
        activities.extend(day["Activities"])
        daily_arr.append((f"Day {index}", ", ".join(day["Activities"])))
        index += 1
    print(activities, " len: ", len(activities))
    indexes = random.sample(range(0, len(activities)), 4)
    for i in indexes:
        description = activities[i]
        print(description)
        images.append((generate_image(description),description))
    print("DailyArr: ", daily_arr)
    return images,daily_arr


def find_closest_cities(city):
    print(city)
    user_massage = f"return as JSON the airports code closest to {city} like this \
    closest_airports: [XYZ,...]"
    return generate_chat_call(user_massage)


def flight_hotel_handler(trip_type, budget, start_date, end_date):
    trips = []
    cities_dict = json.loads(find_places(start_date, end_date, trip_type))
    landing_cities = cities_dict["landing_city"]
    cities = cities_dict["cities"]
    for i in range(len(cities)):
        trip =[]
        city_flight = landing_cities[i].split(":")[0]
        country = landing_cities[i].split(":")[1]
        city_code = airport_code(city_flight,country)
        # extract the flight price and arrival date
        city_code, flight_price, arrival_day = google_flights(city_code, start_date, end_date, budget)
        print(city_code, flight_price, arrival_day)
        trip.append(city_code)
        trip.append(flight_price)
        if flight_price == 0:
            trip.append(None)
            trip.append(None)
            trip.append(None)
            trips.append(trip)
            continue
        city_hotel = cities[i].split(":")[0]
        # extract the hotel name and its price
        if budget-flight_price < 0:
            trip.append(None)
            trip.append(None)
            trip.append(None)
            trips.append(trip)
            continue
        hotel_name, hotel_price = google_hotels(arrival_day, end_date, city_hotel, budget-flight_price)
        if hotel_price == 0:
            trip.append(None)
            trip.append(hotel_name)
            trip.append(None)
            trips.append(trip)
            continue
        else:
            trip.append(city_hotel)
            trip.append(hotel_name)
            trip.append(hotel_price)
        trips.append(trip)
    return trips




