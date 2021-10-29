import React from "react";
import {
  BooleanField,
  DateField,
  FunctionField,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";
// import { GroupMembers } from "./GroupMembers";

const getFeedsCount = (group): string => {
  return group.feeds.length;
};

const getMembersCount = (group): string => {
  return group.members.length;
};

export const GroupShow: React.FunctionComponent = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="name" label="nom" />
        <DateField source="createdAt" label="Created at" locales="fr-FR" />
        <DateField source="updatedAt" label="Updated at" locales="fr-FR" />
        <FunctionField
          label="Members count"
          render={(group) => getMembersCount(group)}
        />
        <FunctionField
          label="Feeds count"
          render={(group) => getFeedsCount(group)}
        />
        <BooleanField source="active" label="Active" />
        {/*<GroupMembers />*/}
      </SimpleShowLayout>
    </Show>
  );
};
