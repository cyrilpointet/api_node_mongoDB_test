import React from "react";
import { Create, SimpleForm, TextInput, PasswordInput } from "react-admin";

export const UserCreate: React.FunctionComponent = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="firstName" label="First name" />
      <TextInput source="lastName" label="Last name" />
      <TextInput source="email" label="email" />
      <PasswordInput source="password" label="password" />
    </SimpleForm>
  </Create>
);
