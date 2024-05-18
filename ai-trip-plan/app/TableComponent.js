// components/TableComponent.js
import { Table,TableColumn, TableHeader, TableBody, TableCell, TableRow} from '@nextui-org/react';


const TableComponent = ({data, onRowClick}) => {
    return (
        <Table
            isStriped
            color={"primary"}
            aria-label="Example table with static content">
            <TableHeader
            color="primary">
                <TableColumn>City</TableColumn>
                <TableColumn>Airport Code</TableColumn>
                <TableColumn>Flight Price</TableColumn>
                <TableColumn>Hotel Name</TableColumn>
                <TableColumn>Hotel Price</TableColumn>
            </TableHeader>
            <TableBody>
                {data.map((item, index) => (
                    <TableRow key={index} onClick={()=>onRowClick(item[0])}>
                        <TableCell>{item[0]}</TableCell>
                        <TableCell>{item[1]}</TableCell>
                        <TableCell>{item[2]}</TableCell>
                        <TableCell>{item[3]}</TableCell>
                        <TableCell>{item[4]}</TableCell>
                    </TableRow>
                ))}

            </TableBody>
        </Table>
    );
};

export default TableComponent;