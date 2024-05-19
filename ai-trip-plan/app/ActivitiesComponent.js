// Assuming you have a string array like this:
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";


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
            {dailyTrips.map(([day, details]) => (
                <TableRow key={day} >
                    <TableCell key={day}>{day}</TableCell>
                    <TableCell key={day}>{details}</TableCell>
                </TableRow>
            ))}

        </TableBody>
    </Table>
    );
}

export default ActivitiesComponent;