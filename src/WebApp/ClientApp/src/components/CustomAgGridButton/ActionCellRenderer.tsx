import React from 'react';
import { Button, Stack } from '@mui/material';

const ActionCellRenderer = (params: any) => {
    let editingCells = params.api.getEditingCells();

    let isCurrentRowEditing = editingCells.some((cell: any) => {
        return cell.rowIndex === params.node.rowIndex;
    });

    if (isCurrentRowEditing) {
        return (
            <Stack direction="row" spacing={1}>
                <Button size="small" variant="contained" data-action="update">
                    update
                </Button>
                <Button size="small" variant="outlined" data-action="cancel">
                    cancle
                </Button>
            </Stack>
        );
    } else {
        return (
            <Stack direction="row" spacing={1}>
                <Button size="small" variant="contained" data-action="edit">
                    edit
                </Button>
                <Button size="small" variant="contained" color="secondary" data-action="delete">
                    delete
                </Button>
            </Stack>
        );
    }
};

export default ActionCellRenderer;