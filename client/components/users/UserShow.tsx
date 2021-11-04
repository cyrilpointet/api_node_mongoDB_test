import React from "react";
import { DateField, Show, SimpleShowLayout, TextField } from "react-admin";

export const UserShow: React.FunctionComponent = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <DateField source="createdAt" label="Created at" locales="fr-FR" />
        <TextField source="firstName" label="First name" />
        <TextField source="lastName" label="First name" />
        <TextField source="email" label="Email" />
      </SimpleShowLayout>
    </Show>
  );
};
