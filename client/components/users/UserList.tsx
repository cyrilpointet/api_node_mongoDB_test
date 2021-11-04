import React from "react";
import { Datagrid, DateField, List, TextField } from "react-admin";

export const UserList: React.FunctionComponent = (props) => {
  return (
    <List {...props} bulkActionButtons={false}>
      <Datagrid rowClick="show">
        <DateField source="createdAt" label="Created at" locales="fr-FR" />
        <TextField source="firstName" label="First name" />
        <TextField source="lastName" label="First name" />
        <TextField source="email" label="Email" />
      </Datagrid>
    </List>
  );
};
