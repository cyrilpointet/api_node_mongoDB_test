import React from "react";
import {
  BooleanField,
  FunctionField,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";
import { MembersGroups } from "./MemberGroups";
import { Avatar } from "@material-ui/core";

export const MemberShow: React.FunctionComponent = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <FunctionField
          label="Groupes"
          render={(member) => <Avatar src={member.pictureLink} />}
        />
        <TextField source="name" label="nom" />
        <TextField source="email" label="email" />
        <TextField source="department" label="department" />
        <BooleanField source="hasCustomPicture" label="has custom picture" />
        <MembersGroups />
      </SimpleShowLayout>
    </Show>
  );
};
