// Use this directive to mark the component as a client-side component
"use client";
import Image from "next/image";
import styles from "./page.module.css";
import {useEffect, useState} from "react";
// import from nextUI
import {Button, Input, Spacer} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@nextui-org/table";
import "./globals.css";
import { NextUIProvider } from '@nextui-org/react';

export default function Home() {
  const [productName, setProductName] = useState('');
  // data contains the results st.of the api call
  // the structure: [[site, item_url, price], [site, item_url, price], [site, item_url, price]]
  const [data, setData] = useState([["","",""], ["", "", ""], ["", "",""]]);

  const apiCaller = async () => {
    const response = await fetch(`http://localhost:8000/item?item=${productName}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    //console.log(response);
    const response_json = await response.json();
    setData(response_json.results);
    console.log(response_json.results);
  };


  // for logs
  useEffect(() => {
    //apiCaller(); // Fetch data on component mount
    console.log("data: ", data); // Log data to see the structure after fetching


  }, [data]);

  return (
      <main className={styles.main}>
        <div className={styles.description}>
        </div>
        <div className={styles.center}>
          <Image
              className={styles.logo}
              src="/logo_no_background.png"
              alt="webLogo"
              width={200}
              height={90}
              priority
          />
        </div>
        <div className={styles.grid}>
          <h2>
            ENTER THE PRODUCT'S NAME <span>-&gt;</span>
          </h2>
          <Input
              bordered
              placeholder={"Product Name"}
              labelPlaceholder="Secondary"
              color="secondary"
              value={productName}
              onChange={e => {setProductName(e.target.value)}}
          />
          <Button color="secondary" variant="ghost" onClick={apiCaller}>
            Search
          </Button>
        </div>
        <NextUIProvider>
          <div className="container1">
            <div className="w-screen h-screen p-8 m-8 flex items-start justify-center">
                <Table isStriped aria-label="Example static collection table">
                    <TableHeader>
                      <TableColumn>Site</TableColumn>
                      <TableColumn>Item Title Name</TableColumn>
                      <TableColumn>Price (USD)</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow key="1">
                        <TableCell>{data[0][0]}</TableCell>
                        <TableCell>{data[0][1]}</TableCell>
                        <TableCell>{data[0][2]}</TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell>{data[1][0]}</TableCell>
                        <TableCell>{data[1][1]}</TableCell>
                        <TableCell>{data[1][2]}</TableCell>
                      </TableRow>
                      <TableRow key="3">
                        <TableCell>{data[2][0]}</TableCell>
                        <TableCell>{data[2][1]}</TableCell>
                        <TableCell>{data[2][2]}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
            </div>
          </div>
        </NextUIProvider>
      </main>
  );
}
