import {Show, SimpleShowLayout, TextField} from "react-admin";
import * as React from "react";
import {GroupMembersList} from "./GroupMembersList";

export const GroupShow = props => {
    return (
        <Show {...props}>
            <SimpleShowLayout>
                <TextField source="name" label="nom" />
                <GroupMembersList />
            </SimpleShowLayout>
        </Show>
    )
}
