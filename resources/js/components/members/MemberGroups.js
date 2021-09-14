import {useRecordContext} from "react-admin";
import {List, ListItem, ListItemText, Typography, ListItemSecondaryAction, IconButton} from "@material-ui/core";
import * as React from "react";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useHistory } from 'react-router-dom';

export const MembersGroups = (props) => {
    const history = useHistory();

    const handleclick = function(id) {
        history.push(`/group/${id}/show`);
    }

    function getGroups () {
        const member = useRecordContext(props);
        const groups = [];
        member.groups.forEach(group => {
            groups.push(
                <ListItem variant="body2" key={group._id} button onClick={() => handleclick(group._id)} dense>
                    <ListItemText primary={group.name} />
                    <IconButton>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </ListItem>
            );
        });
        return groups;
    }

    return (
        <>
            <Typography variant="caption">Groupes</Typography>
            <List>
                { getGroups() }
            </List>
        </>

    );
}
