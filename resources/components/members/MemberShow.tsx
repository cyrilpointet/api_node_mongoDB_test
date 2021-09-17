import React from "react";
import { Show, SimpleShowLayout, TextField } from "react-admin";
import { MembersGroups } from "./MemberGroups";

export const MemberShow: React.FunctionComponent = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="name" label="nom" />
        <TextField source="email" label="email" />
        <MembersGroups />
      </SimpleShowLayout>
    </Show>
  );
};
