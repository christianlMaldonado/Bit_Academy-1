import React from "react";
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

export function Container(props) {
  return <TableContainer {...props}>{props.children}</TableContainer>;
}

export function TBody(props) {
  return <TableBody {...props}>{props.children}</TableBody>;
}

export function Row(props) {
  return <TableRow {...props}>{props.children}</TableRow>;
}

export function Header(props) {
  return <TableHead {...props}>{props.children}</TableHead>;
}

export function Cell(props) {
  return <TableCell {...props}>{props.children}</TableCell>;
}

export function Tbl(props) {
  const useStyles = makeStyles({
    table: {
      mminWidth: 650,
    },
  });
  const classes = useStyles();

  return (
    <Table className={classes.table} size="small" aria-label="a dense table">
      {props.children}
    </Table>
  );
}
