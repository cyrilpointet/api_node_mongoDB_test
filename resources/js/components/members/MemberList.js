import { Datagrid, FunctionField, List, TextField } from "react-admin";
import * as React from "react";

export const MemberList = (props) => {
  const getGroupsNames = (member) => {
    let groups = [];
    if (member && member.groups) {
      member.groups.forEach((group) => {
        groups.push(group.name);
      });
    }
    return groups.join("; ");
  };

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
