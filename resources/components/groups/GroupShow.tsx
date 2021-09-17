import React from "react";
import { Show, SimpleShowLayout, TextField } from "react-admin";
import { GroupMembers } from "./GroupMembers";

export const GroupShow: React.FunctionComponent = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="name" label="nom" />
        <GroupMembers />
      </SimpleShowLayout>
    </Show>
  );
};
