import React from "react";
import {
  Datagrid,
  List,
  TextField,
  FunctionField,
  EditButton,
} from "react-admin";

const getMembersNames = (group) => {
  const members = [];
  if (group && group.members) {
    group.members.forEach((member) => {
      members.push(member.name);
    });
  }
  return members.join("; ");
};

export const GroupList: React.FunctionComponent = (props) => {
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
