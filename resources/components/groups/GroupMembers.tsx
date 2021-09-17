import React from "react";
import { useRecordContext } from "react-admin";
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { useHistory } from "react-router-dom";

export const GroupMembers: React.FunctionComponent = (props) => {
  const history = useHistory();

  const handleclick = function (id) {
    history.push(`/member/${id}/show`);
  };

  return (
    <>
      <Typography variant="caption">Membres</Typography>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell colSpan={2}>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {useRecordContext(props).members.map((member) => (
              <TableRow
                key={member._id}
                onClick={() => handleclick(member._id)}
              >
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <ArrowForwardIosIcon />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
