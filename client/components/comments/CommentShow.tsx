import React from "react";
import {
  DateField,
  FunctionField,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";

const getAuthorName = (comment): string => {
  return comment.author.name;
};

export const CommentShow: React.FunctionComponent = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <DateField source="createdAt" label="Created at" locales="fr-FR" />
        <TextField source="message" label="Message" />
        <FunctionField
          label="Author"
          render={(comment) => getAuthorName(comment)}
        />
      </SimpleShowLayout>
    </Show>
  );
};
