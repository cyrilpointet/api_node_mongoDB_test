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
import * as React from "react";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { useHistory } from "react-router-dom";
import { useState } from "react";

export const GroupMembers = (props) => {
  const history = useHistory();
  const [group] = useState(useRecordContext(props));

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
            {group.members.map((member) => (
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
