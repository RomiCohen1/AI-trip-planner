// Use this directive to mark the component as a client-side component
"use client";
import Image from "next/image";
import styles from "./page.module.css";
import {useEffect, useState} from "react";
import {parseDate, getLocalTimeZone} from "@internationalized/date";

// import from nextUI
import {Button,Select,SelectItem, DateRangePicker, Input, Spacer} from "@nextui-org/react";
import TableComponent from "./TableComponent.js";
import "./globals.css";
import {parseISO} from "date-fns";
import ActivitiesComponent from "./ActivitiesComponent";
import GalleryComponent from "./GalleryComponent";
import LoadingComponent from "./LoadingComponent";


export default function Home() {
  const [budget, setBudget] = useState('');
  const [tripType, setTripType] = useState("");
  // Get the current date
const currentDate = new Date();
// Format the date as a string
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
const day = String(currentDate.getDate()).padStart(2, '0');
// Combine into a date string
const dateString = `${year}-${month}-${day}`;
  const [dateTrip, setDateTrip] = useState({
    start: parseDate(dateString),
    end: parseDate(dateString),
  });
  const [showTable, setShowTable] = useState(false)
  // data contains the results of the api call
  const [data, setData] = useState([["Tel Aviv", "TLV", 530, "Herodes", 450], ["Tel Aviv", "TLV", 530, "Herodes", 450]]);
  const [imageObject, setImageObject] = useState([]);
  const [dailyTrips, setDailyTrips] = useState([]);
  const [showActivities, setShowActivities] = useState(false);
  const [showLoading, setShowLoading] = useState(false);


  const apiCaller = async () => {
    const response = await fetch(`http://localhost:8000/trip?trip_type=${tripType.currentKey}&budget=${budget}&start_date=${dateTrip.start}&end_date=${dateTrip.end}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    //console.log(response);
    const response_json = await response.json();
    //close loading gif
    setShowLoading(false);
    setData(response_json.results);
    console.log(response_json.results);
    setShowTable(true);
  };

  const apiCallDailyPlan = async (city) => {
    setShowTable(false);
    setShowLoading(true);
    const response = await fetch(`http://localhost:8000/dailytrip?trip_type=${tripType.currentKey}&city=${city}&start_date=${dateTrip.start}&end_date=${dateTrip.end}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    const response_json = await response.json();
    // close show gif
    setShowLoading(false);
    setImageObject(response_json.results);
    setDailyTrips(response_json.dailytrips);
    setShowActivities(true);
  };

  const handleSearchClick = () => {
    if(!dateTrip || !tripType){
      alert("NO PARAMETERS WHERE GIVEN")
    }
    else{
      setShowLoading(true);
       // setShowTable(true);
      apiCaller()
    }
  };

  // for logs
  useEffect(() => {
    console.log("data: ", data); // Log data to see the structure after fetching


  }, [data]);

  const handleDateChange = (range) => {
    setDateRange(range);


  };

  useEffect(() => {
    //apiCaller(); // Fetch data on component mount
    console.log("dailyTrips:", dailyTrips, imageObject);
    console.log("daily type: ", typeof dailyTrips);
  }, [dateTrip, imageObject]);

  useEffect(() => {
    //apiCaller(); // Fetch data on component mount
    console.log("dates:", dateTrip.start, dateTrip.end);
  }, [dateTrip]);

  useEffect(() => {
    //apiCaller(); // Fetch data on component mount
    console.log("types:", tripType, tripType.currentKey);
  }, [tripType]);

  const handleSelectionChange = (e) => {
    // Assuming single selection, extract the first key
     setTripType(e.target.value);
  };

  return (
      <main className={styles.main}>
        <div className={styles.center}>
          <Image
              className={styles.logo}
              src="/trip_logo_new.png"
              alt="webLogo"
              width={300}
              height={300}
              priority
          />
        </div>


        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>
              Enter your budget(USD) <span>-&gt;</span>
            </h2>
            <Input
                bordered
                placeholder={"budget(USD)"}
                labelPlaceholder="Secondary"
                color="primary"
                size={"lg"}
                value={budget}
                onChange={e => {setBudget(e.target.value)}}
            />
          </div>
          <div className={styles.card}>
            <h2>
              Select trip type <span>-&gt;</span>
            </h2>
            <Select
                isRequired
                label="type of trip"
                selectedKeys={tripType}
                className="max-w-xs"
                color={"primary"}
                onSelectionChange={setTripType}
            >
              <SelectItem
                  key="ski"
                  value="ski"
              >
                ski
              </SelectItem>
              <SelectItem
                  key="city"
                  value="city"
              >
                city
              </SelectItem>
              <SelectItem
                  key="beach"
                  value="beach"
              >
                beach
              </SelectItem>
            </Select>
          </div>
          <div className={styles.card}>
            <h2>
              Select dates <span>-&gt;</span>
            </h2>
            <div>
              <DateRangePicker
                  label="Date Range"
                  value={dateTrip}
                  onChange={setDateTrip}
                  color={"primary"}
               />
            </div>
          </div>
          <div className={styles.grid}>
            <Button color="primary" variant="ghost" onClick={handleSearchClick}>
              Search
            </Button>
          </div>
        </div>
        {showLoading && <LoadingComponent/>}
        {showTable && <TableComponent data={data} onRowClick={apiCallDailyPlan} />}
        {showActivities && <GalleryComponent imageComp={imageObject}/>}
        {showActivities && <ActivitiesComponent dailyTrips={dailyTrips} />}
      </main>
  );
}
