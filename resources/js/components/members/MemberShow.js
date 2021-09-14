import {Show, SimpleShowLayout, TextField} from "react-admin";
import * as React from "react";
import {MembersGroups} from "./MemberGroups";

export const MemberShow = props => {
    return (
        <Show {...props}>
            <SimpleShowLayout>
                <TextField source="name" label="nom" />
                <TextField source="email" label="email" />
                <MembersGroups />
            </SimpleShowLayout>
        </Show>
    )
}
