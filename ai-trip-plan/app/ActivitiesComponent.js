// Assuming you have a string array like this:
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";

const stringArray = ["Hello", "World", "from", "Next.js"];
// const data = {
//     "Day1": {
//         "Activities": [
//             "Explore the Old City of Jerusalem, visiting the Western Wall, the Church of the Holy Sepulchre, and the souks.",
//             "Lunch at a local restaurant in the Muslim Quarter.",
//             "Walk the ramparts of the city walls for a unique view.",
//             "Dinner at a modern Israeli restaurant in West Jerusalem."
//         ]
//     },
//     "Day2": {
//         "Activities": [
//             "Visit the Israel Museum to see the Dead Sea Scrolls and contemporary art collections.",
//             "Head to the Mahane Yehuda Market for lunch and sample local delicacies.",
//             "In the afternoon, tour Yad Vashem, the World Holocaust Remembrance Center.",
//             "Evening: experience a light and sound show at the Tower of David."
//         ]
//     },
//     "Day3": {
//         "Activities": [
//             "Day trip to the Dead Sea. Stop at Ein Gedi Nature Reserve for a hike and wildlife watching.",
//             "Relax and float in the Dead Sea, try out the therapeutic mud baths.",
//             "Visit the Masada fortress via cable car to explore this ancient site.",
//             "Return to Jerusalem for dinner."
//         ]
//     },
//     "Day4": {
//         "Activities": [
//             "Travel to Tel Aviv in the morning.",
//             "Explore the Bauhaus architecture of the White City on a guided walking tour.",
//             "Enjoy the beach in the afternoon - relax or try surfing.",
//             "Explore Tel Aviv’s vibrant culinary scene with dinner at a renowned seafood restaurant."
//         ]
//     },
//     "Day5": {
//         "Activities": [
//             "Visit the Tel Aviv Museum of Art in the morning.",
//             "Stroll through the historic neighborhood of Neve Tzedek.",
//             "Lunch at the Carmel Market, tasting different street foods.",
//             "Afternoon at Jaffa, exploring the old port and the flea market.",
//             "Dinner at a restaurant in Jaffa overlooking the Mediterranean Sea."
//         ]
//     },
//     "DayEnd": {
//         "Activities": [
//             "Morning free time for last-minute shopping or visiting any place missed earlier in Tel Aviv.",
//             "Enjoy a relaxing meal at a beachfront café before departure."
//         ]
//     }
// }

const ActivitiesComponent = ({dailyTrips}) => {
    return (
    <Table
        isStriped
        color={"primary"}
        aria-label="Example table with static content">
        <TableHeader
            color="primary">
            <TableColumn>Day</TableColumn>
            <TableColumn>Activities</TableColumn>
        </TableHeader>
        <TableBody>
            {Object.entries(dailyTrips).map(([day, details]) => (
                <TableRow key={day} >
                    <TableCell key={day}>{day}</TableCell>
                    <TableCell key={day}>{details.Activities}</TableCell>
                </TableRow>
            ))}

        </TableBody>
    </Table>
    );
}


export default ActivitiesComponent;