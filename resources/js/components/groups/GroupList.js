import {
  Datagrid,
  List,
  TextField,
  FunctionField,
  EditButton,
} from "react-admin";
import * as React from "react";

export const GroupList = (props) => {
  const getMembersNames = (group) => {
    let members = [];
    if (group && group.members) {
      group.members.forEach((member) => {
        members.push(member.name);
      });
    }
    return members.join("; ");
  };

  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <TextField source="name" label="Nom" />
        <FunctionField
          label="Membres"
          render={(group) => getMembersNames(group)}
        />
        <EditButton />
      </Datagrid>
    </List>
  );
};
