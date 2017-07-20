import * as React from "react";
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from "material-ui/Table";
import Quad from "../lib/quad";
export default class QuadTable extends React.Component<{ data: Quad[] }, {}> {
    render() {
        return (
            <Table selectable={false}>
                <TableHeader displaySelectAll={false} enableSelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>#</TableHeaderColumn>
                        <TableHeaderColumn>Operation</TableHeaderColumn>
                        <TableHeaderColumn>Source 1</TableHeaderColumn>
                        <TableHeaderColumn>Source 2</TableHeaderColumn>
                        <TableHeaderColumn>Destination</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {
                        this.props.data.map((v, i) => (
                            <TableRow key={i}>
                                <TableRowColumn>{i + 1}</TableRowColumn>
                                <TableRowColumn>{v.op}</TableRowColumn>
                                <TableRowColumn>{v.src1}</TableRowColumn>
                                <TableRowColumn>{v.src2}</TableRowColumn>
                                <TableRowColumn>{v.dest}</TableRowColumn>
                            </TableRow>)
                        )
                    }
                </TableBody>
            </Table>
        );
    }
}