import {useRecordContext} from "react-admin";
import {List, ListItem, ListItemText, Typography} from "@material-ui/core";
import * as React from "react";

export const GroupMembersList = (props) => {

    function getMembers () {
        const group = useRecordContext(props);
        const members = [];
        members.push(
            <Typography variant="caption">Membres</Typography>
        );
        group.members.forEach(member => {
            members.push(
                <ListItem variant="body2" key={member._id}>
                    <ListItemText primary={member.name} />
                </ListItem>
            );
        });
        return members;
    }
    return (
        <List>
            { getMembers() }
        </List>

    );
}
