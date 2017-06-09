import React from "react";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
export default class TokenTable extends React.Component {
    render() {
        return (
            <Table selectable={false}>
                <TableHeader displaySelectAll={false} enableSelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>#</TableHeaderColumn>
                        <TableHeaderColumn>Type</TableHeaderColumn>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Line</TableHeaderColumn>
                        <TableHeaderColumn>Column</TableHeaderColumn>
                        <TableHeaderColumn>Start Ptr</TableHeaderColumn>
                        <TableHeaderColumn>End Ptr</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {
                        this.props.tokens.map((v, i) => (
                            <TableRow key={i}>
                                <TableRowColumn>{i + 1}</TableRowColumn>
                                <TableRowColumn className={v.type}>{v.type}</TableRowColumn>
                                <TableRowColumn>{v.name}</TableRowColumn>
                                <TableRowColumn>{v.line}</TableRowColumn>
                                <TableRowColumn>{v.column}</TableRowColumn>
                                <TableRowColumn>{v.bp}</TableRowColumn>
                                <TableRowColumn>{v.cp}</TableRowColumn>
                            </TableRow>)
                        )
                    }
                </TableBody>
            </Table>
        );
    }
}