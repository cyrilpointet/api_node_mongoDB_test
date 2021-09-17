import React from "react";
import { Datagrid, FunctionField, List, TextField } from "react-admin";

const getGroupsNames = (member): string => {
  const groups = [];
  if (member && member.groups) {
    member.groups.forEach((group) => {
      groups.push(group.name);
    });
  }
  return groups.join("; ");
};

export const MemberList: React.FunctionComponent = (props) => {
  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <TextField source="name" label="Nom" />
        <TextField source="email" label="Email" />
        <FunctionField
          label="Groupes"
          render={(member) => getGroupsNames(member)}
        />
      </Datagrid>
    </List>
  );
};
