import * as React from "react";
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from "material-ui/Table";
import "./TokenTable.css";
import Token from "../lib/token";
export default class TokenTable extends React.Component<{ tokens: Token[] }, {}> {
    render() {
        return (
            <Table selectable={false}>
                <TableHeader displaySelectAll={false} enableSelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>#</TableHeaderColumn>
                        <TableHeaderColumn>Type</TableHeaderColumn>
                        <TableHeaderColumn>Text</TableHeaderColumn>
                        <TableHeaderColumn>Start, End</TableHeaderColumn>
                        <TableHeaderColumn>Line, Column</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {
                        this.props.tokens.map((v, i) => (
                            <TableRow key={i}>
                                <TableRowColumn>{i + 1}</TableRowColumn>
                                <TableRowColumn className={v.type}>{v.type}</TableRowColumn>
                                <TableRowColumn>{v.text}</TableRowColumn>
                                <TableRowColumn>{`[${v.bp}, ${v.cp})`}</TableRowColumn>
                                <TableRowColumn>{`(${v.rc}, ${v.cc})`}</TableRowColumn>
                            </TableRow>)
                        )
                    }
                </TableBody>
            </Table>
        );
    }
}